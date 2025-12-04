const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats (protected)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let stats = {};

    const conn = await pool.getConnection();

    if (role === 'mahasiswa') {
      const [groups] = await conn.execute(
        'SELECT COUNT(*) as count FROM groups WHERE user_id = ?',
        [userId]
      );
      const [reports] = await conn.execute(
        'SELECT COUNT(*) as count FROM reports WHERE user_id = ?',
        [userId]
      );
      stats = {
        kelompok: groups[0].count,
        lokasiKkn: 'Desa Sukamaju',
        programSelesai: '8/12',
        hariTersisa: '15'
      };
    } else if (role === 'dosen') {
      const [groups] = await conn.execute(
        'SELECT COUNT(DISTINCT group_id) as count FROM group_mentors WHERE mentor_id = ?',
        [userId]
      );
      const [students] = await conn.execute(
        'SELECT COUNT(*) as count FROM group_members WHERE group_id IN (SELECT group_id FROM group_mentors WHERE mentor_id = ?)',
        [userId]
      );
      const [reports] = await conn.execute(
        'SELECT COUNT(*) as count FROM reports WHERE status = "approved" AND group_id IN (SELECT group_id FROM group_mentors WHERE mentor_id = ?)',
        [userId]
      );
      stats = {
        kelompokBimbingan: groups[0].count,
        totalMahasiswa: students[0].count,
        laporanDisetujui: reports[0].count,
        menungguReview: 5
      };
    } else if (role === 'admin') {
      const [users] = await conn.execute('SELECT COUNT(*) as count FROM users WHERE role = "mahasiswa"');
      const [groups] = await conn.execute('SELECT COUNT(*) as count FROM groups');
      const [locations] = await conn.execute('SELECT COUNT(*) as count FROM locations');
      const [programs] = await conn.execute('SELECT COUNT(*) as count FROM programs');
      
      stats = {
        totalMahasiswa: users[0].count,
        totalKelompok: groups[0].count,
        lokasiKkn: locations[0].count,
        programKkn: programs[0].count
      };
    }

    conn.release();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [users] = await conn.execute('SELECT id, name, email, role, nim_nip FROM users WHERE id = ?', [req.user.id]);
    conn.release();

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
