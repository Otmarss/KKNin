const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, nim_nip } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, nim_nip) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, nim_nip || null]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Temporary debug log for login attempts
    try {
      console.log(`[auth] Login attempt for: ${email}`);
      const dbgPath = path.join(__dirname, '..', 'debug-login.log');
      fs.appendFileSync(dbgPath, `${new Date().toISOString()} - Login attempt for: ${email}\n`);
      // Also write to a fixed location to ensure we can read it from outside
      try { fs.appendFileSync('C:\\kknin-debug.log', `${new Date().toISOString()} - Login attempt for: ${email}\n`); } catch(e) { /* ignore */ }
    } catch (e) {
      console.error('[auth] Failed to write debug log', e);
    }

    // Step 1: fetch user
    let users;
    try {
      [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    } catch (e) {
      console.error('[auth] DB error:', e);
      try { fs.appendFileSync('C:\\kknin-debug.log', `${new Date().toISOString()} - DB error: ${e.message}\n`); } catch(_) {}
      return res.status(500).json({ message: 'DB error', detail: e.message });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Step 2: verify password
    let validPassword;
    try {
      validPassword = await bcrypt.compare(password, user.password);
    } catch (e) {
      console.error('[auth] bcrypt error:', e);
      try { fs.appendFileSync('C:\\kknin-debug.log', `${new Date().toISOString()} - bcrypt error: ${e.message}\n`); } catch(_) {}
      return res.status(500).json({ message: 'Password verification error', detail: e.message });
    }

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Step 3: sign token
    let token;
    try {
      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    } catch (e) {
      console.error('[auth] JWT sign error:', e);
      try { fs.appendFileSync('C:\\kknin-debug.log', `${new Date().toISOString()} - JWT sign error: ${e.message}\n`); } catch(_) {}
      return res.status(500).json({ message: 'Token creation error', detail: e.message });
    }

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    try {
      const dbgPath = path.join(__dirname, '..', 'debug-login.log');
      fs.appendFileSync(dbgPath, `${new Date().toISOString()} - ERROR: ${error.stack || error}\n`);
      try { fs.appendFileSync('C:\\kknin-debug.log', `${new Date().toISOString()} - ERROR: ${error.stack || error}\n`); } catch(e) { /* ignore */ }
    } catch (e) {
      console.error('[auth] Failed to write error log', e);
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
