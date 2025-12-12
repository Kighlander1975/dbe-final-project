// src/components/rounds/RoundData.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import './RoundData.css';

function RoundData({ bid, tricks, onUpdate, roundIndex, playerIndex, numPlayers, roundNumber, roundPhase, currentRound, validateTricksInput, maxCards, isEvaluated, isColorEvaluated, isCorrectBid, isGameFinished, playerName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editField, setEditField] = useState(''); // 'bid' or 'tricks'
    const [editValue, setEditValue] = useState('');
    const [initialValue, setInitialValue] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const inputRef = useRef(null);
    const lastToastRef = useRef(0);
    const { showToast } = useToast();

    const maxBid = numPlayers <= 6 ? 9 : 7; // 2-6 Spieler: 9 Karten, 7-11 Spieler: 7 Karten

    const isMobile = () => window.innerWidth < 768;

    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (!isModalOpen) {
            lastToastRef.current = 0; // Reset Spam-Schutz beim Schließen des Modals
        }
    }, [isModalOpen]);

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

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        let maxValue = editField === 'bid' ? maxBid : maxCards;

        if (editField === 'tricks') {
            // Für Tricks: Prüfe die Summe aller Tricks in der Runde
            if (/^\d+$/.test(newValue)) {
                const numValue = parseInt(newValue);
                if (numValue >= 0 && validateTricksInput(roundIndex, playerIndex, numValue)) {
                    // Gültige Zahl: Animation und schließen
                    if (inputRef.current) {
                        inputRef.current.style.backgroundColor = '#d4edda'; // Grün
                        setTimeout(() => {
                            onUpdate(roundIndex, playerIndex, editField, numValue);
                            setIsModalOpen(false);
                        }, 300); // Kürzerer Delay
                    }
                    return;
                }
            }
        } else {
            // Für Bids: Normale Validierung
            if (/^\d+$/.test(newValue)) {
                const numValue = parseInt(newValue);
                if (numValue >= 0 && numValue <= maxValue) {
                    // Gültige Zahl: Animation und schließen
                    if (inputRef.current) {
                        inputRef.current.style.backgroundColor = '#d4edda'; // Grün
                        setTimeout(() => {
                            onUpdate(roundIndex, playerIndex, editField, numValue);
                            setIsModalOpen(false);
                        }, 300); // Kürzerer Delay
                    }
                    return;
                }
            }
        }

        // Ungültig: Vibration und Reset
        setIsInvalid(true);
        setTimeout(() => setIsInvalid(false), 500);
        if (inputRef.current) {
            inputRef.current.value = initialValue;
            inputRef.current.select();
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
                        <input
                            ref={inputRef}
                            type={isTouchDevice() ? 'number' : 'text'}
                            defaultValue={editValue}
                            onInput={handleInputChange}
                            className={isInvalid ? 'invalid' : ''}
                            style={{ fontSize: '4rem', textAlign: 'center', width: '100%', padding: '1rem' }}
                        />
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