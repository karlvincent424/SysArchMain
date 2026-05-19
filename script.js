// ========== GLOBAL STATE ==========
let charts = {};
let currentStudentId = null;
let currentStudentName = null;
let currentUserRole = null;

// Detect if running locally or deployed
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = IS_LOCAL 
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

console.log(`API Base URL: ${API_BASE_URL}`);

// ========== AUTHENTICATION SYSTEM ==========

// Switch to registration page
function switchToRegister() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('register-page').style.display = 'flex';
}

// Switch to login page
function switchToLogin() {
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
}

// Perform user registration
async function performRegister() {
    const id = document.getElementById('reg-id').value.trim();
    const firstname = document.getElementById('reg-firstname').value.trim();
    const lastname = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const course = document.getElementById('reg-course').value.trim();
    const year = document.getElementById('reg-year').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Validation
    if (!id || !firstname || !lastname || !email || !course || !year || !password || !confirmPassword) {
        alert('❌ Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('❌ Passwords do not match');
        return;
    }
    
    if (!email.includes('@')) {
        alert('❌ Please enter a valid email address');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id, firstname, lastname, email, course, year, password, role: 'student'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(`❌ ${data.error || 'Registration failed'}`);
            return;
        }
        
        alert(`✓ Account created successfully!\n\nID: ${id}\nName: ${firstname} ${lastname}\n\nYou can now login.`);
        
        // Reset form and switch to login
        document.getElementById('reg-id').value = '';
        document.getElementById('reg-firstname').value = '';
        document.getElementById('reg-lastname').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-course').value = '';
        document.getElementById('reg-year').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('reg-confirm-password').value = '';
        
        switchToLogin();
    } catch (error) {
        console.error('Registration error:', error);
        alert('❌ Registration error: ' + error.message);
    }
}

// Perform user login
async function performLogin() {
    const id = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!id || !password) {
        alert('❌ Please enter both ID and password');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(`❌ ${data.error || 'Login failed'}`);
            return;
        }
        
        // Login successful
        currentStudentId = data.user.id;
        currentStudentName = `${data.user.firstname} ${data.user.lastname}`;
        currentUserRole = data.user.role;
        
        localStorage.setItem('currentStudentId', id);
        localStorage.setItem('currentStudentName', currentStudentName);
        localStorage.setItem('currentUserRole', data.user.role);
        
        console.log(`✓ Login successful! Role: ${data.user.role}`);
        
        // Hide auth and show main app
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        // Show/hide navbars based on role
        if (data.user.role === 'admin') {
            document.getElementById('student-navbar').style.display = 'none';
            document.getElementById('admin-navbar').style.display = 'flex';
            showSection('admin-dash');
            await loadDashboard();
        } else {
            document.getElementById('student-navbar').style.display = 'flex';
            document.getElementById('admin-navbar').style.display = 'none';
            showSection('student-dash');
        }
        
        await updateStudentInfo();
        await loadStudentAnnouncements();
        
        alert(`✓ Welcome, ${data.user.firstname}!`);
    } catch (error) {
        console.error('Login error:', error);
        alert('❌ Login error: ' + error.message);
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentStudentId = null;
        currentStudentName = null;
        currentUserRole = null;
        localStorage.removeItem('currentStudentId');
        localStorage.removeItem('currentStudentName');
        localStorage.removeItem('currentUserRole');
        
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
        
        document.getElementById('student-navbar').style.display = 'flex';
        document.getElementById('admin-navbar').style.display = 'none';
        
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('register-page').style.display = 'none';
        
        document.getElementById('login-id').value = '';
        document.getElementById('login-password').value = '';
        
        console.log('✓ Logged out successfully');
    }
}

