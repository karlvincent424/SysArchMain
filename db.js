const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'sitinmanagement.db');

// Create and initialize database
let db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database at:', DB_PATH);
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                course TEXT,
                year TEXT,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                profilePhoto BLOB,
                registeredDate TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Sessions Table
        db.run(`
            CREATE TABLE IF NOT EXISTS sessions (
                sessionId INTEGER PRIMARY KEY AUTOINCREMENT,
                studentId TEXT NOT NULL,
                checkInTime DATETIME NOT NULL,
                checkOutTime DATETIME,
                duration INTEGER,
                status TEXT DEFAULT 'active',
                FOREIGN KEY (studentId) REFERENCES users(id)
            )
        `);

        // Attendance Records Table
        db.run(`
            CREATE TABLE IF NOT EXISTS attendance (
                attendanceId INTEGER PRIMARY KEY AUTOINCREMENT,
                studentId TEXT NOT NULL,
                date DATE NOT NULL,
                totalSessions INTEGER DEFAULT 0,
                totalDuration INTEGER DEFAULT 0,
                FOREIGN KEY (studentId) REFERENCES users(id),
                UNIQUE(studentId, date)
            )
        `);

        // Announcements Table
        db.run(`
            CREATE TABLE IF NOT EXISTS announcements (
                announcementId INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                createdBy TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (createdBy) REFERENCES users(id)
            )
        `);

        // Sample data insertion
        insertSampleData();
    });
}

// Insert sample data
function insertSampleData() {
    const sampleUsers = [
        {
            id: '2024-0001',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@cit.edu',
            course: 'BSCS',
            year: '3rd Year',
            password: 'password123',
            role: 'student'
        },
        {
            id: '2024-0002',
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane.smith@cit.edu',
            course: 'BSHM',
            year: '2nd Year',
            password: 'password123',
            role: 'student'
        },
        {
            id: '2024-0003',
            firstname: 'Mike',
            lastname: 'Johnson',
            email: 'mike.johnson@cit.edu',
            course: 'BSCS',
            year: '4th Year',
            password: 'password123',
            role: 'student'
        },
        {
            id: 'admin-001',
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@cit.edu',
            course: null,
            year: null,
            password: 'admin123',
            role: 'admin'
        }
    ];

    const stmt = db.prepare(`
        INSERT OR IGNORE INTO users (id, firstname, lastname, email, course, year, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sampleUsers.forEach(user => {
        stmt.run(user.id, user.firstname, user.lastname, user.email, user.course, user.year, user.password, user.role);
    });

    stmt.finalize();
}

// Export database functions
module.exports = {
    db,
    getDatabase: () => db,
    getUserById: (userId, callback) => {
        db.get('SELECT * FROM users WHERE id = ?', [userId], callback);
    },
    getAllUsers: (callback) => {
        db.all('SELECT * FROM users WHERE role = "student"', callback);
    },
    createSession: (studentId, checkInTime, callback) => {
        db.run(
            'INSERT INTO sessions (studentId, checkInTime, status) VALUES (?, ?, ?)',
            [studentId, checkInTime, 'active'],
            function(err) {
                callback(err, this.lastID);
            }
        );
    },
    closeSession: (sessionId, checkOutTime, duration, callback) => {
        db.run(
            'UPDATE sessions SET checkOutTime = ?, duration = ?, status = ? WHERE sessionId = ?',
            [checkOutTime, duration, 'completed', sessionId],
            callback
        );
    },
    getUserSessions: (userId, callback) => {
        db.all('SELECT * FROM sessions WHERE studentId = ? ORDER BY checkInTime DESC', [userId], callback);
    }
};
