// MITS IMS GEMS API Configuration
const API_BASE_URL = 'http://mitsims.in';
let currentSession = null;

// Sample database for demonstration (fallback)
const userDatabase = {
    "24691A32R8": { password: "passwordr8", name: "Surya Raju" },
    "24691A32S8": { password: "passwords8", name: "Tharun Reddy" },
    "24691A32T7": { password: "passwordt7", name: "Vamsi" },
};

// ✅ FIXED attendance data structure
const attendanceDatabase = {
    "24691A32R8": [
        { subject: "Aptitude", present: 1, total: 1, percentage: 100 },
        { subject: "Discrete Mathematical Structures", present: 38, total: 50, percentage: 76 },
        { subject: "Introduction To Data Science", present: 32, total: 45, percentage: 71 },
        { subject: "Data Engineering", present: 40, total: 48, percentage: 83 },
        { subject: "Data Science Laboratory", present: 44, total: 50, percentage: 88 },
        { subject: "NPTEL-1", present: 44, total: 50, percentage: 88 },
        { subject: "NPTEL-2", present: 44, total: 50, percentage: 88 },
        { subject: "Code Tantra", present: 44, total: 50, percentage: 88 }
    ],

    "24691A32S8": [
        { subject: "Aptitude", present: 1, total: 1, percentage: 100 },
        { subject: "Discrete Mathematical Structures", present: 3, total: 3, percentage: 100 },
        { subject: "Introduction To Data Science", present: 1, total: 2, percentage: 50 },
        { subject: "Data Engineering", present: 2, total: 3, percentage: 67 },
        { subject: "Data Science Laboratory", present: 3, total: 3, percentage: 100 },
        { subject: "NPTEL-1", present: 2, total: 2, percentage: 100 },
        { subject: "NPTEL-2", present: 2, total: 2, percentage: 100 },
        { subject: "Code Tantra", present: 2, total: 2, percentage: 100 }
    ],

    "24691A32T7": [
        { subject: "Aptitude", present: 1, total: 1, percentage: 100 },
        { subject: "Discrete Mathematical Structures", present: 38, total: 50, percentage: 76 },
        { subject: "Introduction To Data Science", present: 32, total: 45, percentage: 71 },
        { subject: "Data Engineering", present: 40, total: 48, percentage: 83 },
        { subject: "Data Science Laboratory", present: 44, total: 50, percentage: 88 },
        { subject: "NPTEL-1", present: 44, total: 50, percentage: 88 },
        { subject: "NPTEL-2", present: 44, total: 50, percentage: 88 },
        { subject: "Code Tantra", present: 44, total: 50, percentage: 88 }
    ]
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const attendanceSection = document.getElementById('attendanceSection');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');
const calculateSkipBtn = document.getElementById('calculateSkipBtn');
const skipResults = document.getElementById('skipResults');
const skipDetails = document.getElementById('skipDetails');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser && attendanceDatabase[loggedInUser]) {
        displayAttendance(loggedInUser, attendanceDatabase[loggedInUser]);
    }

    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    calculateSkipBtn?.addEventListener('click', calculateSkipDays);
});

// Handle login
function handleLogin(e) {
    e.preventDefault();

    const rollNumber = document.getElementById('rollNumber').value.trim();
    const password = document.getElementById('password').value;

    errorMessage.textContent = '';

    if (userDatabase[rollNumber] && userDatabase[rollNumber].password === password) {
        localStorage.setItem('loggedInUser', rollNumber);
        displayAttendance(rollNumber, attendanceDatabase[rollNumber]);
    } else {
        errorMessage.textContent = 'Invalid Register Number or Password';
    }
}

// Display attendance
function displayAttendance(rollNumber, attendanceData) {
    const user = userDatabase[rollNumber];

    document.getElementById('displayRoll').textContent = rollNumber;
    document.getElementById('displayName').textContent = user.name;

    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    let totalPercent = 0;

    attendanceData.forEach(subject => {
        totalPercent += subject.percentage;

        const item = document.createElement('div');
        item.className = 'attendance-item';

        item.innerHTML = `
            <h4>${subject.subject} ${subject.percentage < 75 ? '⚠️' : '✅'}</h4>
            <p>Present: ${subject.present} / ${subject.total}</p>
            <strong>${subject.percentage}%</strong>
        `;
        attendanceList.appendChild(item);
    });

    document.getElementById('overallAverage').textContent =
        (totalPercent / attendanceData.length).toFixed(1) + '%';

    loginSection.classList.remove('active');
    attendanceSection.classList.add('active');
}

// Calculate skip days
function calculateSkipDays() {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return;

    skipDetails.innerHTML = '';

    attendanceDatabase[user].forEach(sub => {
        let canSkip = Math.max(
            Math.floor((sub.total * 0.25) - (sub.total - sub.present)),
            0
        );

        skipDetails.innerHTML += `
            <div class="skip-item">
                <strong>${sub.subject}</strong> → Can skip: ${canSkip}
            </div>
        `;
    });

    skipResults.style.display = 'block';
}

// Logout
function handleLogout() {
    localStorage.removeItem('loggedInUser');
    attendanceSection.classList.remove('active');
    loginSection.classList.add('active');
    skipResults.style.display = 'none';
}
