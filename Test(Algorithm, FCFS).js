function runFCFS() {
    // Mảng chứa thông tin về các quy trình
    var processes = [
        { id: 1, arrivalTime: 0, burstTime: 6 },
        { id: 2, arrivalTime: 1, burstTime: 4 },
        { id: 3, arrivalTime: 4, burstTime: 8 },
        { id: 4, arrivalTime: 3, burstTime: 5 },
    ];

    var n = processes.length; // Số lượng quy trình
    var completionTime = Array(n).fill(0); // Mảng lưu thời gian hoàn thành của từng quy trình
    var waitingTime = Array(n).fill(0); // Mảng lưu thời gian chờ của từng quy trình
    var turnaroundTime = Array(n).fill(0); // Mảng lưu thời gian turnaround của từng quy trình

    var currentTime = 0; // Thời gian hiện tại

    process.sort(function(a, b){
                 return a.arrivalTime - b.arrivalTime;
     });
    
    // Tính toán thời gian hoàn thành và thời gian chờ cho từng quy trình
    for (var i = 0; i < n; i++) {
        if (currentTime < processes[i].arrivalTime) {
            currentTime = processes[i].arrivalTime;
        }
        completionTime[i] = currentTime + processes[i].burstTime;
        turnaroundTime[i] = completionTime[i] - processes[i].arrivalTime;
        waitingTime[i] = turnaroundTime[i] - processes[i].burstTime;
        currentTime = completionTime[i];
    }

    // Hiển thị kết quả trên bảng
    var tableBody = document.getElementById("resultBody");
    tableBody.innerHTML = "";
    for (var i = 0; i < n; i++) {
        var row = document.createElement("tr");
        row.innerHTML = `
            <td>${processes[i].id}</td>
            <td>${processes[i].arrivalTime}</td>
            <td>${processes[i].burstTime}</td>
            <td>${completionTime[i]}</td>
            <td>${turnaroundTime[i]}</td>
            <td>${waitingTime[i]}</td>
        `;
        tableBody.appendChild(row);
    }
}
