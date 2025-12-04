const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function hashAndSetPasswords() {
  let connection;
  try {
    console.log('🔐 Generating password hashes...');
    
    // Hash password "test123"
    const passwordHash = await bcrypt.hash('test123', 10);
    console.log('✅ Generated hash:', passwordHash);
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'kknin_db'
    });

    console.log('📝 Updating users with new hash...');
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'ahmad.rizki@student.ac.id']
    );
    console.log('✅ Ahmad Rizki');
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'siti.nurhaida@university.ac.id']
    );
    console.log('✅ Siti Nurhaida');
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'budi.admin@university.ac.id']
    );
    console.log('✅ Budi Santoso');

    console.log('\n✅ All passwords updated!');
    console.log('Demo Password: test123\n');

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

hashAndSetPasswords();
