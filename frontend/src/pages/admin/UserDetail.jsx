// src/pages/admin/UserDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useLoading } from '../../context/LoadingContext'
import { adminAPI } from '../../services/api'
import '../../styles/pages/admin/user-detail.css'

function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { showToast } = useToast()
  const { startLoading, stopLoading } = useLoading()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  // Load user details
  useEffect(() => {
    loadUser()
  }, [id])

  const loadUser = async () => {
    setLoading(true)
    startLoading('Lade Benutzer-Details...')

    try {
      // For now, get from users list, later implement single user endpoint
      const usersResponse = await adminAPI.getUsers()
      const foundUser = usersResponse.data.find(u => u.id == id)

      if (!foundUser) {
        throw new Error('Benutzer nicht gefunden')
      }

      setUser(foundUser)

      // Load user stats
      try {
        // TODO: Implement admin endpoint for user stats
        // const statsResponse = await adminAPI.getUserStats(foundUser.id)
        // setStats(statsResponse)
        setStats(null) // Temporarily disabled
      } catch (statsError) {
        console.warn('Could not load user stats:', statsError)
        setStats(null)
      }

    } catch (error) {
      showToast('Fehler beim Laden der Benutzer-Details', 'error')
      navigate('/admin/users')
    } finally {
      setLoading(false)
      stopLoading()
    }
  }

  const handleRoleChange = async (newRole) => {
    startLoading('Rolle wird geändert...')

    try {
      await adminAPI.updateUserRole(user.id, newRole)
      showToast('Rolle erfolgreich geändert!', 'success')
      setUser({ ...user, role: newRole })
    } catch (error) {
      showToast('Fehler beim Ändern der Rolle', 'error')
    } finally {
      stopLoading()
    }
  }

  const handleBan = async () => {
    if (!confirm('Benutzer wirklich sperren?')) return

    startLoading('Benutzer wird gesperrt...')

    try {
      await adminAPI.banUser(user.id)
      showToast('Benutzer wurde gesperrt', 'success')
      setUser({ ...user, role: 'banned' })
    } catch (error) {
      showToast(error.message || 'Fehler beim Sperren', 'error')
    } finally {
      stopLoading()
    }
  }

  const handleUnban = async () => {
    startLoading('Sperrung wird aufgehoben...')

    try {
      await adminAPI.unbanUser(user.id)
      showToast('Sperrung wurde aufgehoben', 'success')
      setUser({ ...user, role: 'player' })
    } catch (error) {
      showToast('Fehler beim Entsperren', 'error')
    } finally {
      stopLoading()
    }
  }

  const getRoleBadge = (role) => {
    return (
      <span className={`role-badge role-badge--${role}`}>
        {role}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="user-detail">
        <div className="user-detail__loading">Lade Benutzer-Details...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="user-detail">
        <div className="user-detail__error">Benutzer nicht gefunden</div>
      </div>
    )
  }

  return (
    <div className="user-detail">
      <div className="user-detail__header">
        <button
          onClick={() => navigate('/admin/users')}
          className="user-detail__back-btn"
        >
          ← Zurück zur Übersicht
        </button>
        <h1 className="user-detail__title">Benutzer-Details</h1>
      </div>

      <div className="user-detail__content">
        {/* Basic Info */}
        <div className="user-detail__card">
          <h2 className="user-detail__section-title">Grunddaten</h2>
          <div className="user-detail__info-grid">
            <div className="user-detail__info-item">
              <strong>ID:</strong>
              <span>{user.id}</span>
            </div>
            <div className="user-detail__info-item">
              <strong>Name:</strong>
              <span>{user.name}</span>
            </div>
            <div className="user-detail__info-item">
              <strong>E-Mail:</strong>
              <span>{user.email}</span>
            </div>
            <div className="user-detail__info-item">
              <strong>Rolle:</strong>
              <span>{getRoleBadge(user.role)}</span>
            </div>
            <div className="user-detail__info-item">
              <strong>Erstellt:</strong>
              <span>{new Date(user.created_at).toLocaleDateString('de-DE')}</span>
            </div>
            <div className="user-detail__info-item">
              <strong>Zuletzt aktualisiert:</strong>
              <span>{new Date(user.updated_at).toLocaleDateString('de-DE')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {user.id !== currentUser?.id && (
          <div className="user-detail__card">
            <h2 className="user-detail__section-title">Aktionen</h2>
            <div className="user-detail__actions">
              <div className="user-detail__action-group">
                <label>Rolle ändern:</label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="user-detail__role-select"
                >
                  <option value="player">Player</option>
                  <option value="host">Host</option>
                  <option value="admin">Admin</option>
                  <option value="banned">Banned</option>
                </select>
              </div>

              <div className="user-detail__action-group">
                {user.role === 'banned' ? (
                  <button
                    onClick={handleUnban}
                    className="action-btn action-btn--unban"
                  >
                    Sperrung aufheben
                  </button>
                ) : (
                  <button
                    onClick={handleBan}
                    className="action-btn action-btn--ban"
                  >
                    Benutzer sperren
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="user-detail__card">
            <h2 className="user-detail__section-title">Statistiken</h2>
            <div className="user-detail__stats">
              <div className="user-detail__stat">
                <span className="user-detail__stat-label">Spiele gespielt:</span>
                <span className="user-detail__stat-value">{stats.totalGames || 0}</span>
              </div>
              <div className="user-detail__stat">
                <span className="user-detail__stat-label">Siege:</span>
                <span className="user-detail__stat-value">{stats.totalWins || 0}</span>
              </div>
              <div className="user-detail__stat">
                <span className="user-detail__stat-label">Gesamtpunkte:</span>
                <span className="user-detail__stat-value">{stats.totalPoints || 0}</span>
              </div>
              <div className="user-detail__stat">
                <span className="user-detail__stat-label">Durchschnittspunkte:</span>
                <span className="user-detail__stat-value">
                  {stats.totalGames > 0 ? (stats.totalPoints / stats.totalGames).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDetail