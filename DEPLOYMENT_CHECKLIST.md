# Deployment Checklist

## Before Going Live

### Code Preparation
- ✅ `package.json` - Dependencies and scripts configured
- ✅ `Procfile` - Deployment configuration
- ✅ `.gitignore` - Database and env files excluded
- ✅ `.env.example` - Environment template created
- ✅ `server.js` - Uses `process.env.PORT` for dynamic port
- ✅ `script.js` - Uses dynamic API URL based on hostname
- ✅ `db.js` - Database schema and initialization ready
- ✅ Documentation - DEPLOYMENT.md and QUICKSTART.md created

### Local Testing
- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Access `http://localhost:3000` ✓
- [ ] Test registration with new account ✓
- [ ] Test login ✓
- [ ] Test admin features ✓
- [ ] Check browser console for errors ✓

### Mobile Testing (Local Network)
- [ ] Find PC IP: `ipconfig getifaddr en0`
- [ ] Connect phone to same WiFi
- [ ] Access `http://[YOUR_IP]:3000` from phone ✓
- [ ] Test registration on phone ✓
- [ ] Verify data syncs between PC and phone ✓

## Deployment Steps

### Choose Platform
- [ ] Railway.app (Recommended)
- [ ] Heroku
- [ ] Render.com
- [ ] Other (specify): ___________

### Push to GitHub
```bash
[ ] git add .
[ ] git commit -m "Deploy to production"
[ ] git push origin main
```

### Deploy to Platform

**If Railway.app:**
```bash
[ ] Create Railway account
[ ] Connect GitHub repository
[ ] Click "Deploy"
[ ] Get public URL
```

**If Heroku:**
```bash
[ ] Install Heroku CLI
[ ] heroku login
[ ] heroku create your-app-name
[ ] git push heroku main
[ ] Get Heroku URL
```

**If Render.com:**
```bash
[ ] Create Render account
[ ] New Web Service from GitHub
[ ] Configure build/start commands
[ ] Deploy
[ ] Get public URL
```

### Post-Deployment Testing

**On Desktop Browser:**
- [ ] Visit deployed URL (e.g., https://yourapp.railway.app)
- [ ] Test registration ✓
- [ ] Test login ✓
- [ ] Test admin features ✓
- [ ] Check that API calls work ✓

**On Mobile Phone (Over Internet):**
- [ ] Visit same URL from phone
- [ ] Test registration from phone ✓
- [ ] Verify data syncs between devices ✓
- [ ] Test all features ✓

### Verify Database
- [ ] Data persists across page reloads ✓
- [ ] Multiple users see same data ✓
- [ ] Session history saves ✓
- [ ] Announcements persist ✓

## Deployment Success Criteria

✅ **Accessibility**
- [ ] PC can access via browser URL
- [ ] Phone can access via same URL
- [ ] Works on different browsers (Chrome, Safari, etc.)
- [ ] Works on different phone models

✅ **Data Persistence**
- [ ] User registration data saved
- [ ] Login credentials work after refresh
- [ ] Session history preserved
- [ ] Data syncs across devices

✅ **Functionality**
- [ ] All forms submit successfully
- [ ] Admin dashboard loads
- [ ] Announcements display
- [ ] No console errors (F12)

## Troubleshooting Deployment

| Problem | Solution |
|---------|----------|
| "Cannot GET /" | Check Procfile exists, run `npm install` |
| API 404 errors | Verify script.js API URL is correct |
| Database errors | Server should auto-create database |
| Port conflicts | Platform auto-assigns PORT env variable |
| Phone can't access | Ensure HTTPS for deployed apps |

## After Deployment

### Share Access
```
Your App URL: https://yourapp.railway.app
(or your platform's URL)

Students can now:
1. Visit URL on any device
2. Register new account
3. Login with credentials
4. Access from PC or phone
```

### Monitor Performance
- [ ] Check server logs for errors
- [ ] Monitor database size
- [ ] Track user registrations
- [ ] Get user feedback

## Maintenance

- [ ] Regularly backup database
- [ ] Monitor server logs
- [ ] Keep dependencies updated
- [ ] Scale resources if needed (for production)

---

**Once All Checkboxes Are Done = Ready for Production! 🚀**
