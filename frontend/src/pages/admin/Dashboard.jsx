// src/pages/admin/Dashboard.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Overview from './Overview'
import UserManagement from './UserManagement'
import '../../styles/pages/admin/dashboard.css'

function Dashboard() {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <main className="admin-dashboard__content">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="users" element={<UserManagement />} />
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
