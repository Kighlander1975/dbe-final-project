// src/components/rounds/RoundData.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import './RoundData.css';

function RoundData({ bid, tricks, onUpdate, roundIndex, playerIndex, numPlayers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editField, setEditField] = useState(''); // 'bid' or 'tricks'
    const [editValue, setEditValue] = useState('');
    const [initialValue, setInitialValue] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const inputRef = useRef(null);
    const lastToastRef = useRef(0);
    const { showToast } = useToast();

    const maxBid = numPlayers <= 5 ? 9 : 7; // Bis 5 Spieler: 9, ab 6: 7

    const isMobile = () => window.innerWidth < 768;

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
        if (field === 'tricks' && bid === '-') return; // Tricks nicht editierbar, wenn Bid nicht gesetzt
        setEditField(field);
        const value = field === 'bid' ? bid : tricks;
        const displayValue = value === '-' ? '-' : value.toString();
        setEditValue(displayValue);
        setInitialValue(displayValue);
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        const maxValue = editField === 'bid' ? maxBid : (bid !== '-' ? parseInt(bid) : 9);
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
            <div className="r-ans" onDoubleClick={() => handleDoubleClick('bid')}>{bid}</div>
            <div className="r-erg" onDoubleClick={() => handleDoubleClick('tricks')} style={{ cursor: bid === '-' ? 'not-allowed' : 'pointer' }}>{bid === '-' ? '-' : tricks}</div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{editField === 'bid' ? 'Ansage eingeben' : 'Stiche eingeben'}</h3>
                        <input
                            ref={inputRef}
                            type="text"
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