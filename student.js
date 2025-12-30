// 學生頁面邏輯
let currentData = DataManager.loadData();
let allRows = [];

// 初始化頁面
function init() {
    renderTable();
    updateStats();
}

// 渲染表格
function renderTable() {
    currentData = DataManager.loadData();
    const tableBody = document.getElementById('tableBody');
    const tableHeader = document.getElementById('tableHeader');

    // 清空表格
    tableBody.innerHTML = '';
    allRows = [];
    
    // 移除所有作業標題（保留學生姓名列）
    const existingHeaders = tableHeader.querySelectorAll('.assignment-header');
    existingHeaders.forEach(header => header.remove());

    // 渲染作業標題（插入到學生姓名列之後）
    const studentNameHeader = tableHeader.querySelector('th:first-child');
    
    currentData.assignments.forEach(assignment => {
        const th = document.createElement('th');
        th.className = 'assignment-header';
        th.textContent = assignment;
        tableHeader.appendChild(th);
    });

    // 渲染學生資料
    currentData.students.forEach(student => {
        const row = document.createElement('tr');
        row.dataset.studentName = student;
        
        // 學生姓名欄位
        const nameCell = document.createElement('td');
        nameCell.textContent = student;
        nameCell.className = 'student-name';
        row.appendChild(nameCell);

        // 作業狀態欄位
        currentData.assignments.forEach(assignment => {
            const cell = document.createElement('td');
            cell.className = 'assignment-cell';
            const status = DataManager.getStatus(student, assignment);
            const statusIcon = document.createElement('span');
            statusIcon.className = status ? 'status-icon submitted' : 'status-icon not-submitted';
            statusIcon.textContent = status ? '✓ 已繳交' : '○ 未繳交';
            statusIcon.title = status ? '已繳交' : '未繳交';
            cell.appendChild(statusIcon);
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
        allRows.push(row);
    });

    updateStats();
}

// 搜尋過濾
function filterStudents() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    allRows.forEach(row => {
        const studentName = row.dataset.studentName.toLowerCase();
        row.style.display = studentName.includes(searchInput) ? '' : 'none';
    });
}

// 更新統計資訊
function updateStats() {
    document.getElementById('totalStudents').textContent = currentData.students.length;
    document.getElementById('totalAssignments').textContent = currentData.assignments.length;
}

// 定期更新資料（每5秒）
setInterval(() => {
    const newData = DataManager.loadData();
    // 檢查資料是否有變化
    if (JSON.stringify(newData) !== JSON.stringify(currentData)) {
        currentData = newData;
        renderTable();
    }
}, 5000);

// 頁面載入時初始化
window.onload = init;