// Update student info
async function updateStudentInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentStudentId}`);
        const user = await response.json();
        
        const fullName = currentStudentName || 'Student';
        
        document.getElementById('user-id').textContent = currentStudentId;
        document.getElementById('user-name').textContent = fullName;
        
        if (document.getElementById('res-id')) {
            document.getElementById('res-id').value = currentStudentId;
            document.getElementById('res-name').value = fullName;
        }
        
        if (document.getElementById('user-email')) {
            document.getElementById('user-email').textContent = user.email || '-';
            document.getElementById('user-course').textContent = user.course || '-';
            document.getElementById('user-year').textContent = user.year || '-';
        }
        
        const profileContainer = document.getElementById('dashboard-profile-photo');
        if (profileContainer) {
            if (user.profilePhoto) {
                profileContainer.innerHTML = `<img src="${user.profilePhoto}" alt="Profile Photo" class="profile-photo-large-img">`;
            } else {
                profileContainer.innerHTML = `<div class="profile-placeholder-large">📷</div>`;
            }
        }
    } catch (error) {
        console.error('Error updating student info:', error);
    }
}

// Load profile info
async function loadProfileInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentStudentId}`);
        const currentUser = await response.json();
        
        if (document.getElementById('profile-name')) {
            document.getElementById('profile-name').textContent = `${currentUser.firstname} ${currentUser.lastname}`;
            document.getElementById('profile-id-display').textContent = `ID: ${currentUser.id}`;
            document.getElementById('profile-role-display').textContent = `Role: ${currentUser.role.toUpperCase()}`;
            
            document.getElementById('profile-email-display').textContent = currentUser.email || '-';
            document.getElementById('profile-course-display').textContent = currentUser.course || '-';
            document.getElementById('profile-year-display').textContent = currentUser.year || '-';
            document.getElementById('profile-account-type').textContent = currentUser.role.toUpperCase();
            
            document.getElementById('profile-member-since').textContent = currentUser.createdAt ? 
                new Date(currentUser.createdAt).toLocaleDateString() : '-';
            
            const profilePhoto = document.getElementById('profile-display-photo');
            const placeholder = document.getElementById('profile-photo-placeholder');
            
            if (currentUser.profilePhoto) {
                profilePhoto.src = currentUser.profilePhoto;
                profilePhoto.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            } else {
                profilePhoto.style.display = 'none';
                if (placeholder) placeholder.style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error loading profile info:', error);
    }
}

// Handle profile photo upload
function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        if (document.getElementById('photo-preview')) {
            document.getElementById('photo-preview').src = photoData;
            document.getElementById('photo-preview').style.display = 'block';
            document.getElementById('photo-preview-placeholder').style.display = 'none';
        }
        window.newProfilePhoto = photoData;
    };
    reader.readAsDataURL(file);
}

// Save profile changes
async function saveProfileChanges() {
    try {
        const firstname = document.getElementById('edit-profile-firstname').value.trim();
        const lastname = document.getElementById('edit-profile-lastname').value.trim();
        const email = document.getElementById('edit-profile-email').value.trim();
        const course = document.getElementById('edit-profile-course').value.trim();
        const year = document.getElementById('edit-profile-year').value.trim();
        
        if (!firstname || !lastname || !email || !course || !year) {
            alert('❌ Please fill in all required fields');
            return;
        }
        
        if (!email.includes('@')) {
            alert('❌ Please enter a valid email address');
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/users/${currentStudentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstname, lastname, email, course, year })
        });
        
        if (!response.ok) {
            alert('❌ Failed to update profile');
            return;
        }
        
        currentStudentName = `${firstname} ${lastname}`;
        localStorage.setItem('currentStudentName', currentStudentName);
        
        await updateStudentInfo();
        await loadProfileInfo();
        
        closeModal('profile-edit-modal');
        alert('✓ Profile updated successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('❌ Error: ' + error.message);
    }
}

// ========== INITIALIZATION ==========
async function initApp() {
    const savedId = localStorage.getItem('currentStudentId');
    const savedName = localStorage.getItem('currentStudentName');
    const savedRole = localStorage.getItem('currentUserRole');
    
    if (savedId && savedName && savedRole) {
        currentStudentId = savedId;
        currentStudentName = savedName;
        currentUserRole = savedRole;
        
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        if (savedRole === 'admin') {
            document.getElementById('student-navbar').style.display = 'none';
            document.getElementById('admin-navbar').style.display = 'flex';
            showSection('admin-dash');
            await loadDashboard();
        } else {
            document.getElementById('student-navbar').style.display = 'flex';
            document.getElementById('admin-navbar').style.display = 'none';
            showSection('student-dash');
        }
        
        await updateStudentInfo();
        await loadStudentAnnouncements();
    } else {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('student-navbar').style.display = 'flex';
        document.getElementById('admin-navbar').style.display = 'none';
    }
}

