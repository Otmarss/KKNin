import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import KelompokKKNPage from './pages/KelompokKKNPage'
import BimbinganPage from './pages/BimbinganPage'
import ManajemenMahasiswaPage from './pages/ManajemenMahasiswaPage'
import Sidebar from './components/Sidebar'
import './styles.css'
import './styles/pages.css'
import ReportsPage from './pages/ReportsPage'

function AppContent() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (!user) {
    return <LoginPage />
  }

  const renderPage = () => {
    if (user.role === 'mahasiswa') {
      switch (currentPage) {
        case 'kelompok':
          return <KelompokKKNPage />
        default:
          return <DashboardPage role={user.role} />
      }
    } else if (user.role === 'dosen') {
      switch (currentPage) {
        case 'bimbingan':
          return <BimbinganPage />
        default:
          return <DashboardPage role={user.role} />
      }
    } else if (user.role === 'admin') {
      switch (currentPage) {
        case 'manajemen':
          return <ManajemenMahasiswaPage />
        case 'reports':
          return <ReportsPage />
        default:
          return <DashboardPage role={user.role} />
      }
    }
    return <DashboardPage role={user.role} />
  }

  return (
    <div className={`app role-${user.role}`}>
      <Sidebar role={user.role} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main">
        {renderPage()}
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
