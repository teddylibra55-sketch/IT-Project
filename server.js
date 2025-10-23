const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Database setup
const db = new sqlite3.Database('jobs.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Jobs table
  db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary_range TEXT,
    posted_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users (id)
  )`);

  // Applications table
  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    cover_letter TEXT,
    resume_filename TEXT,
    status TEXT DEFAULT 'pending',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs (id)
  )`);
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User registration
app.post('/api/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', 
    [email, hashedPassword, name], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: 'Database error' });
    }

    const token = jwt.sign(
      { id: this.lastID, email, name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'User registered successfully',
      token,
      user: { id: this.lastID, email, name }
    });
  });
});

// User login
app.post('/api/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  });
});

// Get all jobs
app.get('/api/jobs', (req, res) => {
  const { type, location, search } = req.query;
  let query = `
    SELECT j.*, u.name as posted_by_name 
    FROM jobs j 
    LEFT JOIN users u ON j.posted_by = u.id 
    WHERE 1=1
  `;
  const params = [];

  if (type) {
    query += ' AND j.job_type = ?';
    params.push(type);
  }

  if (location) {
    query += ' AND j.location LIKE ?';
    params.push(`%${location}%`);
  }

  if (search) {
    query += ' AND (j.title LIKE ? OR j.company LIKE ? OR j.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY j.created_at DESC';

  db.all(query, params, (err, jobs) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(jobs);
  });
});

// Get single job
app.get('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;

  db.get(`
    SELECT j.*, u.name as posted_by_name 
    FROM jobs j 
    LEFT JOIN users u ON j.posted_by = u.id 
    WHERE j.id = ?
  `, [jobId], (err, job) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  });
});

// Post a new job (authenticated)
app.post('/api/jobs', authenticateToken, [
  body('title').trim().isLength({ min: 5 }),
  body('company').trim().isLength({ min: 2 }),
  body('location').trim().isLength({ min: 2 }),
  body('job_type').isIn(['remote', 'onsite', 'hybrid']),
  body('description').trim().isLength({ min: 50 }),
  body('requirements').trim().isLength({ min: 20 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, company, location, job_type, description, requirements, salary_range } = req.body;

  db.run(`
    INSERT INTO jobs (title, company, location, job_type, description, requirements, salary_range, posted_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [title, company, location, job_type, description, requirements, salary_range, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({ 
      message: 'Job posted successfully',
      jobId: this.lastID
    });
  });
});

// Apply for a job
app.post('/api/jobs/:id/apply', upload.single('resume'), [
  body('applicant_name').trim().isLength({ min: 2 }),
  body('applicant_email').isEmail().normalizeEmail(),
  body('applicant_phone').optional().trim(),
  body('cover_letter').trim().isLength({ min: 50 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const jobId = req.params.id;
  const { applicant_name, applicant_email, applicant_phone, cover_letter } = req.body;
  const resume_filename = req.file ? req.file.filename : null;

  // Check if job exists
  db.get('SELECT id FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Insert application
    db.run(`
      INSERT INTO applications (job_id, applicant_name, applicant_email, applicant_phone, cover_letter, resume_filename)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [jobId, applicant_name, applicant_email, applicant_phone, cover_letter, resume_filename], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({ 
        message: 'Application submitted successfully',
        applicationId: this.lastID
      });
    });
  });
});

// Get applications for a job (authenticated - job poster only)
app.get('/api/jobs/:id/applications', authenticateToken, (req, res) => {
  const jobId = req.params.id;

  // Check if user posted this job
  db.get('SELECT posted_by FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.posted_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    db.all('SELECT * FROM applications WHERE job_id = ? ORDER BY applied_at DESC', [jobId], (err, applications) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json(applications);
    });
  });
});

// Get user's posted jobs
app.get('/api/my-jobs', authenticateToken, (req, res) => {
  db.all(`
    SELECT j.*, COUNT(a.id) as application_count
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.posted_by = ?
    GROUP BY j.id
    ORDER BY j.created_at DESC
  `, [req.user.id], (err, jobs) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(jobs);
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


