var tasks = [];

function addTask() {
  var taskInput = document.getElementById('taskInput');
  var burstTimeInput = document.getElementById('burstTimeInput');
  var arrivalTimeInput = document.getElementById('arrivalTimeInput');
  var taskList = document.getElementById('taskList');
  var task = taskInput.value;
  var burstTime = parseInt(burstTimeInput.value);
  var arrivalTime = parseInt(arrivalTimeInput.value);
  if (task !== '' && !isNaN(burstTime) && burstTime > 0 && !isNaN(arrivalTime) && arrivalTime >= 0) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(task + ' (' + burstTime + ', ' + arrivalTime + ')'));
    taskList.appendChild(li);
    taskInput.value = '';
    burstTimeInput.value = '';
    arrivalTimeInput.value = '';
    tasks.push({ task: task, burstTime: burstTime, arrivalTime: arrivalTime, color: getRandomColor() });
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function startScheduling() {
  var algorithmSelect = document.getElementById('algorithmSelect');
  var selectedAlgorithm = algorithmSelect.value;
  var output = document.getElementById('output');
  output.innerHTML = '';

  if (selectedAlgorithm === 'fcfs') {
    fcfsScheduling(output);
  } else if (selectedAlgorithm === 'sjf') {
    sjfScheduling(output);
  } else if (selectedAlgorithm === 'srtf') {
    srtfScheduling(output);
  } else if (selectedAlgorithm === 'roundRobin') {
    var quantum = 2;
    roundRobinScheduling(output, quantum);
  } else if (selectedAlgorithm === 'io') {
    var ioTime = 3;
    ioScheduling(output, ioTime);
  }
}

function fcfsScheduling(output) {
  tasks.sort(function(a, b) {
    return a.arrivalTime - b.arrivalTime;
  });

  var currentTime = tasks[0].arrivalTime;
  var totalTime = 0;

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var waitingTime = currentTime - task.arrivalTime;
    output.innerHTML += '<p>Executing task: ' + task.task + ' (' + task.burstTime + ', ' + task.arrivalTime + ')</p>';
    output.innerHTML += '<p>Waiting time: ' + waitingTime + '</p>';
    currentTime += task.burstTime;
    totalTime += task.burstTime;
  }

  output.innerHTML += '<p>Total execution time: ' + totalTime + '</p>';
}

function sjfScheduling(output) {
  tasks.sort(function(a, b) {
    return a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime;
  });

  var currentTime = tasks[0].arrivalTime;
  var totalTime = 0;

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var waitingTime = currentTime - task.arrivalTime;
    output.innerHTML += '<p>Executing task: ' + task.task + ' (' + task.burstTime + ', ' + task.arrivalTime + ')</p>';
    output.innerHTML += '<p>Waiting time: ' + waitingTime + '</p>';
    currentTime += task.burstTime;
    totalTime += task.burstTime;
  }

  output.innerHTML += '<p>Total execution time: ' + totalTime + '</p>';
}

function srtfScheduling(output) {
  tasks.sort(function(a, b) {
    return a.arrivalTime - b.arrivalTime;
  });

  var remainingTimes = tasks.map(function(task) {
    return task.burstTime;
  });

  var completed = 0;
  var currentTime = tasks[0].arrivalTime;
  var totalTime = 0;

  while (completed !== tasks.length) {
    var minTime = Infinity;
    var minIndex = -1;

    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].arrivalTime <= currentTime && remainingTimes[i] > 0 && remainingTimes[i] < minTime) {
        minTime = remainingTimes[i];
        minIndex = i;
      }
    }

    if (minIndex === -1) {
      currentTime++;
      continue;
    }

    var task = tasks[minIndex];
    output.innerHTML += '<p>Executing task: ' + task.task + ' (' + minTime + ', ' + task.arrivalTime + ')</p>';
    remainingTimes[minIndex]--;
    currentTime++;
    totalTime++;

    if (remainingTimes[minIndex] === 0) {
      completed++;
      output.innerHTML += '<p>Task ' + task.task + ' completed</p>';
    }
  }

  output.innerHTML += '<p>Total execution time: ' + totalTime + '</p>';
}

function roundRobinScheduling(output, quantum) {
  var remainingTimes = tasks.map(function(task) {
    return task.burstTime;
  });

  var completed = 0;
  var currentTime = tasks[0].arrivalTime;
  var totalTime = 0;

  while (completed !== tasks.length) {
    for (var i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      if (task.arrivalTime <= currentTime && remainingTimes[i] > 0) {
        var time = Math.min(quantum, remainingTimes[i]);
        output.innerHTML += '<p>Executing task: ' + task.task + ' (' + time + ', ' + task.arrivalTime + ')</p>';
        remainingTimes[i] -= time;
        currentTime += time;
        totalTime += time;

        if (remainingTimes[i] === 0) {
          completed++;
          output.innerHTML += '<p>Task ' + task.task + ' completed</p>';
        } else if (remainingTimes[i] > 0 && remainingTimes[i] % quantum === 0) {
          output.innerHTML += '<p>Task ' + task.task + ' paused for I/O</p>';
          output.innerHTML += '<p>Waiting for ' + task.task + ' to complete I/O...</p>';
          task.burstTime += 3;
          currentTime += 3;
          output.innerHTML += '<p>Resuming task ' + task.task + ' after I/O</p>';
        }
      }
    }
  }

  output.innerHTML += '<p>Total execution time: ' + totalTime + '</p>';
}

function ioScheduling(output, ioTime) {
  tasks.sort(function(a, b) {
    return a.arrivalTime - b.arrivalTime;
  });

  var remainingTimes = tasks.map(function(task) {
    return task.burstTime;
  });

  var completed = 0;
  var currentTime = tasks[0].arrivalTime;
  var totalTime = 0;

  while (completed !== tasks.length) {
    for (var i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      if (task.arrivalTime <= currentTime && remainingTimes[i] > 0) {
        var time = Math.min(ioTime, remainingTimes[i]);
        output.innerHTML += '<p class="task-progress io">Executing I/O for task: ' + task.task + ' (' + time + ', ' + task.arrivalTime + ')</p>';
        remainingTimes[i] -= time;
        currentTime += time;
        totalTime += time;

        if (remainingTimes[i] === 0) {
          completed++;
          output.innerHTML += '<p>Task ' + task.task + ' completed</p>';
        } else if (remainingTimes[i] > 0) {
          output.innerHTML += '<p>Task ' + task.task + ' paused for I/O</p>';
          output.innerHTML += '<p>Waiting for ' + task.task + ' to complete I/O...</p>';
          task.burstTime += ioTime;
          currentTime += ioTime;
          output.innerHTML += '<p>Resuming task ' + task.task + ' after I/O</p>';
        }
      }
    }
  }

  output.innerHTML += '<p>Total execution time: ' + totalTime + '</p>';
}

