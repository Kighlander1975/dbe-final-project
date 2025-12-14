// src/components/rounds/RoundData.jsx
import React, { useState } from 'react';
import './RoundData.css';

function RoundData({ bid, tricks, onUpdate, roundIndex, playerIndex, numPlayers, roundNumber, roundPhase, currentRound, validateTricksInput, maxCards, isEvaluated, isColorEvaluated, isCorrectBid, isGameFinished, playerName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editField, setEditField] = useState(''); // 'bid' or 'tricks'
    const [editValue, setEditValue] = useState('');
    const [initialValue, setInitialValue] = useState('');

    const maxBid = numPlayers <= 6 ? 9 : 7; // 2-6 Spieler: 9 Karten, 7-11 Spieler: 7 Karten

    const handleDoubleClick = (field) => {
        if (isGameFinished) return; // Spiel beendet - keine Bearbeitung möglich

        // Phase 0: Nur Bids editierbar
        if (roundPhase === 0 && field !== 'bid') return;
        // Phase 1: Nur Tricks editierbar
        if (roundPhase === 1 && field !== 'tricks') return;
        // Tricks nicht editierbar, wenn Bid nicht gesetzt (aber in Phase 1 sollte Bid immer gesetzt sein)
        if (field === 'tricks' && bid === '-') return;

        setEditField(field);
        const value = field === 'bid' ? bid : tricks;
        const displayValue = value === '-' ? '-' : value.toString();
        setEditValue(displayValue);
        setInitialValue(displayValue);
        setIsModalOpen(true);
    };

    const handleNumberClick = async (value) => {
        let maxValue = editField === 'bid' ? maxBid : maxCards;

        // Validierung
        let isValid = false;
        if (editField === 'tricks') {
            isValid = value >= 0 && validateTricksInput(roundIndex, playerIndex, value);
        } else {
            isValid = value >= 0 && value <= maxValue;
        }

        if (isValid) {
            // Visuelles Feedback: Button vibrieren lassen
            const button = document.querySelector(`[data-value="${value}"]`);
            if (button) {
                button.style.transform = 'scale(0.95)';
                button.style.backgroundColor = '#d4edda';
                setTimeout(() => {
                    button.style.transform = '';
                    button.style.backgroundColor = '';
                }, 150);
            }

            // Wert aktualisieren und Modal schließen
            onUpdate(roundIndex, playerIndex, editField, value);
            setIsModalOpen(false);
        } else {
            // Ungültiger Wert: Button rot aufleuchten
            const button = document.querySelector(`[data-value="${value}"]`);
            if (button) {
                button.style.backgroundColor = '#f8d7da';
                setTimeout(() => {
                    button.style.backgroundColor = '';
                }, 300);
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="round-data">
            <div
                className="r-ans"
                onDoubleClick={() => handleDoubleClick('bid')}
                style={{
                    fontSize: (isEvaluated || roundPhase >= 1) ? '1.8rem' : '1rem',
                    cursor: isGameFinished ? 'default' : (roundPhase === 0 ? 'pointer' : 'not-allowed'),
                    opacity: roundPhase === 0 && !isGameFinished ? 1 : 0.7,
                    backgroundColor: isColorEvaluated ? (isCorrectBid ? '#fff3cd' : '#f8d7da') : undefined
                }}
            >
                {bid}
            </div>
            <div
                className="r-erg"
                onDoubleClick={() => handleDoubleClick('tricks')}
                style={{
                    fontSize: isEvaluated ? '1.8rem' : '1rem',
                    cursor: isGameFinished ? 'default' : (roundPhase === 1 && bid !== '-' ? 'pointer' : 'not-allowed'),
                    opacity: (roundPhase === 1 && bid !== '-' && !isGameFinished) ? 1 : 0.7,
                    backgroundColor: isColorEvaluated ? (isCorrectBid ? '#fff3cd' : '#f8d7da') : undefined
                }}
            >
                {bid === '-' ? '-' : tricks}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>
                            {editField === 'bid' ? 'Ansage eingeben für:' : 'Stiche eingeben für:'}
                            <br />
                            {playerName}
                        </h3>

                        {/* Nummerisches Tastenfeld */}
                        <div className="number-pad">
                            <div className="number-pad__row">
                                <button
                                    className={`number-pad__button ${editValue === '1' ? 'number-pad__button--highlighted' : ''}`}
                                    data-value="1"
                                    onClick={() => handleNumberClick(1)}
                                >
                                    1
                                </button>
                                <button
                                    className={`number-pad__button ${editValue === '2' ? 'number-pad__button--highlighted' : ''}`}
                                    data-value="2"
                                    onClick={() => handleNumberClick(2)}
                                >
                                    2
                                </button>
                                <button
                                    className={`number-pad__button ${editValue === '3' ? 'number-pad__button--highlighted' : ''}`}
                                    data-value="3"
                                    onClick={() => handleNumberClick(3)}
                                >
                                    3
                                </button>
                            </div>
                            <div className="number-pad__row">
                                <button
                                    className={`number-pad__button ${editValue === '4' ? 'number-pad__button--highlighted' : ''}`}
                                    data-value="4"
                                    onClick={() => handleNumberClick(4)}
                                >
                                    4
                                </button>
                                <button
                                    className={`number-pad__button ${editValue === '5' ? 'number-pad__button--highlighted' : ''}`}
                                    data-value="5"
                                    onClick={() => handleNumberClick(5)}
                                >
                                    5
                                </button>
                                <button
                                    className={`number-pad__button ${editValue === '6' ? 'number-pad__button--highlighted' : ''}`}
                                    data-value="6"
                                    onClick={() => handleNumberClick(6)}
                                >
                                    6
                                </button>
                            </div>
                            <div className="number-pad__row">
                                <button
                                    className={`number-pad__button ${editValue === '7' ? 'number-pad__button--highlighted' : ''}`}
                                    data-value="7"
                                    onClick={() => handleNumberClick(7)}
                                >
                                    7
                                </button>
                                <button
                                    className={`number-pad__button ${editValue === '8' ? 'number-pad__button--highlighted' : ''} ${maxBid < 8 ? 'number-pad__button--disabled' : ''}`}
                                    data-value="8"
                                    onClick={() => handleNumberClick(8)}
                                    disabled={maxBid < 8}
                                >
                                    8
                                </button>
                                <button
                                    className={`number-pad__button ${editValue === '9' ? 'number-pad__button--highlighted' : ''} ${maxBid < 9 ? 'number-pad__button--disabled' : ''}`}
                                    data-value="9"
                                    onClick={() => handleNumberClick(9)}
                                    disabled={maxBid < 9}
                                >
                                    9
                                </button>
                            </div>
                            <div className="number-pad__row">
                                <button
                                    className={`number-pad__button number-pad__button--zero ${editValue === '0' ? 'number-pad__button--highlighted' : ''}`}
                                    data-value="0"
                                    onClick={() => handleNumberClick(0)}
                                >
                                    0
                                </button>
                            </div>
                        </div>

                        <div className="modal-buttons">
                            <button onClick={handleCancel}>Abbrechen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoundData;