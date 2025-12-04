const pool = require('./config/database');

async function insertSampleData() {
  try {
    console.log('Inserting sample data...');
    
    // Get existing users
    const [users] = await pool.query(`SELECT id, role, name FROM users WHERE role IN ('mahasiswa', 'dosen')`);
    
    if (users.length === 0) {
      console.log('No users found');
      process.exit(1);
    }

    // Find mahasiswa and dosen
    const mahasiswa = users.filter(u => u.role === 'mahasiswa');
    const dosen = users.filter(u => u.role === 'dosen');

    if (mahasiswa.length === 0 || dosen.length === 0) {
      console.log('Need at least one mahasiswa and one dosen');
      process.exit(1);
    }

    // Insert programs
    const programData = [
      { name: 'Program Pemberdayaan Masyarakat', description: 'Pemberdayaan ekonomi lokal' },
      { name: 'Program Pendidikan', description: 'Peningkatan mutu pendidikan' },
      { name: 'Program Kesehatan', description: 'Peningkatan kesehatan masyarakat' }
    ];

    const programResults = [];
    for (const prog of programData) {
      const [result] = await pool.query(
        'INSERT INTO programs (name, description) VALUES (?, ?)',
        [prog.name, prog.description]
      );
      programResults.push(result.insertId);
    }
    console.log(`✓ Inserted ${programResults.length} programs`);

    // Insert locations
    const locationData = [
      { name: 'Desa Sukamaju', address: 'Jln. Raya No 1, Kab. Bandung' },
      { name: 'Desa Jaya Sentosa', address: 'Jln. Merdeka No 5, Kab. Bogor' },
      { name: 'Desa Makmur Jaya', address: 'Jln. Sultan No 10, Kota Depok' }
    ];

    const locationResults = [];
    for (const loc of locationData) {
      const [result] = await pool.query(
        'INSERT INTO locations (name, address) VALUES (?, ?)',
        [loc.name, loc.address]
      );
      locationResults.push(result.insertId);
    }
    console.log(`✓ Inserted ${locationResults.length} locations`);

    // Insert groups
    const groupData = [
      { name: 'Kelompok A', user_id: mahasiswa[0].id, program_id: programResults[0], location_id: locationResults[0], status: 'active' },
      { name: 'Kelompok B', user_id: mahasiswa[Math.min(1, mahasiswa.length-1)].id, program_id: programResults[1], location_id: locationResults[1], status: 'active' },
      { name: 'Kelompok C', user_id: mahasiswa[Math.min(2, mahasiswa.length-1)].id, program_id: programResults[2], location_id: locationResults[2], status: 'active' }
    ];

    const groupResults = [];
    for (const grp of groupData) {
      const [result] = await pool.query(
        'INSERT INTO groups (name, user_id, program_id, location_id, status) VALUES (?, ?, ?, ?, ?)',
        [grp.name, grp.user_id, grp.program_id, grp.location_id, grp.status]
      );
      groupResults.push(result.insertId);
    }
    console.log(`✓ Inserted ${groupResults.length} groups`);

    // Insert group members (assign mahasiswa to groups)
    if (mahasiswa.length > 0) {
      const [existingMembers] = await pool.query('SELECT COUNT(*) as count FROM group_members');
      if (existingMembers[0].count === 0) {
        for (let i = 0; i < mahasiswa.length; i++) {
          const groupIdx = i % groupResults.length;
          await pool.query(
            'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
            [groupResults[groupIdx], mahasiswa[i].id]
          );
        }
        console.log(`✓ Inserted ${mahasiswa.length} group members`);
      }
    }

    // Insert group mentors (assign dosen to groups)
    if (dosen.length > 0) {
      const [existingMentors] = await pool.query('SELECT COUNT(*) as count FROM group_mentors');
      if (existingMentors[0].count === 0) {
        for (let i = 0; i < dosen.length; i++) {
          const groupIdx = i % groupResults.length;
          await pool.query(
            'INSERT INTO group_mentors (group_id, mentor_id) VALUES (?, ?)',
            [groupResults[groupIdx], dosen[i].id]
          );
        }
        console.log(`✓ Inserted ${dosen.length} group mentors`);
      }
    }

    // Insert sample reports
    if (groupResults.length > 0) {
      const [existingReports] = await pool.query('SELECT COUNT(*) as count FROM reports');
      if (existingReports[0].count === 0) {
        const reportData = [
          { group_id: groupResults[0], user_id: mahasiswa[0].id, title: 'Laporan Minggu 1', description: 'Kegiatan persiapan dan observasi lapangan', week: 1 },
          { group_id: groupResults[0], user_id: mahasiswa[0].id, title: 'Laporan Minggu 2', description: 'Pelaksanaan program pemberdayaan', week: 2 },
          { group_id: groupResults[1], user_id: mahasiswa[Math.min(1, mahasiswa.length-1)].id, title: 'Laporan Minggu 1', description: 'Persiapan materi pembelajaran', week: 1 }
        ];

        for (const report of reportData) {
          await pool.query(
            'INSERT INTO reports (group_id, user_id, title, description, status) VALUES (?, ?, ?, ?, ?)',
            [report.group_id, report.user_id, report.title, report.description, 'submitted']
          );
        }
        console.log(`✓ Inserted ${reportData.length} sample reports`);
      }
    }

    console.log('\n✅ Sample data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample data:', error);
    process.exit(1);
  }
}

insertSampleData();
