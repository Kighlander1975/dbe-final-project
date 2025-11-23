// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layout
import MainLayout from './layouts/MainLayout'

// Pages - Öffentlich
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewGame from './pages/NewGame'

// Pages - Admin
import Dashboard from './pages/admin/Dashboard'

function App() {
  return (
    <Routes>
      {/* Alle Routen mit MainLayout */}
      <Route element={<MainLayout />}>
        {/* Öffentlich */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Vorerst öffentlich (später geschützt) */}
        <Route path="/new-game" element={<NewGame />} />
        
        {/* Admin - Vorerst öffentlich (später geschützt) */}
        <Route path="/admin" element={<Dashboard />} />
        {/* <Route path="/admin/users" element={<UserManagement />} /> */}
        {/* <Route path="/admin/games" element={<GameManagement />} /> */}
        {/* <Route path="/admin/settings" element={<Settings />} /> */}
        
        {/* Spielleiter - Auskommentiert bis zur Implementierung */}
        {/* <Route path="/game-master" element={<GameMasterDashboard />} /> */}
        {/* <Route path="/game-master/new" element={<NewGame />} /> */}
        {/* <Route path="/game-master/game/:id" element={<GameField />} /> */}
        {/* <Route path="/game-master/game/:id/end" element={<GameEnd />} /> */}
        
        {/* Statistiken - Auskommentiert bis zur Implementierung */}
        {/* <Route path="/stats" element={<Stats />} /> */}
        {/* <Route path="/stats/global" element={<GlobalRankings />} /> */}
        {/* <Route path="/stats/player/:id" element={<PlayerStats />} /> */}
        
        {/* Fehlerseiten - Auskommentiert bis zur Implementierung */}
        {/* <Route path="/404" element={<NotFound />} /> */}
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        
        {/* Fallback - Umleitung zur Startseite */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
