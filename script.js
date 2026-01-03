// ===================== CONFIG =====================
const API_BASE_URL = 'http://mitsims.in';

// ===================== USERS ======================
const userDatabase = {
    "24691A32R8": { password: "passwordr8", name: "Surya Raju" },
    "24691A32S8": { password: "passwords8", name: "Tharun Reddy" },
    "24691A32T7": { password: "passwordt7", name: "Vamsi" }
};

// ===================== ATTENDANCE =================
const attendanceDatabase = {
    "24691A32R8": [
        { subject: "Aptitude", present: 3, total: 3},
        {subject: "soft skills", present: 1, total: 1},
        { subject: "Discrete Mathematical Structures", present: 5, total: 5},
        {subject: "environmental science", present: 5, total:6},
        { subject: "Introduction To Data Science", present: 8, total: 8 },
        { subject: "Data Engineering", present: 7, total: 7},
        { subject: "Data Science Laboratory", present: 9, total: 9},
        {subject: "Data engineering laboratory", present: 9, total: 9},
        { subject: "NPTEL-1", present: 4, total: 4}
        { subject: "NPTEL-2", present: 4, total: 4},
        { subject: "Code Tantra", present: 6, total: 6 },
        {subject: "devops", present: 6, total: 6}
    ],
    "24691A32S8": [
        { subject: "Aptitude", present: 3, total: 3 },
        {subject: "soft skills", present: 0, total: 1},
        { subject: "Discrete Mathematical Structures", present: 5, total: 5},
        {subject: "environmental science", present: 4, total: 6},
        { subject: "Introduction To Data Science", present: 5, total: 8},
        { subject: "Data Engineering", present: 6, total: 7 },
        { subject: "Data Science Laboratory", present: 6, total: 9 },
         {subject: "Data engineering laboratory", present: 3, total: 9},
        { subject: "NPTEL-1", present: 4, total: 4 },
        { subject: "NPTEL-2", present: 4, total: 4},
        { subject: "Code Tantra", present: 6, total: 6 },
        {subject: "devops", present: 6, total: 6},
    ],
    "24691A32T7": [
        { subject: "Aptitude", present: 2, total: 3},
        {subject: "soft skills", present: 1, total: 1},
        { subject: "Discrete Mathematical Structures", present: 4, total: 5},
        {subject: "environmental science", present: 4, total: 6},
        { subject: "Introduction To Data Science", present: 7, total: 8 },
        { subject: "Data Engineering", present: 5, total: 7},
        { subject: "Data Science Laboratory", present: 6, total: 9},
        {subject: "Data engineering laboratory", present: 6, total: 9},
        { subject: "NPTEL-1", present: 1, total: 4},
        { subject: "NPTEL-2", present: 2, total: 4},
        { subject: "Code Tantra", present: 4, total: 6 },
        {subject: "devops", present: 4, total: 6},
    ]
};

// ===================== DOM =========================
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const attendanceSection = document.getElementById('attendanceSection');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');
const calculateSkipBtn = document.getElementById('calculateSkipBtn');
const skipResults = document.getElementById('skipResults');
const skipDetails = document.getElementById('skipDetails');

// ===================== INIT ========================
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('loggedInUser');
    if (user && attendanceDatabase[user]) {
        displayAttendance(user, attendanceDatabase[user]);
    }
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    calculateSkipBtn?.addEventListener('click', calculateSkipDays);
});

// ===================== LOGIN =======================
function handleLogin(e) {
    e.preventDefault();
    const roll = document.getElementById('rollNumber').value.trim();
    const pass = document.getElementById('password').value;

    if (userDatabase[roll] && userDatabase[roll].password === pass) {
        localStorage.setItem('loggedInUser', roll);
        displayAttendance(roll, attendanceDatabase[roll]);
        errorMessage.textContent = '';
    } else {
        errorMessage.textContent = 'Invalid Register Number or Password';
    }
}

// ===================== DISPLAY ====================
function displayAttendance(roll, data) {
    const user = userDatabase[roll];
    document.getElementById('displayRoll').textContent = roll;
    document.getElementById('displayName').textContent = user.name;

    const list = document.getElementById('attendanceList');
    list.innerHTML = '';

    let totalPercent = 0;

    data.forEach(sub => {
        const percent = sub.total > 0
            ? Math.round((sub.present / sub.total) * 100)
            : 0;

        totalPercent += percent;

        list.innerHTML += `
            <div class="attendance-item">
                <h4>${sub.subject} ${percent < 75 ? '⚠️' : '✅'}</h4>
                <p>Present: ${sub.present} / ${sub.total}</p>
                <strong>${percent}%</strong>
            </div>
        `;
    });

    document.getElementById('overallAverage').textContent =
        (totalPercent / data.length).toFixed(1) + '%';

    loginSection.classList.remove('active');
    attendanceSection.classList.add('active');
}

// ===================== SKIP =======================
function calculateSkipDays() {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return;

    skipDetails.innerHTML = '';

    attendanceDatabase[user].forEach(sub => {
        const percent = sub.total > 0 ? (sub.present / sub.total) * 100 : 0;

        let canSkip = percent >= 75
            ? Math.max(Math.floor((sub.total * 0.25) - (sub.total - sub.present)), 0)
            : 0;

        skipDetails.innerHTML += `
            <div class="skip-item">
                <strong>${sub.subject}</strong> → Can skip: ${canSkip}
            </div>
        `;
    });

    skipResults.style.display = 'block';
}

// ===================== LOGOUT =====================
function handleLogout() {
    localStorage.removeItem('loggedInUser');
    attendanceSection.classList.remove('active');
    loginSection.classList.add('active');
    skipResults.style.display = 'none';
}
