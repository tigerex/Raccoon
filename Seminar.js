var processes = [];
var process = 1;
var quantum = 0;
var quantumIsSet = 0;
var currentTime = 0;
var averageWaitingTime = 0.0;
var averageTurnaroundTime = 0.0;
var averageResponeTime = 0.0;
var gantt = [];
var colors = ["#FF0000", "#05FF00", "#F2FF00", "#00C9FF", "#FF00F5", "#FF9100", "#004FFF", "#8000FF", "#00FFA3", "#B4CF49"];


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setQuantum(){
  var quantumInput = document.getElementById("quantum");
  var quantum1 = parseInt(quantumInput.value);
  
  //Check Quantum
  if (isNaN(quantum1)) {
    window.alert("Please enter valid inputs");
    return;
  }
  
  if (quantum1 <= 0) {
    window.alert("Invalid Inputs");
    return;
  }

  if(quantumIsSet == 1){
    window.alert("Quantum Has Been Set");
    return;
  }

  if(!isNaN(quantum1) && quantum1 > 0){
    
    //Show Quantum
    var showQuantum = document.getElementById("quantumNumber");
    var p = document.createElement('pi');
    p.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
    p.textContent = "Quantum = " + quantum1;
    showQuantum.appendChild(p);
    quantumInput.value = '';
  
    //Saved Quantum
    quantum = quantum1;
    quantumIsSet = 1;
    console.log("Quantum: " + quantum);
  }
}

function addProcess() {
  var burstTimeInput = document.getElementById('burstTimeInput');
  var arrivalTimeInput = document.getElementById('arrivalTimeInput');
  var typeScheInput = document.getElementById('selectID');
  var processList = document.getElementById('processList');
  var burstTime = parseInt(burstTimeInput.value);
  var arrivalTime = parseInt(arrivalTimeInput.value);
  var typeSche = typeScheInput.value;

  //Check Input
  if(quantumIsSet == 0){
    window.alert("Set Quantum First");
    return;
  }

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
    li.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
    li.textContent = 'Process-' + process + ' (Arrival Time: ' + arrivalTime + ', Burst Time: ' + burstTime + ') Queue: ' + typeSche;
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
      color: getRandomColor(),
    });
  }
  process += 1;
}

