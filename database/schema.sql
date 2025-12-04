-- KKNin Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS kknin_db;
USE kknin_db;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('mahasiswa', 'dosen', 'admin') NOT NULL,
  nim_nip VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_days INT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations table
CREATE TABLE locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  location_id INT NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Group members table
CREATE TABLE group_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_member (group_id, user_id)
);

-- Group mentors table
CREATE TABLE group_mentors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  group_id INT NOT NULL,
  mentor_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (mentor_id) REFERENCES users(id),
  UNIQUE KEY unique_mentor (group_id, mentor_id)
);

-- Reports table
CREATE TABLE reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_path VARCHAR(255),
  status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
  submitted_at TIMESTAMP NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Attendance table
CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  group_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('present', 'absent', 'sick', 'permit') DEFAULT 'present',
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (group_id) REFERENCES groups(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_groups_user ON groups(user_id);
CREATE INDEX idx_groups_program ON groups(program_id);
CREATE INDEX idx_groups_location ON groups(location_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_mentors_group ON group_mentors(group_id);
CREATE INDEX idx_reports_group ON reports(group_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_attendance_user ON attendance(user_id);

-- Insert sample data
INSERT INTO users (name, email, password, role, nim_nip) VALUES
('Ahmad Rizki', 'ahmad.rizki@student.ac.id', '$2a$10$Dummy', 'mahasiswa', '2021010001'),
('Dr. Siti Nurhaida', 'siti.nurhaida@university.ac.id', '$2a$10$Dummy', 'dosen', '001122'),
('Budi Santoso', 'budi.admin@university.ac.id', '$2a$10$Dummy', 'admin', 'ADMIN001');

INSERT INTO programs (name, description, duration_days, start_date, end_date) VALUES
('KKN Reguler 2025', 'Program KKN Reguler Tahun 2025', 60, '2025-01-15', '2025-03-15'),
('KKN Tematik', 'Program KKN Tematik', 45, '2025-02-01', '2025-03-18');

INSERT INTO locations (name, province, city, address) VALUES
('Desa Sukamaju', 'Jawa Barat', 'Sumedang', 'Jl. Raya Sukamaju No. 123'),
('Desa Maju Jaya', 'Jawa Barat', 'Bandung', 'Jl. Merdeka No. 456');