// Run initialization when page loads
window.addEventListener('DOMContentLoaded', initApp);

// ========== UI NAVIGATION ==========
function showSection(sectionId) {
    if (sectionId === 'admin-dash' && currentUserRole !== 'admin') {
        alert('❌ Access Denied: Only admins can access this page');
        return;
    }
    
    if ((sectionId === 'student-dash' || sectionId === 'reservation' || sectionId === 'history' || sectionId === 'my-profile') && currentUserRole === 'admin') {
        alert('❌ Access Denied: Please use the Admin Portal');
        return;
    }
    
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    if (sectionId === 'history') {
        loadHistory();
    } else if (sectionId === 'my-profile') {
        loadProfileInfo();
    } else if (sectionId === 'student-dash') {
        updateStudentInfo();
        loadStudentAnnouncements();
    } else if (sectionId === 'admin-dash') {
        loadDashboard();
    }
}

function showAdminTab(tabName) {
    if (currentUserRole !== 'admin') {
        alert('❌ Access Denied: Only admins can access this page');
        return;
    }
    
    document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    if (document.getElementById(tabName + '-tab')) {
        document.getElementById(tabName + '-tab').classList.add('active');
    }
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    if (tabName === 'dashboard') {
        loadDashboard();
    } else if (tabName === 'students') {
        loadStudentsList();
    } else if (tabName === 'records') {
        loadRecords();
    } else if (tabName === 'reports') {
        loadReports();
    } else if (tabName === 'announcements') {
        loadAdminAnnouncements();
    } else if (tabName === 'feedback') {
        loadFeedback();
    }
}

// ========== MODAL FUNCTIONS ==========
function openModal(modalId) {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById(modalId).style.display = 'none';
    
    if (modalId === 'sitin-form-modal') {
        document.getElementById('sitin-purpose').value = '';
        document.getElementById('sitin-lab').value = '';
    }
    
    if (modalId === 'profile-edit-modal') {
        if (document.getElementById('profile-photo-input')) {
            document.getElementById('profile-photo-input').value = '';
        }
        window.newProfilePhoto = null;
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.getElementById('modal-overlay').style.display = 'none';
}

// ========== ANNOUNCEMENTS SYSTEM ==========
async function loadAdminAnnouncements() {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements`);
        const announcements = await response.json();
        const container = document.getElementById('admin-announcements-list');
        
        if (!container) return;
        
        if (announcements.length === 0) {
            container.innerHTML = '<p class="no-announcements">No announcements yet.</p>';
            return;
        }
        
        container.innerHTML = announcements.map(ann => `
            <div class="announcement-item">
                <div class="announcement-header">
                    <h4>${ann.title}</h4>
                    <span class="announcement-date">${new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <p>${ann.content}</p>
                <button class="btn-delete" onclick="deleteAnnouncement('${ann.announcementId}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

async function createAnnouncement() {
    const title = document.getElementById('announcement-title').value.trim();
    const content = document.getElementById('announcement-content').value.trim();
    
    if (!title || !content) {
        alert('❌ Please fill in both title and content');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, createdBy: currentStudentId })
        });
        
        if (!response.ok) {
            alert('❌ Failed to create announcement');
            return;
        }
        
        document.getElementById('announcement-title').value = '';
        document.getElementById('announcement-content').value = '';
        
        alert('✓ Announcement posted successfully!');
        await loadAdminAnnouncements();
    } catch (error) {
        console.error('Error creating announcement:', error);
        alert('❌ Error: ' + error.message);
    }
}

async function deleteAnnouncement(announcementId) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/announcements/${announcementId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                alert('❌ Failed to delete announcement');
                return;
            }
            
            alert('✓ Announcement deleted successfully!');
            await loadAdminAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('❌ Error: ' + error.message);
        }
    }
}

