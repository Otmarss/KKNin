import React from 'react'
import Card from '../components/Card'

const roleConfigs = {
  mahasiswa: {
    title: 'Dashboard Mahasiswa',
    accent: 'blue',
    stats: [
      {label:'Kelompok', value:'Kelompok A1'},
      {label:'Lokasi KKN', value:'Desa Sukamaju'},
      {label:'Program Selesai', value:'8/12'},
      {label:'Hari Tersisa', value:'15 Hari'}
    ]
  },
  dosen: {
    title: 'Dashboard Dosen Pembimbing',
    accent: 'green',
    stats: [
      {label:'Kelompok Bimbingan', value:3},
      {label:'Total Mahasiswa', value:15},
      {label:'Laporan Disetujui', value:28},
      {label:'Menunggu Review', value:5}
    ]
  },
  admin: {
    title: 'Dashboard Administrator',
    accent: 'purple',
    stats: [
      {label:'Total Mahasiswa', value:250},
      {label:'Total Kelompok', value:50},
      {label:'Lokasi KKN', value:45},
      {label:'Program KKN', value:12}
    ]
  }
}

export default function Dashboard({role='mahasiswa'}){
  const cfg = roleConfigs[role]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{cfg.title}</h1>
        <p className="welcome">Selamat datang, <strong>Nama User</strong></p>
      </div>

      <div className="stats-grid">
        {cfg.stats.map((s, idx)=> (
          <Card key={idx} title={s.label} value={s.value} accent={cfg.accent} />
        ))}
      </div>

      <div className="panels">
        <section className="panel info">
          <h3>Informasi</h3>
          <table>
            <tbody>
              <tr><td>Nama Lengkap</td><td>Ahmad Rizki</td></tr>
              <tr><td>NIM</td><td>2021010001</td></tr>
              <tr><td>Email</td><td>ahmad.rizki@student.ac.id</td></tr>
              <tr><td>Program Studi</td><td>Teknik Informatika</td></tr>
            </tbody>
          </table>
        </section>

        <section className="panel activity">
          <h3>Aktivitas Terbaru</h3>
          <ul>
            <li>Upload laporan kegiatan mengajar <span className="muted">2025-12-01</span></li>
            <li>Absensi kehadiran <span className="muted">2025-11-29</span></li>
            <li>Upload laporan program kesehatan <span className="muted">2025-11-27</span></li>
          </ul>
        </section>
      </div>
    </div>
  )
}
