import React, { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import '../styles/pages.css'

export default function BimbinganPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const data = await apiClient.request('/data/groups')
      setGroups(data)
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page-container"><p>Loading...</p></div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Kelompok Bimbingan</h1>
        <p>Daftar kelompok yang Anda bimbing</p>
      </div>

      <div className="bimbingan-grid">
        {groups.length === 0 ? (
          <div className="empty-state">
            <p>Anda tidak membimbing kelompok manapun</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="bimbingan-card">
              <div className="card-header">
                <h3>{group.name}</h3>
                <span className="location">{group.location_name}</span>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <span className="label">Kelompok</span>
                  <span className="value">1</span>
                </div>
                <div className="stat">
                  <span className="label">Total Mahasiswa</span>
                  <span className="value">{group.member_count}</span>
                </div>
                <div className="stat">
                  <span className="label">Progress</span>
                  <span className="value">75%</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <p className="progress-text">Program 75% Selesai</p>
              </div>

              <div className="card-footer">
                <button className="btn-secondary">Detail</button>
                <button className="btn-primary">Monitoring</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
