-- Setup password untuk demo users
-- Password: test123 (di-hash dengan bcrypt)

USE kknin_db;

-- Ahmad Rizki (Mahasiswa)
UPDATE users SET password = '$2a$10$KHYEbNxGbobFiwABDgxhj..pGjYwxpTNYEloegrqHjXIDMwnkEwsG' 
WHERE email = 'ahmad.rizki@student.ac.id';

-- Dr. Siti Nurhaida (Dosen Pembimbing)
UPDATE users SET password = '$2a$10$KHYEbNxGbobFiwABDgxhj..pGjYwxpTNYEloegrqHjXIDMwnkEwsG' 
WHERE email = 'siti.nurhaida@university.ac.id';

-- Budi Santoso (Admin)
UPDATE users SET password = '$2a$10$KHYEbNxGbobFiwABDgxhj..pGjYwxpTNYEloegrqHjXIDMwnkEwsG' 
WHERE email = 'budi.admin@university.ac.id';

-- Verify
SELECT 'Passwords updated successfully!' as message;

