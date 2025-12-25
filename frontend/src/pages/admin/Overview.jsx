// src/pages/admin/Overview.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { statsAPI, publicAPI } from '../../services/api'
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

  const [countUpDuration, setCountUpDuration] = useState(2000) // Default 2 seconds
  const [durationLoaded, setDurationLoaded] = useState(false)

  // Load stats on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await statsAPI.getAdminStats()
        setStats(response)
        // Start animation after loading
        // animateCounters(response) // Remove this
      } catch (error) {
        console.error('Failed to load admin stats:', error)
      }
    }

    const loadDuration = async () => {
      try {
        const response = await publicAPI.getCountUpDuration()
        setCountUpDuration(parseFloat(response.setting.value) * 1000) // Convert to milliseconds
        setDurationLoaded(true)
      } catch (error) {
        console.error('Failed to load count-up duration:', error)
        setCountUpDuration(2000) // Fallback
        setDurationLoaded(true)
      }
    }

    loadStats()
    loadDuration()
  }, [])

  useEffect(() => {
    if (stats && durationLoaded) {
      animateCounters(stats)
    }
  }, [stats, durationLoaded])

  // Animate counters from 0 to target value
  const animateCounters = (targetStats) => {
    const duration = countUpDuration
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
