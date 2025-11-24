// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { adminAPI } from '../../services/api'
import '../../styles/pages/admin/dashboard.css'

function Dashboard() {
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
    const styles = {
      admin: { bg: '#fbbf24', color: '#000' },
      player: { bg: '#3b82f6', color: '#fff' },
      banned: { bg: '#ef4444', color: '#fff' },
    }
    
    const style = styles[role] || styles.player
    
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '4px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}>
        {role}
      </span>
    )
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">⚙️ Admin Dashboard</h1>
      <p className="admin-dashboard__subtitle">
        Willkommen, {user?.name}!
      </p>
      
      {/* User Info */}
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
        <p><strong>Rolle:</strong> {getRoleBadge(user?.role)}</p>
      </div>

      {/* User Management */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2>👥 Benutzerverwaltung</h2>
          
          {/* Filter */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'player', 'admin', 'banned'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: filter === f ? '#3b82f6' : '#e5e7eb',
                  color: filter === f ? '#fff' : '#000',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {f === 'all' ? 'Alle' : f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Lade Benutzer...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>E-Mail</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rolle</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.75rem' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>{getRoleBadge(u.role)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {/* Role ändern */}
                      {u.id !== user?.id && (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                          }}
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
                            style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              border: 'none',
                              background: '#10b981',
                              color: '#fff',
                              cursor: 'pointer',
                            }}
                          >
                            Entsperren
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBan(u.id)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              border: 'none',
                              background: '#ef4444',
                              color: '#fff',
                              cursor: 'pointer',
                            }}
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
        )}
      </div>
    </div>
  )
}

export default Dashboard
