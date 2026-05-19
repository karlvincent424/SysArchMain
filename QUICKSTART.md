# Quick Start Guide

## Step 1: Install Dependencies
```bash
cd "SysArchMain"
npm install
```

## Step 2: Start the Server
```bash
npm start
```

You should see:
```
✓ Server is running on http://localhost:3000
✓ API base URL: http://localhost:3000/api
✓ Database: sitinmanagement.db
✓ Frontend: http://localhost:3000
```

## Step 3: Open in Browser
- **PC:** http://localhost:3000
- **Phone (same WiFi):** http://[YOUR_PC_IP]:3000

## Step 4: Login
**Test Account:**
- ID: `2024-0001`
- Password: `password123`

Or register a new account

## Test on Phone (Local Network)

### Find Your PC IP Address

**Mac/Linux:**
```bash
ipconfig getifaddr en0
```

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address"
```

### Access from Phone
1. Connect phone to same WiFi
2. Open browser on phone
3. Go to: `http://[YOUR_IP]:3000`

## File Structure
```
├── index.html         → Frontend UI
├── script.js          → Frontend + API calls
├── style.css          → Styling
├── server.js          → Backend server
├── db.js              → Database setup
├── package.json       → Dependencies
├── Procfile           → Deployment config
└── sitinmanagement.db → Database (auto-created)
```

## Features Ready to Test

✓ **Registration** - Create new student account
✓ **Login** - Authenticate with credentials
✓ **Admin Dashboard** - View stats (login as admin-001/admin123)
✓ **Sit-in Processing** - Check students in/out
✓ **Announcements** - Post and view announcements
✓ **Session History** - Track student sit-ins

## Next: Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) to deploy online and access from anywhere using your phone

---

## Troubleshooting

**Port 3000 already in use?**
```bash
npm start -- --port 3001
```

**Database not working?**
- Delete `sitinmanagement.db` 
- Run `npm start` again

**Can't access from phone?**
- Ensure phone on same WiFi
- Check firewall isn't blocking port 3000
- Use correct IP address

**API not responding?**
- Check server is running (should see ✓ messages)
- Open browser console (F12) and check for errors
