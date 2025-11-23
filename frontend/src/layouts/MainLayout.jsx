import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import '../styles/layout.css'

function MainLayout() {
  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <nav className="main-layout__nav">
          <Link to="/" className="main-layout__logo">
            🎯 Stechen Helper
          </Link>
          
          <ul className="main-layout__menu">
            <li>
              <Link to="/">🏠 Home</Link>
            </li>
            <li>
              <Link to="/new-game">🎮 Neues Spiel</Link>
            </li>
            <li>
              <Link to="/admin">⚙️ Admin</Link>
            </li>
            <li>
              <Link to="/login">🔐 Login</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-layout__main">
        <Outlet />
      </main>

      <footer className="main-layout__footer">
        <p>© 2024 Stechen Helper - Alle Rechte vorbehalten</p>
      </footer>
    </div>
  )
}

export default MainLayout
