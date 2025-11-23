import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages/home.css'

function Home() {
  return (
    <div className="home">
      <h1 className="home__title">🏠 Startseite</h1>
      <p className="home__subtitle">Willkommen beim Stechen Helper!</p>
      
      <nav className="home__nav">
        <ul className="home__menu">
          <li>
            <Link to="/">🏠 Startseite</Link>
          </li>
          <li>
            <Link to="/login">🔐 Login</Link>
          </li>
          <li>
            <Link to="/register">📝 Registrierung</Link>
          </li>
          <li>
            <Link to="/new-game">🎮 Neues Spiel</Link>
          </li>
          <li>
            <Link to="/admin">⚙️ Admin Dashboard</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Home
