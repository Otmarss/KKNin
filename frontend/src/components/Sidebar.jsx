import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ role, setRole }) {
  const { user, logout } = useAuth()
  const menu = ['Dashboard', 'Kelompok KKN', 'Lokasi KKN', 'Program KKN', 'Laporan']

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
          <a key={m} className="menu-item" href="#">{m}</a>
        ))}
      </nav>

      <div className="logout">
        <button onClick={logout} style={{cursor: 'pointer', border: 'none', background: 'none', color: '#ef4444', padding: '8px'}}>
          Keluar
        </button>
      </div>
    </aside>
  )
}
