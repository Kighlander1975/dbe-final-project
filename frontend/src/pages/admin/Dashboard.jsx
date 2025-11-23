// src/pages/admin/Dashboard.jsx
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/pages/admin/dashboard.css'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">⚙️ Admin Dashboard</h1>
      <p className="admin-dashboard__subtitle">
        Willkommen im Admin-Bereich, {user?.name}!
      </p>
      
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>👤 Deine Informationen</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>E-Mail:</strong> {user?.email}</p>
        <p><strong>ID:</strong> {user?.id}</p>
      </div>
    </div>
  )
}

export default Dashboard
