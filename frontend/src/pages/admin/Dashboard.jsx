// src/pages/admin/Dashboard.jsx
import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserContext } from '../../context/UserContext' // 🆕 UserContext
import AdminSidebar from '../../components/admin/AdminSidebar'
import Overview from './Overview'
import UserManagement from './UserManagement'
import UserDetail from './UserDetail'
import TestEmail from './TestEmail'
import '../../styles/pages/admin/dashboard.css'

function Dashboard() {
  const { loadUsers } = useUserContext() // 🆕 UserContext

  // 🆕 User-Liste beim Mount neu laden
  useEffect(() => {
    loadUsers(true); // force = true, um Cache zu überschreiben
  }, [loadUsers]);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <main className="admin-dashboard__content">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="test-email" element={<TestEmail />} />
          {/* 🔧 Weitere Routen hier hinzufügen */}
          {/* <Route path="settings" element={<Settings />} /> */}
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default Dashboard
