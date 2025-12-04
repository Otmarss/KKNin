import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    
    if (!email || !password) {
      setLocalError('Email dan password harus diisi')
      return
    }

    try {
      await login(email, password)
      // Redirect akan ditangani di router
    } catch (err) {
      setLocalError(err.message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>KKNin</h1>
          <p>Sistem Manajemen KKN</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              disabled={loading}
            />
          </div>

          {(error || localError) && (
            <div className="error-message">{error || localError}</div>
          )}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Loading...' : 'Masuk'}
          </button>
        </form>

        <div className="demo-accounts">
          <p className="demo-title">Demo Account:</p>
          <div className="demo-list">
            <div className="demo-item">
              <strong>Mahasiswa:</strong> ahmad.rizki@student.ac.id
            </div>
            <div className="demo-item">
              <strong>Dosen:</strong> siti.nurhaida@university.ac.id
            </div>
            <div className="demo-item">
              <strong>Admin:</strong> budi.admin@university.ac.id
            </div>
            <div className="demo-item" style={{marginTop: '4px'}}>
              <strong>Password:</strong> (Sesuaikan dengan backend)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
