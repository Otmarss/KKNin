@echo off
REM KKNin Database Setup Script
REM Run this first to setup database

echo.
echo ================================
echo  KKNin Database Setup
echo ================================
echo.

REM Check if mysql is installed
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] MySQL tidak ditemukan di PATH
    echo Pastikan MySQL sudah installed dan di-add ke PATH
    pause
    exit /b 1
)

echo [1/2] Creating database schema...
mysql -u root -p < database\schema.sql

if %errorlevel% neq 0 (
    echo [ERROR] Gagal membuat database
    pause
    exit /b 1
)

echo [SUCCESS] Database schema created!
echo.
echo [2/2] Setting demo password (test123)...
mysql -u root -p < database\setup-passwords.sql

if %errorlevel% neq 0 (
    echo [ERROR] Gagal setup password
    pause
    exit /b 1
)

echo.
echo ================================
echo [SUCCESS] Database setup complete!
echo ================================
echo.
echo Demo Accounts:
echo   Email: ahmad.rizki@student.ac.id (Mahasiswa)
echo   Email: siti.nurhaida@university.ac.id (Dosen)
echo   Email: budi.admin@university.ac.id (Admin)
echo   Password: test123 (untuk semua)
echo.
echo Next: Run start-backend.bat dan start-frontend.bat
echo.
pause
