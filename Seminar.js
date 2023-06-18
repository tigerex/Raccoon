var processes = [];
var process = 1;
var currentTime = 0;
var averageWaitingTime = 0.0;
var averageTurnaroundTime = 0.0;
var averageResponeTime = 0.0;

function addProcess() {
  var burstTimeInput = document.getElementById('burstTimeInput');
  var arrivalTimeInput = document.getElementById('arrivalTimeInput');
  var typeScheInput = document.getElementById('selectID');
  var processList = document.getElementById('processList');
  var burstTime = parseInt(burstTimeInput.value);
  var arrivalTime = parseInt(arrivalTimeInput.value);
  var typeSche = typeScheInput.value;

  //Check Input
  if (isNaN(arrivalTime) && isNaN(burstTime)) {
    window.alert("Please enter valid inputs");
    return;
  }
  if (isNaN(arrivalTime)) {
    window.alert("Please enter numeric value of arrival time");
    return;
  }
  if (isNaN(burstTime)) {
    window.alert("Please enter numeric value of burst time");
    return;
  }
  if (arrivalTime<0 && burstTime<=0) {
    window.alert("Invalid inputs");
    return;
  }
  if (arrivalTime<0) {
    window.alert("Please enter valid value of arrival time");
    return;
  }
  if (burstTime<=0) {
    window.alert("Please enter positive value of burst time");
    return;
  }

  if (process !== '' && !isNaN(burstTime) && burstTime > 0 && !isNaN(arrivalTime) && arrivalTime >= 0) {
    
    //Show Input
    var li = document.createElement('li');
    li.appendChild(document.createTextNode('P' + process + ':\t(AT: ' + arrivalTime + ', BT: ' + burstTime + ')\t-\t' + typeSche));
    processList.appendChild(li);
    burstTimeInput.value = '';
    arrivalTimeInput.value = '';
    
    //Saved Input
    processes.push({ 
      process: process, 
      burstTime: burstTime,
      remainingTime: burstTime, 
      arrivalTime: arrivalTime, 
      responeTime: 0,
      firstTimeExecute: 0,
      waitingTime: 0,
      turnaroundTime: 0,
      completeTime: 0,
      available: 0,
      finish: 0,
      typeSche: typeSche,
      color: getRandomColor()
    });
  }
  process += 1;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function clearData(){
  var cleanList = document.getElementById("processList");
  cleanList.innerHTML = "";
  processes = [];
  process = 1;
  currentTime = 0;
  averageWaitingTime = 0.0;
  averageTurnaroundTime = 0.0;
  averageResponeTime = 0.0;
  var cleanOperation = document.getElementById('operations');
  cleanOperation.innerHTML = "";
  console.clear();
}

function multilevelQueue(){
  var operation = document.getElementById('operations');
  operation.innerHTML = "";
  var br = document.createElement("br");

  //Sort Processes by Arrive Time
  processes.sort(function (a, b){
    return a.arrivalTime - b.arrivalTime;
  });

  currentTime = 0;
  var quantum = 2;
  var n = processes.length;
  var done = 0;
  var count = 0;
  var k = -1;
  const ready = [];

  //Push all Process with Arrive Time = 0 to Ready
  var i = 0;
  for(i = 0; i < n; i++){
    if(processes[i].arrivalTime == 0){
      ready.push(i);
      processes[i].available = 1;
    }
  }

  //Execute Processes
  while(done != 1){
    console.log(currentTime);
    console.log(ready);
    k = ready.shift();
    var currentTimeTemp;

    //Found That None Process have Arrive Time = 0
    if(k == undefined){
      currentTimeTemp = currentTime;
      for(i = 0; i < n; i++){
        if(processes[i].finish == 0){
          break;
        }
      }
      currentTime = processes[i].arrivalTime;
      
      //Show There is no Process have Arrive Time = 0
      var newdiv = document.createElement("div");
      newdiv.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
      newdiv.textContent = "Current Time = " + currentTimeTemp + ": CPU is idle.";
      operation.appendChild(br);
      operation.appendChild(newdiv);
      operation.appendChild(br);

      //Push the Process Which Have Arrive Time = Current Time to Ready Queue
      for(i = 0; i < n; i++){
        if(processes[i].arrivalTime == currentTime){
          ready.push(i);
        }
      }
    }

    //There is Process have Arrive Time = 0
    else{

      //Show Which Process Being Executed
      var newdiv = document.createElement("div");
      newdiv.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
      newdiv.textContent = "Current Time = " + currentTime + ": Process-" + processes[k].process + " entered CPU and being executed";
      operation.appendChild(br);
      operation.appendChild(newdiv);
      operation.appendChild(br);

      //Foreground RR
      if(processes[k].typeSche == "Foreground"){

        //Process First Time Being Execute
        processes[k].firstTimeExecute += 1;
        if(processes[k].firstTimeExecute == 1){
          processes[k].responeTime = currentTime - processes[k].arrivalTime;
        }
       
        //Process Have Remaining Time Equal or Less Than Quantum
        if(processes[k].remainingTime <= quantum){
          processes[k].finish = 1;
          count += 1;
          processes[k].completeTime = currentTime + processes[k].remainingTime;
          processes[k].turnaroundTime = processes[k].completeTime - processes[k].arrivalTime;
          processes[k].waitingTime = processes[k].turnaroundTime - processes[k].burstTime;
          processes[k].remainingTime = 0;
          currentTime = processes[k].completeTime;
        }

        //Process Have Remaining Time More Than Quantum
        else{
          processes[k].available = 1;
          processes[k].remainingTime -= quantum;
          currentTime += quantum;
        }

        //Push Process Have Arrive Time Between Quantum Processing
        for(i = 0; i < n; i++){
          if(processes[i].arrivalTime > currentTime - quantum && processes[i].arrivalTime <= currentTime){
            processes[i].available = 1;
            ready.push(i);
          }
        }

        //Process Still Have Remaining Time Being Push to Back
        if(processes[k].remainingTime > 0){
          ready.push(k);
        }
      }

      //Background FCFS
      else{

        //Check If There Are Still Foreground Process Haven't Done Yet
        var flag = 0;
        var flagII = 0;
        for(i = 0; i < n; i++){
          if(processes[i].typeSche == "Foreground" && processes[i].finish == 0){
            flag = 1;

            //Check If There Are Foreground Process Have Arrive Time More than Current Time
            if(processes[i].arrivalTime > currentTime){
              flagII = 1;
              break;
            }
            break;
          }
        }

        //There Are Still Foreground Processes Left
        if(flag == 1 && processes[k].available == 0){
          processes[k].remainingTime -= 1;
          processes[k].available = 1;
        
          //Process First Time Being Execute
          processes[k].firstTimeExecute += 1;
          if(processes[k].firstTimeExecute == 1){
            processes[k].responeTime = currentTime - processes[k].arrivalTime;
          }

          //FCFS Finish Scheduling
          if(processes[k].remainingTime == 0){
            processes[k].finish = 1;
            processes[k].completeTime = currentTime + 1;
            processes[k].turnaroundTime = processes[k].completeTime - processes[k].arrivalTime;
            processes[k].waitingTime = processes[k].turnaroundTime - processes[k].burstTime;
            count += 1;
          }
          currentTime += 1;

          //Push Process Have Been Arrived But not Done Scheduling
          for(i = 0; i < n; i++){
            if(processes[i].arrivalTime <= currentTime && processes[i].finish == 0 && processes[i].available == 0){
              ready.push(i);
            }
          }    

          //FCFS Been Interupted By RR
          if(processes[k].remainingTime > 0){
            ready.push(k);
          }
        }

        //Execute Background Process Until Foreground Process Arrive Time
        else if(flag == 1 && processes[k].available == 1 && flagII == 1){
          processes[k].available = 1;
          
          //Process First Time Being Execute
          processes[k].firstTimeExecute += 1;
          if(processes[k].firstTimeExecute == 1){
            processes[k].responeTime = currentTime - processes[k].arrivalTime;
          }          

          //Find Foreground Process Have Arrive Time More than Current Time
          for(i = 0; i < n; i++){
            if(processes[i].typeSche == "Foreground" && processes[i].arrivalTime > currentTime && processes[i].available == 0){
              var math = processes[i].arrivalTime - currentTime;
              currentTime += math;
              processes[k].remainingTime -= math;
              break;
            }
          }

          //FCFS Finish Scheduling
          if(processes[k].remainingTime == 0){
            processes[k].finish = 1;
            processes[k].completeTime = currentTime;
            processes[k].turnaroundTime = processes[k].completeTime - processes[k].arrivalTime;
            processes[k].waitingTime = processes[k].turnaroundTime - processes[k].burstTime;
            count += 1;
          }

          //Push Process Have Been Arrived But not Done Scheduling
          for(i = 0; i < n; i++){
            if(processes[i].arrivalTime <= currentTime && processes[i].finish == 0 && processes[i].available == 0){
              ready.push(i);
            }
          } 

          //Background Process Still Remaining
          if(processes[k].remainingTime > 0){
            ready.push(k);
          }
        }

        //Push Background Process to the Back of Ready Queue / Skip this Process
        else if(flag == 1 && processes[k].available == 1){
          var newdiv = document.createElement("div");
          newdiv.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
          newdiv.textContent = "<< This Process-" + processes[k].process + " is in Background Queue so It Been Push Back to Last Queue >>";
          operation.appendChild(br);
          operation.appendChild(newdiv);
          operation.appendChild(br);
          ready.push(k);
        }

        //There is None Foreground Process Left
        else{

          //Process First Time Being Execute
          processes[k].firstTimeExecute += 1;
          if(processes[k].firstTimeExecute == 1){
            processes[k].responeTime = currentTime - processes[k].arrivalTime;
          }

          currentTime += processes[k].remainingTime;
          processes[k].available = 1;
          processes[k].remainingTime = 0;
          processes[k].finish = 1;
          processes[k].completeTime = currentTime;
          processes[k].turnaroundTime = processes[k].completeTime - processes[k].arrivalTime;
          processes[k].waitingTime = processes[k].turnaroundTime - processes[k].burstTime;
          count += 1;

          //Push Process Have Been Arrived
          for(i = 0; i < n; i++){
            if(processes[i].arrivalTime <= currentTime && processes[i].finish == 0 && processes[i].available == 0){
              processes[i].available = 1;
              ready.push(i);
            }
          }
        }
      }
    }

    //Stop Execute
    if(count == n){
      done = 1;
    }
  }

  //Calculate Average Waiting Time & Average Turnaround Time
  var total_turnaroundTime = 0.0, total_waitingTime = 0.0, total_responeTime = 0.0;
  for(i = 0; i < n; i++){
    total_responeTime += processes[i].responeTime;
    total_turnaroundTime += processes[i].turnaroundTime;
    total_waitingTime += processes[i].waitingTime;
  }
  averageTurnaroundTime = (total_turnaroundTime / n).toFixed(2);
  averageWaitingTime = (total_waitingTime / n).toFixed(2);
  averageResponeTime = (total_responeTime / n).toFixed(2);

  for(i = 0; i < n; i++){
    console.log(processes[i].responeTime);
  }

  for(i = 0; i < n; i++){
    console.log(processes[i].waitingTime);
  }

  for(i = 0; i < n; i++){
    console.log(processes[i].turnaroundTime);
  }

  console.log(averageResponeTime);
  console.log(averageWaitingTime);
  console.log(averageTurnaroundTime);
}

function showOutput(){
  if(processes.length <= 0){
    alert("No Process to Schedule!");
    return;
  }

  for(let i = 0; i < processes.length; i++){
    processes[i].remainingTime = processes[i].burstTime;
    processes[i].finish = 0;
    processes[i].available = 0;
  }

  multilevelQueue()
}
