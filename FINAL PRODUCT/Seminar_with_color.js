var processes = [];
var process = 1;
var currentTime = 0;
var averageWaitingTime = 0.0;
var averageTurnaroundTime = 0.0;
var averageResponeTime = 0.0;
var gantt = [];
var colors = ["#e040fb", "#ff80ab", "#3f51b5", "#1e88e5", "#009688", "#4caf50", "#cddc39", "#ffeb3b", "#607d8b", "#ff9800"];
var quantum = 0;
var quantumIsSet = 0;

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
    console.log("Quantum:" + quantum);
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

function multilevelQueue(){
  var operation = document.getElementById('operations');
  operation.innerHTML = "";
  var br = document.createElement("br");

  //Sort Processes by Arrive Time
  processes.sort(function (a, b){
    return a.arrivalTime - b.arrivalTime;
  });

  gantt = [];
  currentTime = 0;
  var tgantt = [];
  var quantum = 2;
  var n = processes.length;
  var done = 0;
  var count = 0;
  var k = -1;
  const ready = [];
  var FG_clear = 0;

  //Push all Process with Arrive Time = 0 to Ready
  var i = 0;
  for(i = 0; i < n; i++){
    if(processes[i].arrivalTime == 0){
      ready.push(i);
      
      var ewqtdiv = document.createElement("div"); //ewqt = enter waiting queue time
      ewqtdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
      ewqtdiv.style.color = "#00eeff";
      ewqtdiv.textContent = "T = " + processes[i].arrivalTime + " : Process-" + processes[i].process + " Arrives and Has Beed Pushed To READY Queue";
      operation.appendChild(br);
      operation.appendChild(ewqtdiv);
      operation.appendChild(br);

      processes[i].available = 1;
    }
  }

  //Execute Processes
  while(done != 1){
//    console.log(currentTime + " :CPU is ready for next task");
//    console.log(ready);
    k = ready.shift();
    var currentTimeTemp = 0;

    //Found That None Process have Arrive Time = 0
    if(k == undefined){
      currentTimeTemp = currentTime;
      for(i = 0; i < n; i++){
        if(processes[i].finish == 0){
          break;
        }
      }

      //Gantt Chart Doing His Job
      tgantt.push({
        "process": -1,
        "start": currentTime,
        "end": processes[i].arrivalTime
      });

      currentTime = processes[i].arrivalTime;
      
      //Show There is no Process have Arrive Time at this Current time
      var idleCPUdiv = document.createElement("div");
      idleCPUdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
      idleCPUdiv.style.color = "#ff9900";
      idleCPUdiv.style.backgroundColor = "#3f301a";
      idleCPUdiv.textContent = "T = " + currentTimeTemp + " : CPU Is IDLE and Ready For Next Task";
      operation.appendChild(br);
      operation.appendChild(idleCPUdiv);
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

      

      //Foreground RR
      if(processes[k].typeSche == "Foreground"){

        //Process First Time Being Execute
        processes[k].firstTimeExecute += 1;
        if(processes[k].firstTimeExecute == 1){
          processes[k].responeTime = currentTime - processes[k].arrivalTime;

          var first_time = document.createElement("div");
          first_time.setAttribute("style", "color: blur; text-align: left; margin: auto; width:100%; font-size: 20px;");
          first_time.style.color = "#00ff40"; 
          first_time.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " ARRIVES at CPU and Is RUNNING";
          operation.appendChild(br);
          operation.appendChild(first_time);
          operation.appendChild(br);
        }else{
          //Show Which Process Being Executed
          var enterCPUdiv = document.createElement("div");
          enterCPUdiv.setAttribute("style", "color: blur; text-align: left; margin: auto; width:100%; font-size: 20px;");
          enterCPUdiv.style.color = "#00ff40"; 
          enterCPUdiv.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " Enteres CPU and Is RUNNING";
          operation.appendChild(br);
          operation.appendChild(enterCPUdiv);
          operation.appendChild(br);
        }
       
        //Process Have Remaining Time Equal or Less Than Quantum
        if(processes[k].remainingTime <= quantum){
          processes[k].finish = 1;
          processes[k].available = 1;
          count += 1;
          processes[k].completeTime = currentTime + processes[k].remainingTime;
          processes[k].turnaroundTime = processes[k].completeTime - processes[k].arrivalTime;
          processes[k].waitingTime = processes[k].turnaroundTime - processes[k].burstTime;
          processes[k].remainingTime = 0;

          //Gantt Chart Doing His Job
          tgantt.push({
            "process": processes[k].process,
            "start": currentTime,
            "end": processes[k].completeTime
          });

          //show that the proccess has been terminated
          currentTime = processes[k].completeTime;
          var tcdiv = document.createElement("div"); //tc = time completion
          tcdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px; ter");
          tcdiv.style.color = "#fd504a";
          tcdiv.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " Has Beed Completed and TERMINATED";
          operation.appendChild(br);
          operation.appendChild(tcdiv);
          operation.appendChild(br);
        }

        //Process Have Remaining Time More Than Quantum
        else{
          processes[k].available = 1;
          processes[k].remainingTime -= quantum;

          //Gantt Chart Doing His Job
          tgantt.push({
            "process": processes[k].process,
            "start": currentTime,
            "end": currentTime + quantum
          });

          currentTime += quantum;
        }

        //Push Process Have Arrive Time Between Quantum Processing
        for(i = 0; i < n; i++){
          if(processes[i].arrivalTime > currentTime - quantum && processes[i].arrivalTime <= currentTime && processes[i].finish == 0){
            processes[i].available = 1;
            ready.push(i);

            //show that said process has arrived and is waiting
            var ewqtdiv = document.createElement("div"); //ewqt = enter waiting queue time
            ewqtdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
            ewqtdiv.style.color = "#00eeff";
            ewqtdiv.textContent = "T = " + processes[i].arrivalTime + " : Process-" + processes[i].process + " Arrives and Has Beed Pushed To READY Queue";
            operation.appendChild(br);
            operation.appendChild(ewqtdiv);
            operation.appendChild(br);
          }
        }

        //Process Still Have Remaining Time Being Push to Back
        if(processes[k].remainingTime > 0){
          ready.push(k);

          //show that proccess has been pushed to ready queue
          var ewqtdiv = document.createElement("div"); //ewqt = enter waiting queue time
          ewqtdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
          ewqtdiv.style.color = "#00eeff";
          ewqtdiv.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " Has Beed Pushed To READY Queue";
          operation.appendChild(br);
          operation.appendChild(ewqtdiv);
          operation.appendChild(br);
        }
      }

      //Background FCFS
      else{

        //Check If There Are Still Foreground Process Haven't Done Yet
        var flag = 0;
        var flagII = 0;
        var flagIV = 0;
        for(i = 0; i < n; i++){
          if(processes[i].typeSche == "Foreground" && processes[i].finish == 0){
            flag = 1;

            //Check If There Are Foreground Process Before Background At Current Time = 0
            if(processes[i].arrivalTime <= 0){
              flagIV = 1;
            }
            
            //Check If There Are Foreground Process Have Arrive Time More than Current Time
            if(processes[i].arrivalTime > currentTime){
              flagII = 1;
            }
            break;
          }
        }

        //Current Time = 0 Have Both Foreground && Background but Foreground First so Background Priotized Foreground
        if(flag == 1 && flagIV == 1){
          ready.push(k);
          var Interupted = document.createElement("div");
            Interupted.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
            Interupted.style.color = "pink"
            Interupted.textContent = "<< Process-" + processes[k].process + " is in Background Queue so It Has Been Push Back to Last Queue >>";
            operation.appendChild(br);
            operation.appendChild(Interupted);
            operation.appendChild(br);
        }

        //Execute Background Process Until Foreground Process Arrive Time
        else if(flag == 1 && processes[k].available == 1 && flagII == 1){
          processes[k].available = 1;
          
          //Process First Time Being Execute
          processes[k].firstTimeExecute += 1;
          if(processes[k].firstTimeExecute == 1){
            processes[k].responeTime = currentTime - processes[k].arrivalTime;

            //arrives at CPU and RUN
            var first_time = document.createElement("div");
            first_time.setAttribute("style", "color: blur; text-align: left; margin: auto; width:100%; font-size: 20px;");
            first_time.style.color = "#00ff40"; 
            first_time.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " ARRIVES at CPU and Is RUNNING";
            operation.appendChild(br);
            operation.appendChild(first_time);
            operation.appendChild(br);
          }          

          var math = 0;
          var flagIII = 0;

          //Find Foreground Process Have Arrive Time Later than Current Time
          for(i = 0; i < n; i++){
            if(processes[i].typeSche == "Foreground" && processes[i].arrivalTime > currentTime && processes[i].available == 0){
              
              //Operation See Other Background Before Foreground Arrive Time
              for(var j = 0; j < n; j++){
                if(processes[j].typeSche == "Background" && processes[j].finish == 0 && processes[j].firstTimeExecute == 1){                
                  currentTimeTemp = currentTime;
                  currentTime += processes[k].remainingTime;

                  //Check If Foreground Arrive or Not
                  if(processes[i].arrivalTime <= currentTime){
                    currentTime = currentTimeTemp;
                    flagIII = 0;
                    break;
                  }

                  processes[k].available = 1;
                  processes[k].remainingTime = 0;
                  processes[k].finish = 1;
                  processes[k].completeTime = currentTime;
                  processes[k].turnaroundTime = processes[k].completeTime - processes[k].arrivalTime;
                  processes[k].waitingTime = processes[k].turnaroundTime - processes[k].burstTime;
                  count += 1;
                  flagIII = 1;

                  //enter CPU and RUN
                  var enterCPUdiv = document.createElement("div");
                  enterCPUdiv.setAttribute("style", "color: blur; text-align: left; margin: auto; width:100%; font-size: 20px;");
                  enterCPUdiv.style.color = "#00ff40"; 
                  enterCPUdiv.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " Enters CPU and Is RUNNING";
                  operation.appendChild(br);
                  operation.appendChild(enterCPUdiv);
                  operation.appendChild(br);

                  //Gantt Chart Doing his Job
                  tgantt.push({
                    "process": processes[k].process,
                    "start": currentTime,
                    "end": processes[k].completeTime
                  });
                  
                  break;
                }
              }
              
              //Background Doing His Job then Don't Need This Yet
              if(flagIII == 0){
                math = processes[i].arrivalTime - currentTime;                
                processes[k].remainingTime -= math;

                //FCFS Finish Scheduling
                if(processes[k].remainingTime <= 0){
                  processes[k].finish = 1;
                  processes[k].remainingTime = 0;
                  processes[k].completeTime = currentTime;
                  processes[k].turnaroundTime = processes[k].completeTime - processes[k].arrivalTime;
                  processes[k].waitingTime = processes[k].turnaroundTime - processes[k].burstTime;
                  count += 1;

                  //terminated
                  var tcdiv = document.createElement("div"); //tc = time completion
                  tcdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px; ter");
                  tcdiv.style.color = "#fd504a";
                  tcdiv.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " Has Been Completed and TERMINATED";
                  operation.appendChild(br);
                  operation.appendChild(tcdiv);
                  operation.appendChild(br);

                  //Gantt Chart Doing His Job
                  tgantt.push({
                    "process": processes[k].process,
                    "start": currentTime,
                    "end": processes[k].completeTime
                  });
                }
                else{
                  //Gantt Chart Doing His Job
                  tgantt.push({
                    "process": processes[k].process,
                    "start": currentTime,
                    "end": processes[i].arrivalTime
                  });        
                }
                currentTime = processes[i].arrivalTime;
                break;
              }
              else{
                break;
              }
            }
          }

          //Push Process Have Been Arrived But not Done Scheduling
          for(i = 0; i < n; i++){
            if(processes[i].arrivalTime <= currentTime && processes[i].finish == 0 && processes[i].available == 0){
              ready.push(i);

              //bi giat
              var Interupted = document.createElement("div");
              Interupted.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
              Interupted.style.color = "pink"
              Interupted.textContent = "<< Process-" + processes[k].process + " is in Background Queue so It Has Been Push Back to Last Queue >>";
              operation.appendChild(br);
              operation.appendChild(Interupted);
              operation.appendChild(br);
            }
          } 

          //Background Process's Remaining
          if(processes[k].remainingTime > 0){
            ready.push(k);
            
            //enter ready queue
            var ewqtdiv = document.createElement("div"); //ewqt = enter waiting queue time
            ewqtdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
            ewqtdiv.style.color = "#00eeff";
            ewqtdiv.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " Has Beed Pushed To READY Queue";
            operation.appendChild(br);
            operation.appendChild(ewqtdiv);
            operation.appendChild(br);
          }
        }

        //Push Background Process to the Back of Ready Queue / Skip this Process
        else if(flag == 1 && processes[k].available == 1){
          ready.push(k);

          //bi giat
          var Interupted = document.createElement("div");
          Interupted.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
          Interupted.style.color = "pink"
          Interupted.textContent = "<< Process-" + processes[k].process + " is in Background Queue so It Has Been Push Back to Last Queue >>";
          operation.appendChild(br);
          operation.appendChild(Interupted);
          operation.appendChild(br);
        }

        //There is No Foreground Process Left
        else{
          
          FG_clear +=1
          if(FG_clear == 1){
            var all_Foreground_done = document.createElement("div"); //ewqt = enter waiting queue time
            all_Foreground_done.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
            all_Foreground_done.style.color = "#1a0404";
            all_Foreground_done.style.backgroundColor = "#fd504a";
            all_Foreground_done.textContent = "T = " + currentTime + " NO Foreground Process Remain!";
            operation.appendChild(br);
            operation.appendChild(all_Foreground_done);
            operation.appendChild(br);
          }
          

          //Process First Time Being Execute
          processes[k].firstTimeExecute += 1;
          if(processes[k].firstTimeExecute == 1){
            processes[k].responeTime = currentTime - processes[k].arrivalTime;

            var first_time = document.createElement("div");
            first_time.setAttribute("style", "color: blur; text-align: left; margin: auto; width:100%; font-size: 20px;");
            first_time.style.color = "#00ff40"; 
            first_time.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " ARRIVES at CPU and Is RUNNING";
            operation.appendChild(br);
            operation.appendChild(first_time);
            operation.appendChild(br);
          }
          
          currentTimeTemp = currentTime;
          currentTime += processes[k].remainingTime;
          processes[k].available = 1;
          processes[k].remainingTime = 0;
          processes[k].finish = 1;
          processes[k].completeTime = currentTime;
          processes[k].turnaroundTime = processes[k].completeTime - processes[k].arrivalTime;
          processes[k].waitingTime = processes[k].turnaroundTime - processes[k].burstTime;
          count += 1;
          
          //Push Process Have Arrived
          for(i = 0; i < n; i++){
            if(processes[i].arrivalTime <= currentTime && processes[i].finish == 0 && processes[i].available == 0){
              processes[i].available = 1;
              ready.push(i);

              var ewqtdiv = document.createElement("div"); //ewqt = enter waiting queue time
              ewqtdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px;");
              ewqtdiv.style.color = "#00eeff";
              ewqtdiv.textContent = "T = " + processes[i].arrivalTime + " : Process-" + processes[i].process + " ARRIVES and has Been Pushed To READY Queue";
              operation.appendChild(br);
              operation.appendChild(ewqtdiv);
              operation.appendChild(br);
            }
          }

          //terminated
          var tcdiv = document.createElement("div"); //tc = time completion
          tcdiv.setAttribute("style", "text-align: left; margin: auto; width:100%; font-size: 20px; ter");
          tcdiv.style.color = "#fd504a";
          tcdiv.textContent = "T = " + currentTime + " : Process-" + processes[k].process + " Has Been Completed and TERMINATED";
          operation.appendChild(br);
          operation.appendChild(tcdiv);
          operation.appendChild(br);

          //Gantt Chart Doing His Job
          tgantt.push({
            "process": processes[k].process,
            "start": currentTimeTemp,
            "end": processes[k].completeTime
          });


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
  art2.appendChild(p1);
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
        d.setAttribute("style", "float: left; width: "+divWidth+"px; height: 50px; background-color: "+ getRandomColor() +"; font-size: 20px; text-align: center;");
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
