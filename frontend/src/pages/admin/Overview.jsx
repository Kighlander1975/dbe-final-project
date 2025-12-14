// src/pages/admin/Overview.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { statsAPI } from '../../services/api'
import '../../styles/pages/admin/overview.css'

function Overview() {
  const { user } = useAuth()

  const [stats, setStats] = useState({
    users: 0,
    active_games: 0,
    paused_games: 0,
    finished_games: 0,
  })

  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    active_games: 0,
    paused_games: 0,
    finished_games: 0,
  })

  // Load stats on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await statsAPI.getAdminStats()
        setStats(response)
        // Start animation after loading
        animateCounters(response)
      } catch (error) {
        console.error('Failed to load admin stats:', error)
      }
    }
    loadStats()
  }, [])

  // Animate counters from 0 to target value in 2 seconds
  const animateCounters = (targetStats) => {
    const duration = 2000 // 2 seconds
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      setAnimatedStats({
        users: Math.floor(targetStats.users * progress),
        active_games: Math.floor(targetStats.active_games * progress),
        paused_games: Math.floor(targetStats.paused_games * progress),
        finished_games: Math.floor(targetStats.finished_games * progress),
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Ensure final values are exact
        setAnimatedStats(targetStats)
      }
    }

    requestAnimationFrame(animate)
  }

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
            <p className="admin-overview__stat-value">{animatedStats.users}</p>
          </div>
        </div>

        <div className="admin-overview__stat-card">
          <div className="admin-overview__stat-icon">🎮</div>
          <div className="admin-overview__stat-content">
            <h3>Aktive Spiele</h3>
            <p className="admin-overview__stat-value">{animatedStats.active_games}</p>
          </div>
        </div>

        <div className="admin-overview__stat-card">
          <div className="admin-overview__stat-icon">⏸️</div>
          <div className="admin-overview__stat-content">
            <h3>Pausierte Spiele</h3>
            <p className="admin-overview__stat-value">{animatedStats.paused_games}</p>
          </div>
        </div>

        <div className="admin-overview__stat-card">
          <div className="admin-overview__stat-icon">🏆</div>
          <div className="admin-overview__stat-content">
            <h3>Abgeschlossen</h3>
            <p className="admin-overview__stat-value">{animatedStats.finished_games}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
