import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'

export default function App(){
  const [role, setRole] = useState('mahasiswa') // mahasiswa | dosen | admin

  return (
    <div className={`app role-${role}`}>
      <Sidebar role={role} setRole={setRole} />
      <main className="main">
        <Dashboard role={role} />
      </main>
    </div>
  )
}
