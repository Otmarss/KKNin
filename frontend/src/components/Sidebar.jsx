import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ role, currentPage, setCurrentPage }) {
  const { user, logout } = useAuth()
  
  const getMenu = () => {
    if (user?.role === 'mahasiswa') {
      return [
        { label: 'Dashboard', page: 'dashboard' },
        { label: 'Kelompok KKN', page: 'kelompok' }
      ]
    } else if (user?.role === 'dosen') {
      return [
        { label: 'Dashboard', page: 'dashboard' },
        { label: 'Bimbingan', page: 'bimbingan' }
      ]
    } else if (user?.role === 'admin') {
      return [
        { label: 'Dashboard', page: 'dashboard' },
        { label: 'Manajemen Mahasiswa', page: 'manajemen' }
      ]
    }
    return [{ label: 'Dashboard', page: 'dashboard' }]
  }

  const menu = getMenu()

  const handleMenuClick = (page) => {
    setCurrentPage(page)
  }

  return (
    <aside className={`sidebar sidebar-${role}`}>
      <div className="brand">
        <div className="avatar">{user?.name?.substring(0, 2)}</div>
        <div className="profile">
          <div className="name">{user?.name}</div>
          <div className="sub">{user?.role}</div>
        </div>
      </div>

      <nav className="menu">
        {menu.map((m) => (
          <button
            key={m.page}
            className={`menu-item ${currentPage === m.page ? 'active' : ''}`}
            onClick={() => handleMenuClick(m.page)}
            style={{ cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', padding: '12px 16px', color: currentPage === m.page ? '#2563eb' : '#6b7280', fontWeight: currentPage === m.page ? '600' : '500' }}
          >
            {m.label}
          </button>
        ))}
      </nav>

      <div className="logout">
        <button onClick={logout} style={{cursor: 'pointer', border: 'none', background: 'none', color: '#ef4444', padding: '8px', width: '100%', textAlign: 'left'}}>
          Keluar
        </button>
      </div>
    </aside>
  )
}
