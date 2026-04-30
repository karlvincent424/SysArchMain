# College of Computer Studies - Sit-in Management System

A comprehensive web-based system for managing computer lab sit-ins at the College of Computer Studies.

## Features

### Student Dashboard
- **Account Overview**: View personal information, remaining sessions, and profile photo
- **Lab Announcements**: Stay updated with important lab announcements
- **Reservation Requests**: Submit requests for computer lab reservations (pending admin approval)
- **Sit-in History**: View past sit-in sessions with feedback submission
- **Profile Management**: Update personal information including name, email, course, year, and profile photo

### Admin Dashboard
- **Dashboard Overview**: Statistics on total students, sit-ins, and active sessions
- **Student Management**: View, edit, and manage student accounts and sessions
- **Sit-in Processing**: Process student sit-in requests with session management
- **Reservation Management**: Review and approve/reject student reservation requests
- **Feedback Review**: View feedback submitted by students after sessions
- **Computer Control**: Manage computer availability and status in lab rooms
- **View Records**: Monitor active and completed sessions with Excel export capability
- **Reports**: Generate comprehensive sit-in activity reports with CSV export
- **Announcement Management**: Create and manage lab announcements
- **Purpose Management**: Enable/disable available sit-in purposes/topics

## Technical Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Storage**: LocalStorage (client-side)
- **Charts**: Chart.js for data visualization
- **Styling**: Custom CSS with responsive design

## Getting Started

1. **Clone/Download** the project files
2. **Open** `index.html` in a web browser, or
3. **Run locally** with a web server:
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser

## Default Accounts

### Admin Access
- **Username**: admin
- **Password**: admin123

### Sample Student Account
- **ID**: 2024-0001
- **Password**: password123

## Key Features

### Student Profile Editing
Students can edit their personal information including:
- First and Last Name
- Email Address
- Course and Year Level
- Profile Photo
- Password (optional)

Changes are automatically synchronized across all system data stores.

### Excel Export Functionality
Admin users can export session records to Excel-compatible CSV files from the "View Records" tab, including:
- All active and completed sessions
- Student information and session details
- Summary statistics
- Export timestamp

The CSV files can be opened directly in Microsoft Excel or any spreadsheet application.

## System Architecture

### Data Management
- User authentication and profiles
- Session tracking (active and completed)
- Reservation request system
- Computer status management
- Announcement system
- Feedback collection

### Security Features
- Role-based access control (Student/Admin)
- Session management
- Input validation
- Secure password handling

## Key Workflows

### Student Workflow
1. Register/Login to the system
2. View dashboard with announcements and account info
3. Submit reservation requests for lab time
4. Check reservation status
5. View sit-in history and submit feedback

### Admin Workflow
1. Login with admin credentials
2. Monitor system statistics and active sessions
3. Process student sit-in requests
4. Manage reservations (approve/reject)
5. Control computer availability
6. Review student feedback
7. Generate reports and manage announcements

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development Notes
- All data is stored locally in browser LocalStorage
- No server-side dependencies required
- Responsive design works on desktop and mobile devices
- Chart.js is loaded via CDN for data visualization