function clearData(){
  var cleanList = document.getElementById("processList");
  cleanList.innerHTML = "";
  var showQuantum = document.getElementById("quantumNumber");
  showQuantum.innerHTML = "";
  var cleanOperation = document.getElementById('operations');
  cleanOperation.innerHTML = "";
  var table = document.getElementById("processTable");
  table.innerHTML = "";
  var thead = document.getElementById("tableHead");
  thead.innerHTML = "";
  var gt = document.getElementById("gantt");
  gt.innerHTML = "";
  var timer1 = document.getElementById("timer");
  timer1.innerHTML = "";
  var art2 = document.getElementById("art1");
  art2.innerHTML = "";
  var awt2 = document.getElementById("awt1");
  awt2.innerHTML = "";
  var atat2 = document.getElementById("atat1");
  atat2.innerHTML = "";
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  processes = [];
  process = 1;
  quantum = 0;
  quantumIsSet = 0;
  currentTime = 0;
  averageWaitingTime = 0.0;
  averageTurnaroundTime = 0.0;
  averageResponeTime = 0.0;
  gantt = [];
  console.clear();
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

  multilevelQueue();

  //This is For Output Table
  var table = document.getElementById("processTable");
  table.innerHTML = "";
  var thead = document.getElementById("tableHead");
  thead.innerHTML = "";

  var tableTitle = document.createElement("tr");
  var tableHeading1 = document.createElement("th");
  tableHeading1.textContent = "Process ID";
  tableTitle.appendChild(tableHeading1);

  var tableHeading2 = document.createElement("th");
  tableHeading2.textContent = "Arrival Time";
  tableTitle.appendChild(tableHeading2);
  
  var tableHeading3 = document.createElement("th");
  tableHeading3.textContent = "Burst Time";
  tableTitle.appendChild(tableHeading3);

  var tableHeading4 = document.createElement("th");
  tableHeading4.textContent = "Completion Time";
  tableTitle.appendChild(tableHeading4);

  var tableHeading5 = document.createElement("th");
  tableHeading5.textContent = "Respond Time";
  tableTitle.appendChild(tableHeading5);

  var tableHeading6 = document.createElement("th");
  tableHeading6.textContent = "Waiting Time";
  tableTitle.appendChild(tableHeading6);

  var tableHeading7 = document.createElement("th");
  tableHeading7.textContent = "Turnaround Time";
  tableTitle.appendChild(tableHeading7);

  var tableHeading8 = document.createElement("th");
  tableHeading8.textContent = "Queue";
  tableTitle.appendChild(tableHeading8);
  
  thead.appendChild(tableTitle);
  drawTable();

  //This is For Average Time
  var art2 = document.getElementById("art1");
  var awt2 = document.getElementById("awt1");
  var atat2 = document.getElementById("atat1");
  art2.innerHTML = "";
  awt2.innerHTML = "";
  atat2.innerHTML = "";

  var p1 = document.createElement("p");
  p1.textContent = "Average Respone Time: " + averageResponeTime + " m/s";
  awt2.appendChild(p1);
  var p2 = document.createElement("p");
  p2.textContent = "Average Waiting Time: " + averageWaitingTime + " m/s";
  awt2.appendChild(p2);
  var p3 = document.createElement("p");
  p3.textContent = "Average Turnaround Time: " + averageTurnaroundTime + " m/s"; 
  atat2.appendChild(p3);

  //This is For Gantt Chart
  var gt = document.getElementById("gantt");
  gt.innerHTML = "";
  var timer1 = document.getElementById("timer");
  timer1.innerHTML = "";

  drawGanttChart();

  //from this point to the end of this function is for building gantt chart using tag canvas

  // Calculate total execution time
  const totalExecutionTime = calculateTotalExecutionTime(processes);

  // Calculate the width of each time unit in the canvas
  const timeUnitWidth = 1000 / totalExecutionTime;

  // Get the canvas element
  const canvas = document.getElementById('myCanvas');
  const context = canvas.getContext('2d');

  // Draw the Gantt chart
  let temCurrentTime = 0;
  let yOffset = 60; // Initial y-offset for the process rows

  // Draw process rows and process titles
  for (var i = 0; i < processes.length; i++) {
    // const process = processes[i];
    const y = yOffset + i * 50;

    // Draw process title
    context.fillStyle = '#000';
    context.font = '15px Arial';
    context.fillText('P-'+ processes[i].process + ': ', 10, y + 20);
    context.fillText(processes[i].typeSche, 10, y + 40);

    // Draw horizontal line for the process row
    context.strokeStyle = '#ccc';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();

    const x = temCurrentTime * timeUnitWidth + 100;
    const burstTime = processes[i].burstTime;
    let width = burstTime * timeUnitWidth;

    // Apply time quantum for RR queue
    if (processes[i].typeSche === 'Foreground') {
      width = Math.min(width, quantum * timeUnitWidth);
    }

    // Draw Gantt chart rectangle
    context.fillStyle = getRandomColor();
    context.fillRect(x, y + 30, width, 20);

    // Draw start time number
    context.fillStyle = '#000';
    context.font = '12px Arial';
    context.fillText(temCurrentTime.toString(), x, y + 15);

    // Draw end time number
    context.fillText((temCurrentTime + burstTime).toString(), x + width - 10, y + 15);

    temCurrentTime += burstTime;

    // Check if there is remaining burst time for RR queue
    if (processes[i].typeSche === 'Foreground' && burstTime > quantum) {
      const remainingBurstTime = burstTime - quantum;
      temCurrentTime += remainingBurstTime;
    }
  }

  // Draw vertical timer stamp
  for (let i = 0; i <= totalExecutionTime; i++) {
    const x = i * timeUnitWidth + 100;

    // Draw line
    context.strokeStyle = '#ddd';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x, yOffset - 20);
    context.lineTo(x, yOffset + processes.length * 50);
    context.stroke();

    // Draw time label
    context.fillStyle = 'blue';
    context.font = '10px Arial';
    context.fillText(i.toString(), x - 2.5, yOffset - 25);
    }
}

