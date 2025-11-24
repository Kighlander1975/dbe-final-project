// src/components/admin/AdminSidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/components/admin-sidebar.css'

function AdminSidebar() {
  const menuItems = [
    {
      path: '/admin',
      icon: '📊',
      label: 'Übersicht',
      exact: true
    },
    {
      path: '/admin/users',
      icon: '👥',
      label: 'Benutzerverwaltung'
    },
    // 🔧 Hier können weitere Menüpunkte hinzugefügt werden
    // {
    //   path: '/admin/settings',
    //   icon: '⚙️',
    //   label: 'Einstellungen'
    // },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2 className="admin-sidebar__title">⚙️ Admin</h2>
      </div>
      
      <nav className="admin-sidebar__nav">
        <ul className="admin-sidebar__menu">
          {menuItems.map((item) => (
            <li key={item.path} className="admin-sidebar__menu-item">
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                }
              >
                <span className="admin-sidebar__icon">{item.icon}</span>
                <span className="admin-sidebar__label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default AdminSidebar
