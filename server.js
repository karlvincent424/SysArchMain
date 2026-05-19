const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// ========== API ROUTES ==========

// ===== AUTHENTICATION =====
app.post('/api/auth/register', (req, res) => {
    const { id, firstname, lastname, email, course, year, password, role } = req.body;
    
    if (!id || !firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const stmt = db.getDatabase().prepare(
        'INSERT INTO users (id, firstname, lastname, email, course, year, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    
    stmt.run(id, firstname, lastname, email, course, year, password, role, function(err) {
        if (err) {
            res.status(400).json({ error: 'Email or ID already exists' });
        } else {
            res.json({ message: 'User registered successfully', userId: id });
        }
    });
});

app.post('/api/auth/login', (req, res) => {
    const { id, password } = req.body;
    
    if (!id || !password) {
        return res.status(400).json({ error: 'ID and password required' });
    }
    
    db.getUserById(id, (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!user) {
            res.status(401).json({ error: 'User not found' });
        } else if (user.password !== password) {
            res.status(401).json({ error: 'Incorrect password' });
        } else {
            res.json({ user });
        }
    });
});

// ===== USER MANAGEMENT =====
// Get all users
app.get('/api/users', (req, res) => {
    db.getAllUsers((err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
    db.getUserById(req.params.id, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(row);
        }
    });
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const { firstname, lastname, email, course, year } = req.body;
    const userId = req.params.id;
    
    db.getDatabase().run(
        'UPDATE users SET firstname = ?, lastname = ?, email = ?, course = ?, year = ? WHERE id = ?',
        [firstname, lastname, email, course, year, userId],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'User updated successfully' });
            }
        }
    );
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    
    db.getDatabase().run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
});

// ===== SESSIONS =====
// Get all sessions
app.get('/api/sessions', (req, res) => {
    db.getDatabase().all('SELECT * FROM sessions', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// Create session (check-in)
app.post('/api/sessions/checkin', (req, res) => {
    const { studentId, checkInTime } = req.body;

    db.createSession(studentId, checkInTime || new Date().toISOString(), (err, sessionId) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ sessionId, checkInTime: checkInTime || new Date().toISOString() });
        }
    });
});

// Close session (check-out)
app.post('/api/sessions/checkout', (req, res) => {
    const { sessionId } = req.body;
    const checkOutTime = new Date().toISOString();
    
    // Calculate duration
    db.getDatabase().get('SELECT checkInTime FROM sessions WHERE sessionId = ?', [sessionId], (err, session) => {
        if (err || !session) {
            return res.status(400).json({ error: 'Session not found' });
        }
        
        const duration = Math.round((new Date(checkOutTime) - new Date(session.checkInTime)) / 60000);
        
        db.closeSession(sessionId, checkOutTime, duration, (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Session closed successfully', checkOutTime, duration });
            }
        });
    });
});

// Get user sessions
app.get('/api/sessions/:userId', (req, res) => {
    db.getUserSessions(req.params.userId, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// ===== ANNOUNCEMENTS =====
// Get all announcements
app.get('/api/announcements', (req, res) => {
    db.getDatabase().all('SELECT * FROM announcements ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows || []);
        }
    });
});

// Create announcement
app.post('/api/announcements', (req, res) => {
    const { title, content, createdBy } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content required' });
    }
    
    db.getDatabase().run(
        'INSERT INTO announcements (title, content, createdBy) VALUES (?, ?, ?)',
        [title, content, createdBy],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ announcementId: this.lastID });
            }
        }
    );
});

// Delete announcement
app.delete('/api/announcements/:id', (req, res) => {
    db.getDatabase().run('DELETE FROM announcements WHERE announcementId = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Announcement deleted' });
        }
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
    console.log(`✓ API base URL: http://localhost:${PORT}/api`);
    console.log(`✓ Database: sitinmanagement.db`);
    console.log(`✓ Frontend: http://localhost:${PORT}`);
});
