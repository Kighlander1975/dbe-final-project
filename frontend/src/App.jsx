// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layout
import MainLayout from './layouts/MainLayout'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import AdminRoute from './components/AdminRoute' // ⭐ NEU

// Pages - Öffentlich
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'

// Pages - Geschützt
import NewGame from './pages/NewGame'

// Pages - Admin
import Dashboard from './pages/admin/Dashboard'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Öffentlich */}
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* NUR für NICHT angemeldete User */}
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } 
        />
        
        {/* NUR für angemeldete User */}
        <Route 
          path="/new-game" 
          element={
            <ProtectedRoute>
              <NewGame />
            </ProtectedRoute>
          } 
        />
        
        {/* ⭐ NEU: Admin (nur für Admins) */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
