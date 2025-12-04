import React, { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import '../styles/pages.css'

export default function KelompokKKNPage() {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [members, setMembers] = useState([])
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

  const handleSelectGroup = async (group) => {
    setSelectedGroup(group)
    try {
      const data = await apiClient.request(`/data/groups/${group.id}/members`)
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  if (loading) return <div className="page-container"><p>Loading...</p></div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Kelompok KKN</h1>
        <p>Informasi kelompok dan anggota KKN Anda</p>
      </div>

      <div className="kelompok-container">
        {groups.length === 0 ? (
          <div className="empty-state">
            <p>Anda belum bergabung dengan kelompok manapun</p>
          </div>
        ) : (
          <div className="kelompok-grid">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`kelompok-card ${selectedGroup?.id === group.id ? 'active' : ''}`}
                onClick={() => handleSelectGroup(group)}
              >
                <div className="card-header">
                  <h3>{group.name}</h3>
                  <span className="badge">{group.status}</span>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span>Program:</span>
                    <span className="value">{group.program_name}</span>
                  </div>
                  <div className="info-row">
                    <span>Lokasi:</span>
                    <span className="value">{group.location_name}</span>
                  </div>
                  <div className="info-row">
                    <span>Anggota:</span>
                    <span className="value">{group.member_count} orang</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedGroup && (
          <div className="members-section">
            <h2>Anggota Kelompok: {selectedGroup.name}</h2>
            <table className="members-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIM</th>
                  <th>Program Studi</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, idx) => (
                  <tr key={member.id}>
                    <td>{idx + 1}</td>
                    <td>{member.name}</td>
                    <td>{member.nim_nip}</td>
                    <td>Teknik Informatika</td>
                    <td>{member.email}</td>
                    <td><span className="status-badge active">Aktif</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