function calculateTotalExecutionTime(processes) {
  let totalExecutionTime = 0;
  for (let i = 0; i < processes.length; i++) {
    totalExecutionTime += processes[i].burstTime;
  }
  return totalExecutionTime;
}

function multilevelQueue(){
  gantt = [];
  currentTime = 0;
  var tgantt = [];
  var n = processes.length;
  var done = 0;
  var count = 0;
  var k = 0;
  var foreground = [];
  var background = [];
  

  var operation = document.getElementById('operations');
  operation.innerHTML = "";
  var br = document.createElement("br");

  
  //Sort Processes by Arrive Time
  processes.sort(function (a, b){
    return a.arrivalTime - b.arrivalTime;
  });
  
  console.log(processes[0]);
  console.log(foreground[0]);
  
  

  function opening(){
    for(var i = 0; i < n; i++){
      if(processes[i].arrivalTime == currentTime && processes[i].typeSche == "Foreground"){
        processes[i].available = 1;
        foreground.push(processes[i]);
      }
      else if(processes[i].arrivalTime == currentTime && processes[i].typeSche == "Background"){
        background.push(processes[i]);
        processes[i].available = 1;
      }
    }
  }
  opening();
  
  //Execute Processes
  while(done != 1){
    console.log("Current Time: " + currentTime);
    console.log("Foreground: ");
    console.log(foreground);
    console.log(foreground.length);
    console.log("Background: ");
    console.log(background);
    
    //Run Foreground processes
    while(foreground.length != 0){
      console.log("Current Time: " + currentTime);
      console.log("Foreground: ");
      console.log(foreground);

      k = foreground.shift();
      
      //Show Which Process Being Executed
      var newdiv = document.createElement("div");
      newdiv.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
      newdiv.textContent = "Current Time = " + currentTime + ": Process - " + k.process + " Entered CPU and is Being Executed";
      operation.appendChild(br);
      operation.appendChild(newdiv);
      operation.appendChild(br);

      console.log(k.process);

      //Process First Time Being Execute
      k.firstTimeExecute += 1;
      if(k.firstTimeExecute == 1){
        k.responeTime = currentTime - k.arrivalTime;
      }
     
      //Process Have Remaining Time Equal or Less Than Quantum
      if(k.remainingTime <= quantum){
        k.finish = 1;
        k.available = 1;
        count += 1;
        k.completeTime = currentTime + k.remainingTime;
        k.turnaroundTime = k.completeTime - k.arrivalTime;
        k.waitingTime = k.turnaroundTime - k.burstTime;
        k.remainingTime = 0;

        //Gantt Chart Doing His Job
        tgantt.push({
          "process": k.process,
          "start": currentTime,
          "end": k.completeTime
        });

        currentTime = k.completeTime;
      }

      //Process Have Remaining Time More Than Quantum
      else{
        k.available = 1;
        k.remainingTime -= quantum;

        //Gantt Chart Doing His Job
        tgantt.push({
          "process": k.process,
          "start": currentTime,
          "end": currentTime + quantum
        });

        currentTime += quantum;
      }

      //Push Processes Have Arrival Time Between Quantum Processing
      for(i = 0; i < n; i++){
        if(processes[i].arrivalTime > (currentTime - quantum) && processes[i].arrivalTime <= currentTime
          && processes[i].typeSche == "Foreground"){
          processes[i].available = 1;
          foreground.push(processes[i]);
        }
        else if(processes[i].arrivalTime > (currentTime - quantum) && processes[i].arrivalTime <= currentTime
          && processes[i].typeSche == "Background"){
          processes[i].available = 1;
          background.push(processes[i]);
        }
      }

      //Process Still Have Remaining Time Being Push to Back
      if(k.remainingTime > 0){
        foreground.push(k);
      }
    }

    //Run Background processes 
    if(foreground.length == 0){
      var k2 = 0;
      var flag = 0;
      var currentTimeTemp = 0;
      currentTimeTemp = currentTime;
      

      while(background.length != 0){
        console.log("Current Time: " + currentTime);
        console.log("Background: ");
        console.log(background);
        //Tiến trình background đang chạy hoàn thành thì sẽ chuyển sang tiến trình tiếp theo
        if(k2.finish == 1 || k2 == 0){
          k2 = background.shift();
          currentTimeTemp = currentTime;
        }
        
        k2.firstTimeExecute += 1;
        if(k2.firstTimeExecute == 1){
          k2.responeTime = currentTime - k2.arrivalTime;
        }
        
        currentTime += 1;
        k2.remainingTime -= 1;
        k2.available = 1;
        
        for(var i = 0; i < n; i++){
          
          if(processes[i].arrivalTime == currentTime && processes[i].typeSche == "Foreground"){
            processes[i].available = 1;
            foreground.push(processes[i]);
            flag = 1;
          }
          else if(processes[i].arrivalTime == currentTime && processes[i].typeSche == "Background"){
            processes[i].available = 1;
            background.push(processes[i]);
          }
        }

        if(flag == 1){

          var newdiv = document.createElement("div");
          newdiv.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
          newdiv.textContent = "Current Time = " + currentTimeTemp + ": Process - " + k2.process + " Entered CPU and is Being Executed";
          operation.appendChild(br);
          operation.appendChild(newdiv);
          operation.appendChild(br);
          
          var newdiv = document.createElement("div");
          newdiv.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
          newdiv.textContent = "<< This Process-" + k2.process + " Has Been Push Back to Background Queue >>";
          operation.appendChild(br);
          operation.appendChild(newdiv);
          operation.appendChild(br);
          
          background.push(k2);
          

          tgantt.push({
            "process": k2.process,
            "start": currentTimeTemp,
            "end": currentTimeTemp + (k2.burstTime - k2.remainingTime)
          });

          break;
        }

        if(k2.remainingTime <= 0 && k2.finish == 0){
          k2.finish = 1;
          k2.remainingTime = 0;
          k2.completeTime = currentTime;
          k2.turnaroundTime = k2.completeTime - k2.arrivalTime;
          k2.waitingTime = k2.turnaroundTime - k2.burstTime;
          count += 1;

          var newdiv = document.createElement("div");
          newdiv.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
          newdiv.textContent = "Current Time = " + currentTimeTemp + ": Process - " + k2.process + " Entered CPU and is Being Executed";
          operation.appendChild(br);
          operation.appendChild(newdiv);
          operation.appendChild(br);


          //Gantt Chart Doing His Job
          tgantt.push({
            "process": k2.process,
            "start": currentTimeTemp,
            "end": k2.completeTime
          });
        }
        else if(k2.remainingTime > 0){
          background.push(k2);
        }
      }
    }

    if(count != n && foreground.length == 0 && background.length == 0){
      var newdiv = document.createElement("div");
      newdiv.setAttribute("style", "text-align: center; margin: auto; width:100%; font-size: 20px;");
      newdiv.textContent = "Current Time = " + currentTime + ": CPU is Idle.";
      operation.appendChild(br);
      operation.appendChild(newdiv);
      operation.appendChild(br);


      tgantt.push({
        "process": -1,
        "start": currentTimeTemp,
        "end": currentTime
      });

      currentTime += 1;
      opening();
    }
    else if(count == n && foreground.length == 0 && background.length == 0){
      done = 1;
    }
  }
      

  //Calculate Average Waiting Time & Average Turnaround Time
  console.log(tgantt);
  var total_turnaroundTime = 0.0, total_waitingTime = 0.0, total_responeTime = 0.0;
  for(i = 0; i < n; i++){
    total_responeTime += processes[i].responeTime;
    total_turnaroundTime += processes[i].turnaroundTime;
    total_waitingTime += processes[i].waitingTime;
  }
  averageTurnaroundTime = (total_turnaroundTime / n).toFixed(2);
  averageWaitingTime = (total_waitingTime / n).toFixed(2);
  averageResponeTime = (total_responeTime / n).toFixed(2);

  console.log("Respone Time");
  for(i = 0; i < n; i++){
    console.log(processes[i].responeTime);
  }

  console.log("Waiting Time");
  for(i = 0; i < n; i++){
    console.log(processes[i].waitingTime);
  }

  console.log("Turnaround Time");
  for(i = 0; i < n; i++){
    console.log(processes[i].turnaroundTime);
  }

  console.log(averageResponeTime);
  console.log(averageWaitingTime);
  console.log(averageTurnaroundTime);

  //Get Gantt Chart from Temporary Chart Tgantt[]
  var pre = tgantt[0].process;
  var begin = tgantt[0].start;
  var stop;
  for (var i = 1; i < tgantt.length; i++) {
    if (tgantt[i].process == pre) {
        continue;
    }
    else {
        pre = tgantt[i].process;
        stop = tgantt[i - 1].end;
        gantt.push({
            "id": tgantt[i - 1].process,
            "start": begin,
            "end": stop
        });
        begin = tgantt[i].start;
    }
  }
  stop = tgantt[i - 1].end;

  gantt.push({
      "id": tgantt[i - 1].process,
      "start": begin,
      "end": stop
  });
}


