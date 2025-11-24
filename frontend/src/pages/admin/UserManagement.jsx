// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { adminAPI } from '../../services/api'
import '../../styles/pages/admin/user-management.css'

function UserManagement() {
  const { user } = useAuth()
  const { showToast } = useToast()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, player, admin, banned

  // Load users
  useEffect(() => {
    loadUsers()
  }, [filter])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const roleFilter = filter === 'all' ? null : filter
      const data = await adminAPI.getUsers(1, roleFilter)
      setUsers(data.data || [])
    } catch (error) {
      showToast('Fehler beim Laden der Benutzer', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole)
      showToast('Rolle erfolgreich geändert!', 'success')
      loadUsers()
    } catch (error) {
      showToast('Fehler beim Ändern der Rolle', 'error')
    }
  }

  const handleBan = async (userId) => {
    if (!confirm('Benutzer wirklich sperren?')) return
    
    try {
      await adminAPI.banUser(userId)
      showToast('Benutzer wurde gesperrt', 'success')
      loadUsers()
    } catch (error) {
      showToast(error.message || 'Fehler beim Sperren', 'error')
    }
  }

  const handleUnban = async (userId) => {
    try {
      await adminAPI.unbanUser(userId)
      showToast('Sperrung wurde aufgehoben', 'success')
      loadUsers()
    } catch (error) {
      showToast('Fehler beim Entsperren', 'error')
    }
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
          
          {/* Filter */}
          <div className="user-management__filter">
            {['all', 'player', 'admin', 'banned'].map(f => (
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
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      <div className="user-management__actions">
                        {/* Role ändern */}
                        {u.id !== user?.id && (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="user-management__role-select"
                          >
                            <option value="player">Player</option>
                            <option value="admin">Admin</option>
                            <option value="banned">Banned</option>
                          </select>
                        )}
                        
                        {/* Ban/Unban */}
                        {u.id !== user?.id && (
                          u.role === 'banned' ? (
                            <button
                              onClick={() => handleUnban(u.id)}
                              className="action-btn action-btn--unban"
                            >
                              Entsperren
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBan(u.id)}
                              className="action-btn action-btn--ban"
                            >
                              Sperren
                            </button>
                          )
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
    </div>
  )
}

export default UserManagement
