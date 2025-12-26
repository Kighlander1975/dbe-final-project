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
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState('')
  const [pendingRoleChange, setPendingRoleChange] = useState(null) // 🆕 Für ausstehende Rollenänderung
  const [emailVerified, setEmailVerified] = useState(user?.email_verified_at ? true : false)

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
      setEmailVerified(foundUser.email_verified_at ? true : false)

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

  const handleRoleSelectChange = (newRole) => {
    setPendingRoleChange(newRole)
  }

  const handleRoleConfirm = async () => {
    if (!pendingRoleChange) return

    startLoading('Rolle wird geändert...')

    try {
      await adminAPI.updateUserRole(user.id, pendingRoleChange)
      showToast('Rolle erfolgreich geändert!', 'success')
      setUser({ ...user, role: pendingRoleChange })
      setPendingRoleChange(null)
    } catch (error) {
      showToast('Fehler beim Ändern der Rolle', 'error')
    } finally {
      stopLoading()
    }
  }

  const handleRoleCancel = () => {
    setPendingRoleChange(null)
  }

  const handleDelete = async () => {
    if (!confirm('Spieler wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!')) return

    startLoading('Spieler wird gelöscht...')

    try {
      await adminAPI.deleteUser(user.id)
      showToast('Spieler wurde gelöscht', 'success')
      // Nach erfolgreichem Löschen zur Benutzerverwaltung weiterleiten
      window.location.href = '/admin/users'
    } catch (error) {
      showToast('Fehler beim Löschen', 'error')
    } finally {
      stopLoading()
    }
  }

  // Name editing handlers
  const handleNameDoubleClick = () => {
    setIsEditingName(true)
    setEditName(user.name)
  }

  const handleNameSubmit = async () => {
    const trimmedName = editName.trim()
    
    if (!trimmedName) {
      showToast('Name darf nicht leer sein', 'error')
      return
    }

    // XSS protection: Basic validation for allowed characters
    const allowedChars = /^[a-zA-Z0-9äöüÄÖÜß!^()<>éøåçñàèìòùâêîôûëïüÿæœÀÈÌÒÙÂÊÎÔÛËÏÜŸÆŒ\s]+$/
    if (!allowedChars.test(trimmedName)) {
      showToast('Name enthält ungültige Zeichen', 'error')
      return
    }

    startLoading('Name wird geändert...')

    try {
      await adminAPI.updateUserName(user.id, trimmedName)
      showToast('Name erfolgreich geändert!', 'success')
      setUser({ ...user, name: trimmedName })
      setIsEditingName(false)
    } catch (error) {
      showToast('Fehler beim Ändern des Namens', 'error')
    } finally {
      stopLoading()
    }
  }

  const handleNameCancel = () => {
    setIsEditingName(false)
    setEditName('')
  }

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit()
    } else if (e.key === 'Escape') {
      handleNameCancel()
    }
  }

  const handleEmailVerifiedSubmit = async () => {
    startLoading('E-Mail-Verifizierung wird aktualisiert...')

    try {
      await adminAPI.updateUserEmailVerifiedAt(user.id, emailVerified)
      showToast('E-Mail-Verifizierung erfolgreich aktualisiert!', 'success')
      setUser({ ...user, email_verified_at: emailVerified ? new Date().toISOString() : null })
      // Seite refreshen
      window.location.reload()
    } catch (error) {
      showToast('Fehler beim Aktualisieren der E-Mail-Verifizierung', 'error')
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
            <div className="user-detail__info-item user-detail__info-item--editable" onDoubleClick={handleNameDoubleClick}>
              <strong>Name:</strong>
              {isEditingName ? (
                <div className="user-detail__name-editor">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={handleNameKeyDown}
                    onBlur={handleNameCancel}
                    className="user-detail__name-input"
                    autoFocus
                  />
                  <button
                    type="button"
                    onMouseDown={handleNameSubmit}
                    className="user-detail__name-submit"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <span
                  className="user-detail__name-display"
                  title="Doppelklick zum Bearbeiten"
                >
                  {user.name}
                </span>
              )}
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
              <table className="user-detail__actions-table">
                <tbody>
                  <tr>
                    <td className="user-detail__action-label">Rolle ändern</td>
                    <td className="user-detail__action-inputs">
                      <select
                        value={pendingRoleChange || user.role}
                        onChange={(e) => handleRoleSelectChange(e.target.value)}
                        className="user-detail__role-select"
                      >
                        <option value="player">Player</option>
                        <option value="host">Host</option>
                        <option value="admin">Admin</option>
                        <option value="banned">Banned</option>
                      </select>
                    </td>
                    <td className="user-detail__action-buttons">
                      <button
                        onClick={handleRoleConfirm}
                        disabled={!pendingRoleChange || pendingRoleChange === user.role}
                        className="action-btn action-btn--confirm"
                        title={(!pendingRoleChange || pendingRoleChange === user.role) ? "Wähle eine andere Rolle aus" : "Rolle ändern bestätigen"}
                      >
                        ✓ Bestätigen
                      </button>
                      
                      {pendingRoleChange && pendingRoleChange !== user.role && (
                        <button
                          onClick={handleRoleCancel}
                          className="action-btn action-btn--cancel"
                          title="Änderung abbrechen"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="user-detail__action-label">E-Mail-Verifizierung</td>
                    <td className="user-detail__action-inputs">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={emailVerified}
                          onChange={(e) => setEmailVerified(e.target.checked)}
                          disabled={user.email_verified_at !== null}
                        />
                        <span className="checkmark"></span>
                        E-Mail als verifiziert markieren
                      </label>
                    </td>
                    <td className="user-detail__action-buttons">
                      <button
                        onClick={handleEmailVerifiedSubmit}
                        className="action-btn action-btn--confirm"
                        disabled={user.email_verified_at !== null}
                      >
                        Speichern
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="user-detail__action-label">Benutzer löschen</td>
                    <td className="user-detail__action-inputs"></td>
                    <td className="user-detail__action-buttons">
                      <button
                        onClick={handleDelete}
                        className="action-btn action-btn--delete"
                      >
                        Spieler löschen
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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