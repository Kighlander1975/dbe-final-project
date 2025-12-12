// src/components/modals/GameCancelModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { gameAPI } from '../../services/api';
import './GameCancelModal.css';

function GameCancelModal({ isOpen, onClose, gameData, onGameUpdate }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

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
          <h3 className="modal-title">Spiel abbrechen</h3>
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
                Möchten Sie das aktuelle Spiel wirklich abbrechen?
              </p>

              <div className="modal-options">
                <div className="modal-option">
                  <div className="option-content">
                    <div className="option-title">🗑️ Spiel abbrechen und löschen</div>
                    <div className="option-description">
                      Das Spiel wird endgültig gelöscht. Alle Daten gehen verloren
                      und fließen nicht in Wertungen ein.
                    </div>
                  </div>
                </div>
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
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Wird gelöscht...' :
             showConfirmDelete ? '🗑️ Ja, endgültig löschen' :
             '🗑️ Spiel abbrechen'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameCancelModal;