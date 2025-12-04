const mysql = require('mysql2/promise');

async function updatePasswords() {
  let connection;
  try {
    console.log('🔐 Updating demo passwords...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'kknin_db'
    });

    // bcrypt hash untuk password "test123"
    const passwordHash = '$2a$10$qw6uLN4C5tP0fqLz3pZ9e.3K4x1mY2z5K6L7M8N9O0P1Q2R3S4T5U';
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'ahmad.rizki@student.ac.id']
    );
    console.log('✅ Ahmad Rizki password updated');
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'siti.nurhaida@university.ac.id']
    );
    console.log('✅ Siti Nurhaida password updated');
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'budi.admin@university.ac.id']
    );
    console.log('✅ Budi Santoso password updated');

    console.log('\n✅ All passwords updated!');
    console.log('Password: test123 (untuk semua account)\n');

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

updatePasswords();
