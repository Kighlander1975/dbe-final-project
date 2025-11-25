// src/components/newgame/GameNameInput.jsx
import React, { useState, useEffect } from 'react';

function GameNameInput({ value, onChange, required = true, initialFullName = '' }) { // ✅ initialFullName hinzugefügt
  const [suffix, setSuffix] = useState('');
  const [inputValue, setInputValue] = useState(value || ''); // ✅ Lokaler State für Input

  // ✅ Generiere Suffix beim Mount ODER extrahiere aus initialFullName
  useEffect(() => {
    if (initialFullName) {
      // Fall 1: Zurück von Summary → Suffix aus vollständigem Namen extrahieren
      const match = initialFullName.match(/(_\d+_[a-f0-9]{8})$/);
      if (match) {
        const extractedSuffix = match[1];
        const extractedInput = initialFullName.replace(extractedSuffix, '');
        
        setSuffix(extractedSuffix);
        setInputValue(extractedInput);
        
        // ✅ Sofort Callback aufrufen mit wiederhergestellten Daten
        if (onChange) {
          onChange(initialFullName, extractedInput);
        }
        
        console.log('🔄 Wiederhergestellt:', { extractedInput, extractedSuffix });
      }
    } else {
      // Fall 2: Neues Spiel → Suffix generieren
      const timestamp = Math.floor(Date.now() / 1000);
      const uuid = generateShortUUID();
      const newSuffix = `_${timestamp}_${uuid}`;
      setSuffix(newSuffix);
      
      console.log('✨ Neuer Suffix:', newSuffix);
    }
  }, [initialFullName]); // ✅ Nur bei initialFullName-Änderung

  // Generiere kurze UUID (8 Zeichen, hex)
  const generateShortUUID = () => {
    return Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  };

  // Handler für Input-Änderung
  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
    
    // Kombiniere Input + Suffix
    const fullGameName = newInputValue + suffix;
    
    // Callback an Parent
    if (onChange) {
      onChange(fullGameName, newInputValue);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="gameName" className="form-label">
        Spielname
      </label>
      <div className="gamename-wrapper">
        <input
          type="text"
          id="gameName"
          className="form-input form-input--gamename"
          placeholder="Mein Spiel"
          value={inputValue} // ✅ Kontrollierter Input
          onChange={handleInputChange}
          required={required}
        />
        <span className="gamename-suffix">
          {suffix || '_generiere...'}
        </span>
      </div>
      <p className="form-hint">
        💡 Der Suffix wird automatisch generiert
      </p>
    </div>
  );
}

export default GameNameInput;
