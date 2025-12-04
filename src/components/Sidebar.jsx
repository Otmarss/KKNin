import React from 'react'

const menu = ['Dashboard','Kelompok KKN','Lokasi KKN','Program KKN','Laporan']

export default function Sidebar({role, setRole}){
  return (
    <aside className={`sidebar sidebar-${role}`}>
      <div className="brand">
        <div className="avatar">SI</div>
        <div className="profile">
          <div className="name">Nama User</div>
          <div className="sub">NIM/ID</div>
        </div>
      </div>

      <nav className="menu">
        {menu.map((m)=> (
          <a key={m} className="menu-item" href="#">{m}</a>
        ))}
      </nav>

      <div className="role-switch">
        <button onClick={()=>setRole('mahasiswa')}>Mahasiswa</button>
        <button onClick={()=>setRole('dosen')}>Dosen</button>
        <button onClick={()=>setRole('admin')}>Admin</button>
      </div>

      <div className="logout">Keluar</div>
    </aside>
  )
}