async function loadStudentAnnouncements() {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements`);
        const announcements = await response.json();
        const container = document.getElementById('student-announcements');
        
        if (!container) return;
        
        if (announcements.length === 0) {
            container.innerHTML = '<p class="no-announcements">No announcements at this time.</p>';
            return;
        }
        
        container.innerHTML = announcements.map(ann => `
            <div class="announcement-item">
                <div class="announcement-header">
                    <h4>${ann.title}</h4>
                    <span class="announcement-date">${new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <p>${ann.content}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

// ========== DASHBOARD ==========
async function loadDashboard() {
    try {
        const usersResponse = await fetch(`${API_BASE_URL}/users`);
        const students = await usersResponse.json();
        
        const sessionsResponse = await fetch(`${API_BASE_URL}/sessions`);
        const sessions = await sessionsResponse.json();
        
        const activeSessions = sessions.filter(s => s.status === 'active').length;
        const completedSessions = sessions.filter(s => s.status === 'completed').length;
        
        if (document.getElementById('total-students')) {
            document.getElementById('total-students').textContent = students.length;
            document.getElementById('total-sitins').textContent = completedSessions;
            document.getElementById('active-sessions').textContent = activeSessions;
        }
        
        console.log(`Dashboard updated: ${students.length} students, ${completedSessions} total sit-ins, ${activeSessions} active`);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ========== STUDENT MANAGEMENT ==========
async function loadStudentsList() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(students) {
    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.firstname} ${student.lastname}</td>
            <td>${student.course || '-'} - ${student.year || '-'}</td>
            <td>--</td>
            <td>
                <button class="btn-edit" onclick="editStudentModal('${student.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function searchStudents() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const allStudents = await response.json();
        
        const filtered = allStudents.filter(s =>
            s.id.toLowerCase().includes(searchTerm) ||
            s.firstname.toLowerCase().includes(searchTerm) ||
            s.lastname.toLowerCase().includes(searchTerm)
        );
        
        displayStudents(filtered);
    } catch (error) {
        console.error('Error searching students:', error);
    }
}

async function editStudentModal(studentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${studentId}`);
        const student = await response.json();
        
        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('edit-student-name').value = `${student.firstname} ${student.lastname}`;
        document.getElementById('edit-student-course').value = `${student.course || '-'} - ${student.year || '-'}`;
        
        openModal('edit-student-modal');
    } catch (error) {
        console.error('Error loading student:', error);
    }
}

async function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${studentId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                alert('❌ Failed to delete student');
                return;
            }
            
            alert('✓ Student deleted successfully!');
            await loadStudentsList();
            await loadDashboard();
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('❌ Error: ' + error.message);
        }
    }
}

// ========== SIT-IN PROCESSING ==========
async function searchForSitIn() {
    const search = document.getElementById('sitin-search-input').value.trim();
    const resultsDiv = document.getElementById('sitin-results');
    
    if (search.length === 0) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${search}`);
        
        if (!response.ok) {
            resultsDiv.innerHTML = '<div class="student-not-found"><p>❌ Student not registered in the system. Please register first.</p></div>';
            return;
        }
        
        const student = await response.json();
        
        const sessionsResponse = await fetch(`${API_BASE_URL}/sessions/${student.id}`);
        const sessions = await sessionsResponse.json();
        
        const completedSessions = sessions.filter(s => s.status === 'completed').length;
        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        
        let sessionHistoryHTML = '';
        if (sessions.length > 0) {
            const recentSessions = sessions.slice(-3);
            sessionHistoryHTML = '<div class="recent-sessions"><strong>Recent Sessions:</strong><ul>';
            recentSessions.forEach(session => {
                sessionHistoryHTML += `<li>
                    <span class="session-date">${new Date(session.checkInTime).toLocaleDateString()}</span>
                    <span class="session-duration">(${session.duration || 'ongoing'} mins)</span>
                </li>`;
            });
            sessionHistoryHTML += '</ul></div>';
        }
        
        const activeSessions = sessions.filter(s => s.status === 'active');
        let activeStatus = '';
        if (activeSessions.length > 0) {
            activeStatus = `<div class="alert-active"><strong style="color: red;">⚠ Currently in Active Session</strong></div>`;
        }
        
        resultsDiv.innerHTML = `
            <div class="student-details-card">
                ${activeStatus}
                <div class="student-info-grid">
                    <div class="info-item">
                        <label>Student ID:</label>
                        <span class="info-value">${student.id}</span>
                    </div>
                    <div class="info-item">
                        <label>Full Name:</label>
                        <span class="info-value">${student.firstname} ${student.lastname}</span>
                    </div>
                    <div class="info-item">
                        <label>Email:</label>
                        <span class="info-value">${student.email}</span>
                    </div>
                    <div class="info-item">
                        <label>Course & Year:</label>
                        <span class="info-value">${student.course || '-'} - ${student.year || '-'}</span>
                    </div>
                    <div class="info-item">
                        <label>Total Sessions:</label>
                        <span class="info-value">${completedSessions}</span>
                    </div>
                    <div class="info-item">
                        <label>Total Duration:</label>
                        <span class="info-value">${totalDuration} mins</span>
                    </div>
                </div>
                
                ${sessionHistoryHTML}
                
                <div class="action-buttons">
                    <button class="btn-process-sitin" onclick="openSitInForm('${student.id}')">Process Sit-in</button>
                    <button class="btn-view-history" onclick="viewStudentFullHistory('${student.id}')">View Full History</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error searching for student:', error);
        resultsDiv.innerHTML = '<div class="student-not-found"><p>❌ Error searching student</p></div>';
    }
}

async function viewStudentFullHistory(studentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${studentId}`);
        const sessions = await response.json();
        
        if (sessions.length === 0) {
            alert('No session history available.');
        } else {
            let historyHTML = 'Complete Session History\n\n';
            historyHTML += 'Date | Check-in | Check-out | Duration\n';
            historyHTML += '----|-----------|-----------|---------\n';
            sessions.forEach(session => {
                const checkInDate = new Date(session.checkInTime).toLocaleString();
                const checkOutDate = session.checkOutTime ? new Date(session.checkOutTime).toLocaleString() : 'Ongoing';
                historyHTML += `${checkInDate} | ${checkOutDate} | ${session.duration || 'ongoing'} mins\n`;
            });
            alert(historyHTML);
        }
    } catch (error) {
        console.error('Error loading history:', error);
        alert('❌ Error loading history');
    }
}

async function openSitInForm(studentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${studentId}`);
        const student = await response.json();
        
        document.getElementById('sitin-student-id').value = student.id;
        document.getElementById('sitin-student-name').textContent = `${student.firstname} ${student.lastname}`;
        
        // Populate available purposes
        const purposes = ['C Programming', 'Java', 'Python', 'Web Development', 'Data Structures'];
        const purposeSelect = document.getElementById('sitin-purpose');
        purposeSelect.innerHTML = '<option value="">Select Purpose</option>';
        
        purposes.forEach(purpose => {
            const option = document.createElement('option');
            option.value = purpose;
            option.textContent = purpose;
            purposeSelect.appendChild(option);
        });
        
        openModal('sitin-form-modal');
    } catch (error) {
        console.error('Error opening sit-in form:', error);
        alert('❌ Error: ' + error.message);
    }
}

async function startSitIn() {
    const studentId = document.getElementById('sitin-student-id').value;
    const purpose = document.getElementById('sitin-purpose').value;
    const lab = document.getElementById('sitin-lab').value;
    
    if (!purpose || !lab) {
        alert('Please select Purpose and Lab Room');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, checkInTime: new Date().toISOString() })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(`❌ ${data.error || 'Failed to start session'}`);
            return;
        }
        
        const studentResponse = await fetch(`${API_BASE_URL}/users/${studentId}`);
        const student = await studentResponse.json();
        
        alert(`✓ Sit-in Session Started!\n\nStudent: ${student.firstname} ${student.lastname}\nPurpose: ${purpose}\nLab: ${lab}`);
        
        closeModal('sitin-form-modal');
        
        document.getElementById('sitin-search-input').value = '';
        document.getElementById('sitin-results').innerHTML = '';
        
        await loadRecords();
        await loadDashboard();
    } catch (error) {
        console.error('Error starting session:', error);
        alert('❌ Error: ' + error.message);
    }
}

// ========== SESSION MANAGEMENT ==========
async function loadRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions`);
        const sessions = await response.json();
        
        const tbody = document.getElementById('records-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        sessions.forEach((session, index) => {
            const row = document.createElement('tr');
            const isActive = session.status === 'active';
            const checkInTime = new Date(session.checkInTime).toLocaleTimeString();
            const checkOutTime = session.checkOutTime ? new Date(session.checkOutTime).toLocaleTimeString() : '--';
            
            row.innerHTML = `
                <td>${session.studentId}</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>${checkInTime}</td>
                <td>${checkOutTime}</td>
                <td>${session.duration ? session.duration + ' mins' : '--'}</td>
                <td><span style="color: ${isActive ? 'green' : 'gray'}; font-weight: 600;">${session.status.toUpperCase()}</span></td>
                <td>${isActive ? `<button class="btn-logout" onclick="endSession(${session.sessionId})">Logout</button>` : '--'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading records:', error);
    }
}

async function endSession(sessionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, checkOutTime: new Date().toISOString() })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(`❌ ${data.error || 'Failed to end session'}`);
            return;
        }
        
        alert('✓ Session ended successfully!');
        
        await loadRecords();
        await loadDashboard();
    } catch (error) {
        console.error('Error ending session:', error);
        alert('❌ Error: ' + error.message);
    }
}

// ========== REPORTS ==========
async function loadReports() {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions`);
        const sessions = await response.json();
        
        const tbody = document.getElementById('reports-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        sessions.forEach(session => {
            const row = document.createElement('tr');
            const checkInDate = new Date(session.checkInTime).toLocaleDateString();
            row.innerHTML = `
                <td>${session.studentId}</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>${new Date(session.checkInTime).toLocaleTimeString()}</td>
                <td>${session.checkOutTime ? new Date(session.checkOutTime).toLocaleTimeString() : 'Ongoing'}</td>
                <td>${checkInDate}</td>
                <td>${session.duration || 'ongoing'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// ========== STUDENT PORTAL - HISTORY ==========
async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${currentStudentId}`);
        const sessions = await response.json();
        
        const historyBody = document.getElementById('history-body');
        if (!historyBody) return;
        
        historyBody.innerHTML = '';
        
        if (sessions.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="7">No session history</td></tr>';
            return;
        }
        
        sessions.forEach(session => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${session.studentId}</td>
                <td>--</td>
                <td>--</td>
                <td>${new Date(session.checkInTime).toLocaleTimeString()}</td>
                <td>${session.checkOutTime ? new Date(session.checkOutTime).toLocaleTimeString() : 'Ongoing'}</td>
                <td>${new Date(session.checkInTime).toLocaleDateString()}</td>
                <td><button class="btn-feedback" onclick="openFeedbackModal(${session.sessionId})">Feedback</button></td>
            `;
            historyBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

function openFeedbackModal(sessionId) {
    document.getElementById('feedback-session-id').value = sessionId;
    openModal('feedback-modal');
}

function submitFeedback() {
    const feedbackText = document.getElementById('feedback-text').value;
    
    if (!feedbackText.trim()) {
        alert("Please enter your feedback before submitting.");
        return;
    }
    
    alert("Thank you! Your feedback has been submitted successfully.");
    closeModal('feedback-modal');
}

// ========== UTILITY FUNCTIONS ==========
function loadFeedback() {
    const container = document.getElementById('feedback-list');
    if (container) {
        container.innerHTML = '<p>No feedback yet.</p>';
    }
}

// Export records to CSV
async function exportRecordsToExcel() {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions`);
        const sessions = await response.json();
        
        if (sessions.length === 0) {
            alert('No records to export');
            return;
        }
        
        let csv = 'Student ID,Login Time,Logout Time,Duration (minutes),Status\n';
        
        sessions.forEach(session => {
            const checkIn = new Date(session.checkInTime).toLocaleString();
            const checkOut = session.checkOutTime ? new Date(session.checkOutTime).toLocaleString() : 'Ongoing';
            const duration = session.duration || 'Ongoing';
            csv += `"${session.studentId}","${checkIn}","${checkOut}","${duration}","${session.status}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sit-in-records-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        alert('✓ Records exported successfully!');
    } catch (error) {
        console.error('Error exporting records:', error);
        alert('❌ Error exporting records');
    }
}

// Add profile editor open function
function openProfileEditor() {
    loadProfileInfo();
    if (document.getElementById('edit-profile-firstname')) {
        document.getElementById('edit-profile-firstname').value = currentStudentName.split(' ')[0] || '';
        document.getElementById('edit-profile-lastname').value = currentStudentName.split(' ')[1] || '';
    }
    openModal('profile-edit-modal');
}

function openProfilePage() {
    loadProfileInfo();
    showSection('my-profile');
}
