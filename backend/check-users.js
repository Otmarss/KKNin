const mysql = require('mysql2/promise');

async function checkUsers() {
  let connection;
  try {
    console.log('🔍 Checking demo users in database...\n');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'kknin_db'
    });

    const [users] = await connection.execute(
      'SELECT id, name, email, role FROM users'
    );

    console.log('📋 Demo Users Found:');
    console.log('='.repeat(70));
    
    users.forEach((user, idx) => {
      console.log(`\n${idx + 1}. ${user.name}`);
      console.log(`   Role:  ${user.role}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID:    ${user.id}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('\n🔐 LOGIN CREDENTIALS FOR ALL USERS:');
    console.log('='.repeat(70));
    console.log('\nPassword: test123 (untuk semua account)\n');

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

checkUsers();
