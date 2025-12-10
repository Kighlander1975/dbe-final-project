// src/components/rounds/RoundData.jsx
import React from 'react';
import './RoundData.css';

function RoundData({ bid, tricks }) {
    return (
        <div className="round-data">
            <div className="r-ans">{bid}</div>
            <div className="r-erg">{tricks}</div>
        </div>
    );
}

export default RoundData;