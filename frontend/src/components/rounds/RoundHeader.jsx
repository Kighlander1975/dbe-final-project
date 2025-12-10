// src/components/rounds/RoundHeader.jsx
import React from 'react';
import './RoundHeader.css';

function RoundHeader({ roundNumber }) {
    return (
        <div className="round-header">
            <div className="h-heading">Runde {roundNumber}</div>
            <div className="h-ans">Ans.</div>
            <div className="h-erg">Erg.</div>
        </div>
    );
}

export default RoundHeader;