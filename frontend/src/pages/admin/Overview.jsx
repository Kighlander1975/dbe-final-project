// src/pages/admin/Overview.jsx
import React from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/pages/admin/overview.css'

function Overview() {
  const { user } = useAuth()

  const getRoleBadge = (role) => {
    return (
      <span className={`role-badge role-badge--${role}`}>
        {role}
      </span>
    )
  }

  return (
    <div className="admin-overview">
      <h1 className="admin-overview__title">📊 Übersicht</h1>
      <p className="admin-overview__subtitle">
        Willkommen im Admin-Bereich, {user?.name}!
      </p>

      {/* User Info */}
      <div className="admin-overview__info-card">
        <h2 className="admin-overview__section-title">👤 Deine Informationen</h2>
        <div className="admin-overview__info-grid">
          <div className="admin-overview__info-item">
            <strong>Name:</strong>
            <span>{user?.name}</span>
          </div>
          <div className="admin-overview__info-item">
            <strong>E-Mail:</strong>
            <span>{user?.email}</span>
          </div>
          <div className="admin-overview__info-item">
            <strong>Rolle:</strong>
            <span>{getRoleBadge(user?.role)}</span>
          </div>
        </div>
      </div>

      {/* Statistiken (Platzhalter) */}
      <div className="admin-overview__stats">
        <div className="admin-overview__stat-card">
          <div className="admin-overview__stat-icon">👥</div>
          <div className="admin-overview__stat-content">
            <h3>Benutzer</h3>
            <p className="admin-overview__stat-value">-</p>
          </div>
        </div>

        <div className="admin-overview__stat-card">
          <div className="admin-overview__stat-icon">🎮</div>
          <div className="admin-overview__stat-content">
            <h3>Aktive Spiele</h3>
            <p className="admin-overview__stat-value">-</p>
          </div>
        </div>

        <div className="admin-overview__stat-card">
          <div className="admin-overview__stat-icon">🏆</div>
          <div className="admin-overview__stat-content">
            <h3>Abgeschlossen</h3>
            <p className="admin-overview__stat-value">-</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
