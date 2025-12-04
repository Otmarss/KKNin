import React, { useState, useEffect } from 'react'
import { apiClient } from '../services/api'
import '../styles/pages.css'

export default function ManajemenMahasiswaPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'mahasiswa',
    nim_nip: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await apiClient.request('/data/users')
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await apiClient.request(`/data/users/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        })
      } else {
        await apiClient.request('/data/users', {
          method: 'POST',
          body: JSON.stringify({ ...formData, password: 'test123' })
        })
      }
      fetchUsers()
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', email: '', role: 'mahasiswa', nim_nip: '' })
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      nim_nip: user.nim_nip
    })
    setEditingId(user.id)
    setShowForm(true)
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await apiClient.request(`/data/users/${userId}`, {
          method: 'DELETE'
        })
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  if (loading) return <div className="page-container"><p>Loading...</p></div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manajemen Mahasiswa</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ name: '', email: '', role: 'mahasiswa', nim_nip: '' })
          }}
        >
          + Tambah Mahasiswa
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Edit' : 'Tambah'} Mahasiswa</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>NIM</label>
              <input
                type="text"
                name="nim_nip"
                value={formData.nim_nip}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange}>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Simpan</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>NIM</th>
            <th>Nama</th>
            <th>Program Studi</th>
            <th>Email</th>
            <th>Kelompok</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u => u.role === 'mahasiswa').map((user) => (
            <tr key={user.id}>
              <td>{user.nim_nip}</td>
              <td>{user.name}</td>
              <td>Teknik Informatika</td>
              <td>{user.email}</td>
              <td>A1</td>
              <td><span className="status-badge active">Aktif</span></td>
              <td className="actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(user)}
                >
                  ✏️
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(user.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
