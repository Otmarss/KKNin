import React, { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import Card from '../components/Card'
import '../styles/dashboard.css'

export default function Dashboard({ role = 'mahasiswa' }) {
  const [stats, setStats] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, profileData] = await Promise.all([
          apiClient.dashboard.getStats(),
          apiClient.dashboard.getProfile()
        ])
        setStats(statsData)
        setProfile(profileData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const roleConfigs = {
    mahasiswa: {
      title: 'Dashboard Mahasiswa',
      accent: 'blue',
    },
    dosen: {
      title: 'Dashboard Dosen Pembimbing',
      accent: 'green',
    },
    admin: {
      title: 'Dashboard Administrator',
      accent: 'purple',
    }
  }

  const cfg = roleConfigs[role]

  if (loading) {
    return <div className="dashboard"><p>Loading...</p></div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{cfg.title}</h1>
        <p className="welcome">Selamat datang, <strong>{profile?.name}</strong></p>
      </div>

      {stats && (
        <div className="stats-grid">
          {Object.entries(stats).map(([key, value]) => (
            <Card 
              key={key} 
              title={key.replace(/([A-Z])/g, ' $1').trim()} 
              value={value} 
              accent={cfg.accent} 
            />
          ))}
        </div>
      )}

      <div className="panels">
        <section className="panel info">
          <h3>Informasi Pribadi</h3>
          {profile && (
            <table>
              <tbody>
                <tr><td>Nama</td><td>{profile.name}</td></tr>
                <tr><td>Email</td><td>{profile.email}</td></tr>
                <tr><td>Role</td><td>{profile.role}</td></tr>
                {profile.nim_nip && <tr><td>NIM/NIP</td><td>{profile.nim_nip}</td></tr>}
              </tbody>
            </table>
          )}
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
