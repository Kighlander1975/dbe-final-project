// src/components/newgame/PlayerCountSelector.jsx
import React, { useState } from "react";

/**
 * Komponente zur Auswahl der Spieleranzahl (2-11)
 * @param {number} initialCount - Startwert (default: 5)
 * @param {function} onChange - Callback-Funktion, die bei Änderung aufgerufen wird
 */
function PlayerCountSelector({ initialCount = 5, onChange }) {
    const [selectedCount, setSelectedCount] = useState(initialCount);

    // Min/Max Spieleranzahl
    const MIN_PLAYERS = 2;
    const MAX_PLAYERS = 11;

    // Berechne Karten pro Spieler nach Spielregeln
    const calculateCardsPerPlayer = (count) => {
        if (count >= 2 && count <= 6) {
            return 9; // 2-6 Spieler: 9 Karten
        } else if (count >= 7 && count <= 11) {
            return 7; // 7-11 Spieler: 7 Karten
        }
        return 0; // Fallback
    };

    // Handler für Button-Klick
    const handleSelect = (count) => {
        setSelectedCount(count);
        
        // Callback an Parent-Komponente
        if (onChange) {
            onChange(count);
        }
    };

    // Generiere Buttons für 2-11 Spieler
    const playerButtons = [];
    for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) {
        playerButtons.push(
            <button
                key={i}
                type="button"
                className={`player-btn ${selectedCount === i ? "player-btn--active" : ""}`}
                onClick={() => handleSelect(i)}
            >
                {i}
            </button>
        );
    }

    return (
        <div className="form-group">
            <label className="form-label">Anzahl Spieler</label>
            
            {/* Button-Grid */}
            <div className="player-count-buttons">
                {playerButtons}
            </div>
            
            {/* Info-Hinweis */}
            <p className="form-hint form-hint--info">
                ⚠️ {selectedCount} Spieler ausgewählt → {calculateCardsPerPlayer(selectedCount)} Karten pro Spieler
            </p>
        </div>
    );
}

export default PlayerCountSelector;