function drawTable(){
  var table = document.getElementById("processTable");
  processes.sort(function (a, b){
    return a.process - b.process;
  });

  for(var i = 0; i < processes.length; i++){
    var tableBody = document.createElement("tr");
    var tableContent1 = document.createElement("td");
    tableContent1.innerHTML =  processes[i].process;
    tableBody.appendChild(tableContent1);

    var tableContent2 = document.createElement("td");
    tableContent2.innerHTML = processes[i].arrivalTime;
    tableBody.appendChild(tableContent2);

    var tableContent3 = document.createElement("td");
    tableContent3.innerHTML = processes[i].burstTime;
    tableBody.appendChild(tableContent3);

    var tableContent4 = document.createElement("td");
    tableContent4.innerHTML = processes[i].completeTime;
    tableBody.appendChild(tableContent4);

    var tableContent5 = document.createElement("td");
    tableContent5.innerHTML = processes[i].responeTime;
    tableBody.appendChild(tableContent5);

    var tableContent6 = document.createElement("td");
    tableContent6.innerHTML = processes[i].waitingTime;
    tableBody.appendChild(tableContent6);

    var tableContent7 = document.createElement("td");
    tableContent7.innerHTML = processes[i].turnaroundTime;
    tableBody.appendChild(tableContent7);

    var tableContent8 = document.createElement("td");
    tableContent8.innerHTML = processes[i].typeSche;
    tableBody.appendChild(tableContent8);

    table.appendChild(tableBody);
  }
}

function drawGanttChart(){
  var gt = document.getElementById("gantt");
  var timer1 = document.getElementById("timer");
  var br = document.createElement("br");
  pixel = 800 / currentTime;

  for (var i = 0; i < gantt.length; i++) {
    var divWidth = (gantt[i].end - gantt[i].start) * pixel;
    var d = document.createElement("div");
    d.setAttribute("class", "block");
    var id1 = gantt[i].id;
    d.setAttribute("id", "P-" + gantt[i].id);
    
    if (gantt[i].id == -1) {
        d.textContent = "";
        d.setAttribute("style", "float: left; width: " + divWidth + "px; height: 50px;");
    }
    else {
        d.setAttribute("style", "float: left; width: "+divWidth+"px; height: 50px; background-color: "+ processes[i].color +"; font-size: 20px; text-align: center;");
        d.textContent = "P-" + gantt[i].id;
    }
    gt.appendChild(d); 
    var d1 = document.createElement("div");
    d1.setAttribute("style", "float: left; width: " + divWidth + "px; text-align: left;");
    d1.textContent = gantt[i].start;
    timer1.appendChild(d1);
  }

  var d1 = document.createElement("div");
  d1.setAttribute("style", "float: left; width: 3px");
  d1.textContent = "End " + gantt[i-1].end;
  timer1.appendChild(d1);
  timer1.appendChild(br);
}
