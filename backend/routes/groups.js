const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all groups (untuk mahasiswa - hanya kelompoknya)
router.get('/groups', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let query, params;

    if (role === 'mahasiswa') {
      // Ambil kelompok yang user ikuti
      query = `
        SELECT g.*, p.name as program_name, l.name as location_name, COUNT(gm.user_id) as member_count
        FROM groups g
        LEFT JOIN programs p ON g.program_id = p.id
        LEFT JOIN locations l ON g.location_id = l.id
        LEFT JOIN group_members gm ON g.id = gm.group_id
        WHERE g.id IN (SELECT group_id FROM group_members WHERE user_id = ?)
        GROUP BY g.id
      `;
      params = [userId];
    } else if (role === 'dosen') {
      // Ambil kelompok yang dibimbing
      query = `
        SELECT g.*, p.name as program_name, l.name as location_name, COUNT(gm.user_id) as member_count
        FROM groups g
        LEFT JOIN programs p ON g.program_id = p.id
        LEFT JOIN locations l ON g.location_id = l.id
        LEFT JOIN group_members gm ON g.id = gm.group_id
        WHERE g.id IN (SELECT group_id FROM group_mentors WHERE mentor_id = ?)
        GROUP BY g.id
      `;
      params = [userId];
    } else if (role === 'admin') {
      // Ambil semua kelompok
      query = `
        SELECT g.*, p.name as program_name, l.name as location_name, COUNT(gm.user_id) as member_count
        FROM groups g
        LEFT JOIN programs p ON g.program_id = p.id
        LEFT JOIN locations l ON g.location_id = l.id
        LEFT JOIN group_members gm ON g.id = gm.group_id
        GROUP BY g.id
      `;
      params = [];
    }

    const [groups] = await pool.query(query, params);

    res.json(groups);
  } catch (error) {
    console.error('Groups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group members
router.get('/groups/:groupId/members', authenticateToken, async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const [members] = await pool.query(`
      SELECT u.id, u.name, u.email, u.nim_nip, u.role
      FROM users u
      JOIN group_members gm ON u.id = gm.user_id
      WHERE gm.group_id = ?
      ORDER BY u.name
    `, [groupId]);
    
    res.json(members);
  } catch (error) {
    console.error('Members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (untuk admin)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const role = req.user.role;
    
    // Hanya admin yang bisa access
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const [users] = await pool.query(`
      SELECT id, name, email, role, nim_nip, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.json(users);
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user (untuk admin)
router.post('/users', authenticateToken, async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, email, password, role: newRole, nim_nip } = req.body;
    
    if (!name || !email || !password || !newRole) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, nim_nip) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, newRole, nim_nip || null]
    );
    
    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (untuk admin)
router.put('/users/:userId', authenticateToken, async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { userId } = req.params;
    const { name, email, role: newRole, nim_nip } = req.body;

    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, nim_nip = ? WHERE id = ?',
      [name, email, newRole, nim_nip || null, userId]
    );
    
    res.json({ message: 'User updated' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (untuk admin)
router.delete('/users/:userId', authenticateToken, async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { userId } = req.params;

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reports
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let query, params;

    if (role === 'mahasiswa') {
      query = `
        SELECT r.*, g.name as group_name, u.name as submitter_name
        FROM reports r
        JOIN groups g ON r.group_id = g.id
        JOIN users u ON r.user_id = u.id
        WHERE r.group_id IN (SELECT group_id FROM group_members WHERE user_id = ?)
        ORDER BY r.created_at DESC
      `;
      params = [userId];
    } else if (role === 'dosen') {
      query = `
        SELECT r.*, g.name as group_name, u.name as submitter_name
        FROM reports r
        JOIN groups g ON r.group_id = g.id
        JOIN users u ON r.user_id = u.id
        WHERE g.id IN (SELECT group_id FROM group_mentors WHERE mentor_id = ?)
        ORDER BY r.created_at DESC
      `;
      params = [userId];
    } else if (role === 'admin') {
      query = `
        SELECT r.*, g.name as group_name, u.name as submitter_name
        FROM reports r
        JOIN groups g ON r.group_id = g.id
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
      `;
      params = [];
    }

    const [reports] = await pool.query(query, params);

    res.json(reports);
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Update report status (approve/reject) - accessible by dosen/admin
router.put('/reports/:reportId/status', authenticateToken, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    const role = req.user.role;

    if (!['approved', 'rejected', 'submitted', 'draft'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (role !== 'dosen' && role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await pool.query('UPDATE reports SET status = ? , updated_at = NOW() WHERE id = ?', [status, reportId]);

    res.json({ message: 'Report status updated' });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
