# Deployment Guide - Sit-in Management System

## Prerequisites
- Git account (GitHub)
- Hosting account (Railway, Heroku, or similar)
- Node.js knowledge (basic)

## Deployment Options

### Option 1: Railway.app (Recommended - Easiest)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Your Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Node.js and deploys

3. **Get Your URL**
   - Railway provides a public URL like: `https://yourapp.railway.app`
   - Your API will be at: `https://yourapp.railway.app/api`

4. **Access from Phone**
   - Open browser on phone
   - Visit: `https://yourapp.railway.app`
   - Use same credentials as PC

---

### Option 2: Heroku (Requires Credit Card)

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create your-app-name
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Access**
   - URL: `https://your-app-name.herokuapp.com`

---

### Option 3: Render.com

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Deploy**
   - Click "Deploy"
   - Render provides public URL

---

## Local Testing Before Deployment

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start

# 3. Test on PC
# Open browser: http://localhost:3000

# 4. Test on Phone (same WiFi)
# Find your PC IP: ipconfig getifaddr en0 (Mac)
# On phone browser: http://[YOUR_IP]:3000
```

---

## File Structure for Deployment

```
project/
├── index.html          ✓ Static frontend
├── script.js           ✓ Updated with dynamic API URL
├── style.css           ✓ Styling
├── server.js           ✓ Express backend
├── db.js               ✓ Database config
├── sitinmanagement.db  ✓ SQLite database (auto-created)
├── package.json        ✓ Dependencies
├── Procfile            ✓ Deployment config
├── .gitignore          ✓ Ignore files
└── README.md
```

---

## How It Works After Deployment

**User Registration Flow:**

```
Phone Browser                  Your Server
    ↓                              ↓
Register Form          →    server.js (API)
    ↓                              ↓
Submit Data            →    db.js (SQLite)
    ↓                              ↓
✓ Registered           ←    Response JSON
    ↓
Login with same ID & password
```

---

## Database Persistence

- **Local (laptop):** Data stored in `sitinmanagement.db`
- **Deployed:** Data stored in server's filesystem
- **Multiple Users:** All data synchronized in one database
- **Access:** From any device with internet connection

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to API" | Check API URL in browser console (F12) |
| "Port already in use" | Change PORT in server.js or kill process |
| "Database not found" | Run server once to auto-create it |
| "Phone can't access" | Ensure phone on same WiFi, use correct IP |

---

## Quick Deploy to Railway

```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to Railway.app
# 3. Click "New Project" → "Deploy from GitHub"
# 4. Select your repo
# 5. Done! Get your URL

# Your app URL: https://yourapp-[random].railway.app
```

---

## Environment Variables (Optional)

If needed, add to hosting platform:
- `NODE_ENV=production`
- `PORT=3000` (usually auto-set)

---

## Testing After Deployment

1. **On PC Browser:**
   ```
   https://yourapp.railway.app
   ```

2. **On Phone Browser:**
   ```
   Same URL as PC
   ```

3. **Test Registration:**
   - Create new account on phone
   - Check if data persists on PC
   - Both devices see same database

---

## Support

- **Railway Docs:** https://docs.railway.app
- **Heroku Docs:** https://devcenter.heroku.com
- **Render Docs:** https://render.com/docs
