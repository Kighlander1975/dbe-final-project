// src/components/modals/GameCancelModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { gameAPI } from '../../services/api';
import './GameCancelModal.css';

function GameCancelModal({ isOpen, onClose, gameData, onGameUpdate }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedAction, setSelectedAction] = useState('pause');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    if (selectedAction === 'pause') {
      await handlePause();
    } else if (selectedAction === 'delete') {
      if (!showConfirmDelete) {
        setShowConfirmDelete(true);
        return;
      }
      await handleDelete();
    }
  };

  const handlePause = async () => {
    setIsLoading(true);
    try {
      await gameAPI.pauseGame(gameData.id);

      // Parse game name for toast
      const parts = gameData.gameName.split('_');
      const gameTitle = parts[0];

      showToast(`🎯 Spiel "${gameTitle}" unterbrochen`, 'info', 5000);
      navigate('/');
    } catch (error) {
      console.error('Failed to pause game:', error);
      showToast('❌ Fehler beim Pausieren des Spiels', 'error');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await gameAPI.deleteGame(gameData.id);

      showToast('🗑️ Spiel wurde abgebrochen und gelöscht', 'warning', 5000);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete game:', error);
      showToast('❌ Fehler beim Löschen des Spiels', 'error');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowConfirmDelete(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Spiel beenden</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {!showConfirmDelete ? (
            <>
              <p className="modal-description">
                Was möchten Sie mit dem aktuellen Spiel machen?
              </p>

              <div className="modal-options">
                <label className="modal-option">
                  <input
                    type="radio"
                    name="action"
                    value="pause"
                    checked={selectedAction === 'pause'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="option-title">🎯 Spiel pausieren</div>
                    <div className="option-description">
                      Das Spiel wird unterbrochen und kann später fortgesetzt werden.
                      Alle bisherigen Eingaben bleiben erhalten.
                    </div>
                  </div>
                </label>

                <label className="modal-option">
                  <input
                    type="radio"
                    name="action"
                    value="delete"
                    checked={selectedAction === 'delete'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="option-title">🗑️ Spiel abbrechen</div>
                    <div className="option-description">
                      Das Spiel wird endgültig gelöscht. Alle Daten gehen verloren
                      und fließen nicht in Wertungen ein.
                    </div>
                  </div>
                </label>
              </div>
            </>
          ) : (
            <div className="confirm-delete">
              <div className="warning-icon">⚠️</div>
              <h4 className="confirm-title">Spiel wirklich löschen?</h4>
              <p className="confirm-description">
                Diese Aktion kann nicht rückgängig gemacht werden.
                Das Spiel wird vollständig aus der Datenbank entfernt.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Abbrechen
          </button>
          <button
            className={`btn ${selectedAction === 'delete' ? 'btn-danger' : 'btn-warning'}`}
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Wird ausgeführt...' :
             showConfirmDelete ? '🗑️ Ja, endgültig löschen' :
             selectedAction === 'pause' ? '🎯 Spiel pausieren' :
             '🗑️ Spiel abbrechen'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameCancelModal;