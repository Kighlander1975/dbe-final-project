// src/pages/NewGame.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext' // ⭐ NEU
import '../styles/pages/forms.css'

function NewGame() {
  const { user } = useAuth()
  const { showToast } = useToast() // ⭐ NEU
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: API-Call zum Erstellen des Spiels
    // Simuliere API-Call
    setTimeout(() => {
      showToast('🎮 Spiel erfolgreich erstellt!', 'success', 6000) // Dauer hinzugefügt
      setLoading(false)
      // navigate('/game/123') // Später zur Spielseite
    }, 1000)
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="newgame">
      <div className="newgame__container">
        <h1 className="newgame__title">🎮 Neues Spiel</h1>
        <p className="newgame__subtitle">
          Starte eine neue Runde, {user?.name}!
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="gameName">Spielname</label>
            <input 
              type="text" 
              id="gameName" 
              placeholder="Mein Spiel"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="players">Anzahl Spieler</label>
            <input 
              type="number" 
              id="players" 
              min="2" 
              max="6" 
              defaultValue="4"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Erstelle Spiel...' : 'Spiel starten'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewGame