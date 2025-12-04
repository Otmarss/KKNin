# KKNin Dashboard (React + Vite)

Sistem KKN (Kuliah Kerja Nyata) dashboard dengan role-based interface: Mahasiswa, Dosen Pembimbing, dan Administrator.

## Struktur File

```
KKNin/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles.css
│   ├── pages/
│   │   └── Dashboard.jsx
│   └── components/
│       ├── Sidebar.jsx
│       └── Card.jsx
```

## Instalasi & Jalankan

```powershell
cd "D:\Adam\kampus\Web lanjut\KKNin"
npm install
npm run dev
```

Buka browser ke `http://localhost:5173`. Gunakan tombol di sidebar untuk switch antar role (Mahasiswa/Dosen/Admin).

## Fitur

- **3 Role Dashboard**: Mahasiswa, Dosen Pembimbing, Administrator
- **Sidebar Navigation**: Menu dinamis dengan role-based coloring
- **Stat Cards**: Display data dengan accent color per role
- **Info & Activity Panels**: Informasi user dan aktivitas terbaru
- **Responsive Design**: Menyesuaikan di layar lebih kecil

## Next Steps

- Setup Backend API (Node/Express atau Django)
- Implement Authentication & Authorization
- Add routing dengan React Router
- Form untuk input data groups, laporan, monitoring
- Database integration

