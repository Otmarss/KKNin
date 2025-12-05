import React, { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import '../styles/pages.css'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await apiClient.request('/data/reports')
      setReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeStatus = async (id, status) => {
    if (!window.confirm(`Set status menjadi ${status}?`)) return
    try {
      await apiClient.request(`/data/reports/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
      fetchReports()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Gagal update status')
    }
  }

  if (loading) return <div className="page-container"><p>Loading...</p></div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Laporan</h1>
        <p>Daftar laporan kelompok</p>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">Belum ada laporan</div>
      ) : (
        <div className="members-section">
          <table className="members-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Kelompok</th>
                <th>Judul</th>
                <th>Submitter</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.group_name}</td>
                  <td>{r.title || r.name}</td>
                  <td>{r.submitter_name}</td>
                  <td><span className={`status-badge ${r.status === 'submitted' ? 'active' : ''}`}>{r.status}</span></td>
                  <td>
                    <div style={{display: 'flex', gap: 8}}>
                      <button className="btn-secondary" onClick={() => alert(r.description || r.content || 'Tidak ada detail')}>Lihat</button>
                      {(/* show approve/reject for dosen/admin via API errors if not allowed */ true) && (
                        <>
                          <button className="btn-primary" onClick={() => handleChangeStatus(r.id, 'approved')}>Setujui</button>
                          <button className="btn-secondary" onClick={() => handleChangeStatus(r.id, 'rejected')}>Tolak</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
