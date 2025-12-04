# KKNin - Sistem Manajemen KKN

Aplikasi web lengkap untuk manajemen Kuliah Kerja Nyata (KKN) dengan:
- **Frontend**: React + Vite + CSS
- **Backend**: Node.js + Express
- **Database**: MySQL
- **API**: REST API dengan JWT Auth

## Struktur Proyek

```
KKNin/
├── frontend/                 # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Pages (Login, Dashboard)
│   │   ├── context/         # Auth context
│   │   ├── services/        # API client
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js backend (Express)
│   ├── config/              # Database config
│   ├── middleware/          # Auth middleware
│   ├── routes/              # API routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server
│   └── package.json
│
└── database/                 # Database
    └── schema.sql           # MySQL schema
```

## Persyaratan

- Node.js v16+ & npm v8+
- MySQL v5.7+
- Git (opsional)

## Setup & Run

### 1. Setup Database MySQL

Buka MySQL client Anda:

```bash
mysql -u root -p
```

Jalankan script database:

```sql
-- Copy & paste isi dari KKNin/database/schema.sql
```

Atau gunakan command line:

```bash
mysql -u root -p < "D:\Adam\kampus\Web lanjut\KKNin\database\schema.sql"
```

### 2. Setup Backend (Node.js)

Buka PowerShell/Terminal baru, navigasi ke folder backend:

```powershell
cd "D:\Adam\kampus\Web lanjut\KKNin\backend"
npm install
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

**Update `.env` file dengan credential MySQL Anda:**

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kknin_db
JWT_SECRET=your_secret_key
```

### 3. Setup Frontend (React)

Buka PowerShell/Terminal baru, navigasi ke folder frontend:

```powershell
cd "D:\Adam\kampus\Web lanjut\KKNin\frontend"
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 4. Testing

Login dengan demo account:

| Role | Email | Password |
|------|-------|----------|
| Mahasiswa | ahmad.rizki@student.ac.id | (sesuaikan di DB) |
| Dosen | siti.nurhaida@university.ac.id | (sesuaikan di DB) |
| Admin | budi.admin@university.ac.id | (sesuaikan di DB) |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login & dapatkan JWT token

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard stats (protected)
- `GET /api/dashboard/profile` - Get user profile (protected)

Semua request ke `/api/dashboard/*` memerlukan header:
```
Authorization: Bearer <token>
```

## Fitur

✅ Role-based Dashboard (Mahasiswa, Dosen, Admin)
✅ Authentication dengan JWT
✅ RESTful API
✅ MySQL Database
✅ Responsive Design
✅ CORS enabled

## Next Steps

- [ ] Add routing untuk lebih banyak pages
- [ ] Implement CRUD untuk Groups, Reports, Attendance
- [ ] Add file upload untuk laporan
- [ ] Implement role-based middleware di backend
- [ ] Add pagination & filtering
- [ ] Implement real-time notifications
- [ ] Add email notifications
- [ ] Deployment ke production

## Tips Development

**Frontend hot reload:**
```powershell
cd frontend
npm run dev
```

**Backend auto-restart dengan nodemon:**
```powershell
cd backend
npm run dev
```

**Cek API health:**
```powershell
# Buka di browser atau curl:
curl http://localhost:5000/health
```

## Troubleshooting

### Error: Cannot connect to MySQL
- Pastikan MySQL service sudah running
- Verifikasi DB_HOST, DB_USER, DB_PASSWORD di `.env`
- Cek apakah database `kknin_db` sudah dibuat

### Error: CORS error di frontend
- Backend harus enable CORS (sudah dikonfigurasi)
- Pastikan frontend URL di whitelist (jika perlu)

### Error: Invalid token
- Token expired, user perlu login ulang
- Cek JWT_SECRET di backend `.env`

## Production Deployment

Untuk deploy ke production:

1. **Frontend**: Build & deploy ke Vercel/Netlify/GitHub Pages
```powershell
cd frontend
npm run build
```

2. **Backend**: Deploy ke Heroku/Railway/VPS dengan Node.js
```powershell
cd backend
npm start
```

3. **Database**: Setup MySQL di cloud provider (AWS RDS, DigitalOcean, dll)

---

**Dibuat untuk KKN Management System | 2025**

