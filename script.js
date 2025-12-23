// MITS IMS GEMS API Configuration
const API_BASE_URL = 'http://mitsims.in';
let currentSession = null;

// Sample database for demonstration (fallback)
const userDatabase = {
    "MIT123": { password: "password123", name: "John Doe" },
    "MIT456": { password: "password456", name: "Jane Smith" },
    "MIT789": { password: "password789", name: "Robert Johnson" },
};

// Sample attendance data (fallback)
const attendanceDatabase = {
    "MIT123": [
        { subject: "Mathematics", present: 45, total: 50, percentage: 90 },
        { subject: "Physics", present: 42, total: 50, percentage: 84 },
        { subject: "Chemistry", present: 48, total: 50, percentage: 96 },
        { subject: "English", present: 40, total: 45, percentage: 89 },
        { subject: "Computer Science", present: 47, total: 50, percentage: 94 },
    ],
    "MIT456": [
        { subject: "Mathematics", present: 35, total: 50, percentage: 70 },
        { subject: "Physics", present: 38, total: 50, percentage: 76 },
        { subject: "Chemistry", present: 32, total: 45, percentage: 71 },
        { subject: "English", present: 40, total: 48, percentage: 83 },
        { subject: "Computer Science", present: 44, total: 50, percentage: 88 },
    ],
    "MIT789": [
        { subject: "Mathematics", present: 48, total: 50, percentage: 96 },
        { subject: "Physics", present: 47, total: 50, percentage: 94 },
        { subject: "Chemistry", present: 46, total: 50, percentage: 92 },
        { subject: "English", present: 43, total: 45, percentage: 96 },
        { subject: "Computer Science", present: 49, total: 50, percentage: 98 },
    ],
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
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const demoData = attendanceDatabase[loggedInUser];
        if (demoData) {
            displayAttendance(loggedInUser, demoData);
        }
    }

    // Login form handler
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout handler
    logoutBtn.addEventListener('click', handleLogout);
    
    // Skip calculator handler
    if (calculateSkipBtn) {
        calculateSkipBtn.addEventListener('click', calculateSkipDays);
    }
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const rollNumber = document.getElementById('rollNumber').value.trim();
    const password = document.getElementById('password').value;
    
    // Clear previous error
    errorMessage.textContent = '';
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    try {
        // Simulate loading steps
        showStatusMessage('Collecting username and password', 'info');
        
        setTimeout(() => {
            showStatusMessage('Logging in...', 'info');
        }, 500);
        
        setTimeout(() => {
            showStatusMessage('Collecting course data', 'info');
        }, 1000);
        
        setTimeout(() => {
            showStatusMessage('Calculating attendance', 'info');
        }, 1500);
        
        setTimeout(() => {
            // Check if it's a demo account
            if (userDatabase[rollNumber] && userDatabase[rollNumber].password === password) {
                showStatusMessage('Fetching final results', 'success');
                
                localStorage.setItem('loggedInUser', rollNumber);
                const demoData = attendanceDatabase[rollNumber];
                displayAttendance(rollNumber, demoData);
                errorMessage.textContent = '';
            } else {
                errorMessage.textContent = 'Invalid Register Number or Password';
                loginForm.reset();
            }
            
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Login failed. Please try again.';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show status message
function showStatusMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.status-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message status-${type} active`;
    statusDiv.textContent = message;
    
    if (loginSection.classList.contains('active')) {
        loginSection.insertBefore(statusDiv, loginForm);
    }
    
    // Auto remove after 1.5 seconds unless it's success
    if (type !== 'success') {
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.remove();
            }
        }, 1500);
    }
}

// Display attendance for a user
function displayAttendance(rollNumber, attendanceData) {
    const user = userDatabase[rollNumber] || { name: rollNumber };
    
    // Display user info
    document.getElementById('displayRoll').textContent = rollNumber;
    document.getElementById('displayName').textContent = user.name;
    
    // Calculate overall average
    if (attendanceData && attendanceData.length > 0) {
        const totalPercentage = attendanceData.reduce((sum, subj) => sum + subj.percentage, 0);
        const average = (totalPercentage / attendanceData.length).toFixed(1);
        
        // Display overall average
        document.getElementById('overallAverage').textContent = average + '%';
        
        // Display subject-wise attendance
        const attendanceList = document.getElementById('attendanceList');
        attendanceList.innerHTML = '';
        
        attendanceData.forEach(subject => {
            const item = document.createElement('div');
            item.className = 'attendance-item';
            
            const presentLabel = subject.percentage < 75 ? '⚠️' : '✅';
            
            item.innerHTML = `
                <h4>${subject.subject} ${presentLabel}</h4>
                <div class="attendance-info">
                    <div class="attendance-stats">
                        <span class="stat-item">📚 Present: ${subject.present}</span>
                        <span class="stat-item">📋 Total: ${subject.total}</span>
                    </div>
                    <div class="attendance-percentage">${subject.percentage}%</div>
                </div>
            `;
            
            attendanceList.appendChild(item);
        });
    } else {
        document.getElementById('overallAverage').textContent = 'N/A';
        document.getElementById('attendanceList').innerHTML = '<p>No attendance data available.</p>';
    }
    
    // Switch to attendance section
    loginSection.classList.remove('active');
    attendanceSection.classList.add('active');
}

// Calculate skip days
function calculateSkipDays() {
    const currentUser = localStorage.getItem('loggedInUser');
    if (!currentUser) {
        errorMessage.textContent = 'Please login first.';
        return;
    }
    
    const attendanceData = attendanceDatabase[currentUser];
    if (!attendanceData) {
        return;
    }
    
    skipDetails.innerHTML = '';
    
    attendanceData.forEach(subject => {
        const targetPercentage = 75;
        const currentPercentage = subject.percentage;
        const totalClasses = subject.total;
        const present = subject.present;
        
        let canSkip = 0;
        let warning = '';
        
        if (currentPercentage >= targetPercentage) {
            const totalAllowedAbsent = Math.floor((totalClasses * (100 - targetPercentage)) / 100);
            canSkip = totalAllowedAbsent - (totalClasses - present);
            
            if (canSkip < 0) canSkip = 0;
            
            if (canSkip === 0) {
                warning = '⚠️ Already at minimum!';
            }
        } else {
            warning = '⚠️ Below 75% - Attend all remaining classes!';
            canSkip = 0;
        }
        
        const skipItem = document.createElement('div');
        skipItem.className = 'skip-item';
        skipItem.innerHTML = `
            <strong>${subject.subject}</strong>
            <span>Can skip: ${canSkip} class${canSkip !== 1 ? 'es' : ''} ${warning}</span>
        `;
        skipDetails.appendChild(skipItem);
    });
    
    skipResults.style.display = 'block';
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('loggedInUser');
    loginForm.reset();
    attendanceSection.classList.remove('active');
    loginSection.classList.add('active');
    errorMessage.textContent = '';
    skipResults.style.display = 'none';
}





