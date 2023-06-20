function runRoundRobin() {
    // Lấy giá trị thời lượng lượng (quantum) từ input
    var quantum = parseInt(document.getElementById("quantum").value);

    // Mảng chứa thông tin về các quy trình
    var processes = [
        { id: 1, arrivalTime: 0, burstTime: 6 },
        { id: 2, arrivalTime: 1, burstTime: 4 },
        { id: 3, arrivalTime: 2, burstTime: 8 },
        { id: 4, arrivalTime: 3, burstTime: 5 },
    ];

    var n = processes.length; // Số lượng quy trình
    var completionTime = Array(n).fill(0); // Mảng lưu thời gian hoàn thành của từng quy trình
    var remainingTime = []; // Mảng lưu thời gian còn lại của từng quy trình
    var waitingTime = Array(n).fill(0); // Mảng lưu thời gian chờ của từng quy trình
    var turnaroundTime = Array(n).fill(0); // Mảng lưu thời gian turnaround của từng quy trình

    // Sao chép thời gian còn lại từ burstTime
    for (var i = 0; i < n; i++) {
        remainingTime.push(processes[i].burstTime);
    }

    var currentTime = 0; // Thời gian hiện tại
    var allProcessesCompleted = false;

    // Chạy vòng lặp cho đến khi tất cả các quy trình hoàn thành
    while (!allProcessesCompleted) {
        var temp;
        allProcessesCompleted = true;
        for (var i = 0; i < n; i++) {
               
            if (remainingTime[i] > 0) {
                allProcessesCompleted = false;

                // Xử lý quy trình hiện tại
                if (remainingTime[i] <= quantum) {
                    currentTime += remainingTime[i];
                    completionTime[i] = currentTime;
                    remainingTime[i] = 0;
                } else {
                    currentTime += quantum;
                    remainingTime[i] -= quantum;
                }
                if(processes[i+1].arrivalTime == currentTime){
                temp = remainingTime[i];
                remainingTime[i] = remainingTime[i+1];
                remainingTime[i+1] = temp;
                }
            }
        }
    }

    // Tính toán thời gian chờ và thời gian turnaround
    for (var i = 0; i < n; i++) {
        turnaroundTime[i] = completionTime[i] - processes[i].arrivalTime;
        waitingTime[i] = turnaroundTime[i] - processes[i].burstTime;
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
