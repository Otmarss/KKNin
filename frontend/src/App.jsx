import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/Sidebar'
import './styles.css'

function AppContent() {
  const { user } = useAuth()
  const [role, setRole] = useState(user?.role || 'mahasiswa')

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className={`app role-${user.role}`}>
      <Sidebar role={user.role} setRole={setRole} />
      <main className="main">
        <DashboardPage role={user.role} />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
