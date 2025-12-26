// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useLoading } from '../../context/LoadingContext' // ✅ NEU
import { useUserContext } from '../../context/UserContext' // 🆕 UserContext
import { adminAPI } from '../../services/api'
import '../../styles/pages/admin/user-management.css'

function UserManagement() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { startLoading, stopLoading } = useLoading() // ✅ NEU
  const { loadUsers, lastLoaded } = useUserContext() // 🆕 UserContext
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [pendingRoleChanges, setPendingRoleChanges] = useState({}) // 🆕 Für ausstehende Rollenänderungen
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'host'
  })

  // Load users
  useEffect(() => {
    loadUsers()
    loadAdminUsers()
  }, [filter])

  // 🆕 Check for user updates (wenn Cache älter als 1 Minute, neu laden)
  useEffect(() => {
    if (lastLoaded && Date.now() - lastLoaded > 60 * 1000) {
      loadUsers(true); // Force reload
    }
  }, [lastLoaded, loadUsers]);

  const loadAdminUsers = async () => {
    setLoading(true)
    
    // ✅ Loading starten
    startLoading('Lade Benutzer...')
    
    try {
      const roleFilter = filter === 'all' ? null : filter
      const data = await adminAPI.getUsers(1, roleFilter)
      setUsers(data.data || [])
    } catch (error) {
      showToast('Fehler beim Laden der Benutzer', 'error')
    } finally {
      setLoading(false)
      stopLoading() // ✅ Loading stoppen
    }
  }

  const handleRoleSelectChange = (userId, newRole) => {
    setPendingRoleChanges(prev => ({
      ...prev,
      [userId]: newRole
    }))
  }

  const handleRoleChangeConfirm = async (userId) => {
    const newRole = pendingRoleChanges[userId]
    if (!newRole) return

    // ✅ Loading starten
    startLoading('Rolle wird geändert...')
    
    try {
      await adminAPI.updateUserRole(userId, newRole)
      showToast('Rolle erfolgreich geändert!', 'success')
      
      // Ausstehende Änderung entfernen
      setPendingRoleChanges(prev => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
      
      // Beide Funktionen aufrufen für vollständige Synchronisation
      loadUsers()
      loadAdminUsers()
    } catch (error) {
      showToast('Fehler beim Ändern der Rolle', 'error')
      stopLoading() // ✅ Bei Fehler stoppen
    }
  }

  const handleRoleChangeCancel = (userId) => {
    setPendingRoleChanges(prev => {
      const updated = { ...prev }
      delete updated[userId]
      return updated
    })
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    
    if (!createForm.name || !createForm.email || !createForm.password) {
      showToast('Bitte fülle alle Felder aus', 'error')
      return
    }

    if (createForm.password.length < 8) {
      showToast('Passwort muss mindestens 8 Zeichen lang sein', 'error')
      return
    }

    startLoading('Neuer Benutzer wird erstellt...')

    try {
      await adminAPI.createUser(createForm)
      showToast('Benutzer erfolgreich erstellt!', 'success')
      setShowCreateModal(false)
      setCreateForm({ name: '', email: '', password: '', role: 'host' })
      loadUsers()
      loadAdminUsers()
    } catch (error) {
      showToast('Fehler beim Erstellen des Benutzers', 'error')
    } finally {
      stopLoading()
    }
  }

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target
    setCreateForm(prev => ({ ...prev, [name]: value }))
  }

  const getRoleBadge = (role) => {
    return (
      <span className={`role-badge role-badge--${role}`}>
        {role}
      </span>
    )
  }

  return (
    <div className="user-management">
      <h1 className="user-management__title">👥 Benutzerverwaltung</h1>
      <p className="user-management__subtitle">
        Verwalte alle registrierten Benutzer
      </p>

      <div className="user-management__card">
        <div className="user-management__header">
          <h2 className="user-management__section-title">Alle Benutzer</h2>
          
          {/* Neuer Benutzer Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary user-management__create-btn"
          >
            + Neuer Benutzer
          </button>
          
          {/* Filter */}
          <div className="user-management__filter">
            {['all', 'player', 'host', 'admin', 'banned'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
              >
                {f === 'all' ? 'Alle' : f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="user-management__loading">Lade Benutzer...</p>
        ) : (
          <div className="user-management__table-wrapper">
            <table className="user-management__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>E-Mail</th>
                  <th>Rolle</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        className="user-management__name-link"
                      >
                        {u.name}
                      </button>
                    </td>
                    <td>{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      <div className="user-management__actions">
                        {/* Role ändern */}
                        {u.id !== user?.id && (
                          <div className="role-change-container">
                            <select
                              value={pendingRoleChanges[u.id] || u.role}
                              onChange={(e) => handleRoleSelectChange(u.id, e.target.value)}
                              className="user-management__role-select"
                            >
                              <option value="player">Player</option>
                              <option value="host">Host</option>
                              <option value="admin">Admin</option>
                              <option value="banned">Banned</option>
                            </select>
                            
                            {/* Bestätigungs-Button immer sichtbar, aber disabled wenn keine Änderung */}
                            <button
                              onClick={() => handleRoleChangeConfirm(u.id)}
                              disabled={!pendingRoleChanges[u.id] || pendingRoleChanges[u.id] === u.role}
                              className="action-btn action-btn--confirm"
                              title={(!pendingRoleChanges[u.id] || pendingRoleChanges[u.id] === u.role) ? "Wähle eine andere Rolle aus" : "Rolle ändern bestätigen"}
                            >
                              ✓ Bestätigen
                            </button>
                            
                            {/* Abbrechen-Button nur wenn Änderung aussteht */}
                            {pendingRoleChanges[u.id] && pendingRoleChanges[u.id] !== u.role && (
                              <button
                                onClick={() => handleRoleChangeCancel(u.id)}
                                className="action-btn action-btn--cancel"
                                title="Änderung abbrechen"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--wide">
            <div className="modal-header">
              <h2>Neuer Benutzer erstellen</h2>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label htmlFor="create-name">Name</label>
                  <input
                    type="text"
                    id="create-name"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateFormChange}
                    placeholder="Benutzername"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="create-email">E-Mail</label>
                  <input
                    type="email"
                    id="create-email"
                    name="email"
                    value={createForm.email}
                    onChange={handleCreateFormChange}
                    placeholder="benutzer@email.de"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="create-password">Passwort</label>
                  <input
                    type="password"
                    id="create-password"
                    name="password"
                    value={createForm.password}
                    onChange={handleCreateFormChange}
                    placeholder="Mindestens 8 Zeichen"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="create-role">Rolle</label>
                  <select
                    id="create-role"
                    name="role"
                    value={createForm.role}
                    onChange={handleCreateFormChange}
                  >
                    <option value="host">Host</option>
                    <option value="player">Player</option>
                    <option value="admin">Admin</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
