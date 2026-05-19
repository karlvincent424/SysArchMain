# Sit-in Management System - Database Setup

## Project Structure
- **sitinmanagement.db** - SQLite database file (created automatically on first run)
- **db.js** - Database configuration and schema
- **server.js** - Express backend API server
- **index.html** - Frontend interface
- **script.js** - Frontend logic with API integration
- **style.css** - Frontend styling

## Database Tables

### Users Table
Stores student and admin accounts with login credentials and profile information.

### Sessions Table
Records check-in and check-out times for student sit-in sessions.

### Attendance Table
Tracks daily attendance summary for each student.

### Announcements Table
Stores system announcements created by admins.

## Local Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000` and automatically create `sitinmanagement.db`

3. **Default Login Credentials**
   - Student: `2024-0001` / `password123`
   - Admin: `admin-001` / `admin123`

## API Endpoints

- `GET /api/users` - Get all students
- `GET /api/users/:id` - Get specific user
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/sessions/checkin` - Create a check-in session
- `POST /api/sessions/checkout` - Complete a session
- `GET /api/sessions/:userId` - Get user's sessions
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement

## Database Location
The database file `sitinmanagement.db` is stored in the project root directory and will be automatically created on first server run.

## Testing on Multiple Devices

### Same Network (Local)
```bash
# Find your computer IP
ipconfig getifaddr en0  # Mac
ipconfig getifaddr en0  # Linux

# On phone browser (same WiFi)
http://[YOUR_IP]:3000
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide including:
- Railway.app (recommended)
- Heroku
- Render.com
- Access from phone after deployment

### Quick Deploy
```bash
git add .
git commit -m "Deploy to production"
git push origin main

# Then deploy to Railway/Heroku via their platforms
```

## Features

✓ User registration and authentication
✓ Student sit-in check-in/check-out
✓ Session history tracking
✓ Admin dashboard
✓ Announcements system
✓ Multi-device access after deployment
✓ Persistent database (SQLite)

## Data Persistence

- **Local:** Data persists in `sitinmanagement.db`
- **After Deployment:** All data synchronized in server database
- **Multiple Users:** Same database for PC, phone, and other devices

