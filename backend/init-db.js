const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;
  try {
    console.log('🔧 Step 1: Connecting to MySQL (without database)...');
    
    // Connect tanpa database dulu
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('✅ Connected to MySQL');

    // Read schema file
    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and execute each statement
    console.log('🔧 Step 2: Creating database and tables...');
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('✅ Database created');

    // Reconnect dengan database
    await connection.end();
    
    console.log('🔧 Step 3: Connecting to kknin_db...');
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'kknin_db'
    });

    // Setup passwords
    console.log('🔐 Step 4: Setting up demo passwords...');
    const passwordHash = '$2a$10$qw6uLN4C5tP0fqLz3pZ9e.3K4x1mY2z5K6L7M8N9O0P1Q2R3S4T5U';
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'ahmad.rizki@student.ac.id']
    );
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'siti.nurhaida@university.ac.id']
    );
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [passwordHash, 'budi.admin@university.ac.id']
    );

    console.log('✅ Demo passwords set');

    // Verify users
    console.log('\n📋 Demo Accounts:');
    const [users] = await connection.execute('SELECT id, name, email, role FROM users');
    users.forEach(user => {
      console.log(`  • ${user.name} (${user.role})`);
      console.log(`    Email: ${user.email}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE SETUP COMPLETE!');
    console.log('='.repeat(50));
    console.log('\n🔐 Demo Login Credentials:');
    console.log('  Password: test123 (untuk semua account)');
    console.log('\n📝 Demo Accounts:');
    console.log('  1. Mahasiswa: ahmad.rizki@student.ac.id');
    console.log('  2. Dosen:     siti.nurhaida@university.ac.id');
    console.log('  3. Admin:     budi.admin@university.ac.id');
    console.log('\n🌐 Testing URLs:');
    console.log('  Frontend: http://localhost:3000');
    console.log('  Backend:  http://localhost:5000');
    console.log('\n✨ Anda siap testing!');

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    if (connection) await connection.end();
    process.exit(1);
  }
}

setupDatabase();
