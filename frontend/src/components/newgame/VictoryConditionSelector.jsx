// src/components/newgame/VictoryConditionSelector.jsx
import React, { useState, useEffect } from 'react';

function VictoryConditionSelector({ onChange, initialValue = 100 }) {
    const [selectedOption, setSelectedOption] = useState('100');
    const [customValue, setCustomValue] = useState('');
    const [calculatedPoints, setCalculatedPoints] = useState(0);

    // Berechne aktuellen Tag (nur Tag, nicht Tag + Monat)
    const getCurrentDay = () => {
        const now = new Date();
        return now.getDate(); // Nur der Tag
    };

    // Berechne Siegbedingung
    const calculateVictoryPoints = () => {
        const day = getCurrentDay();
        let basePoints = 0;

        if (selectedOption === 'individuell') {
            basePoints = parseInt(customValue) || 0;
            // Bei individuell keine Addition von Tag
            return Math.max(100, Math.min(basePoints, 500 + day));
        } else {
            basePoints = parseInt(selectedOption);
            return basePoints + day;
        }
    };

    // Update calculated points when selection changes
    useEffect(() => {
        const points = calculateVictoryPoints();
        setCalculatedPoints(points);
        onChange(points);
    }, [selectedOption, customValue]);

    // Initial setup
    useEffect(() => {
        if (initialValue) {
            const day = getCurrentDay();
            // Finde passende Option oder setze individuell
            const standardOptions = [100, 200, 300, 400, 500];
            const matchingOption = standardOptions.find(opt => opt + day === initialValue);

            if (matchingOption) {
                setSelectedOption(matchingOption.toString());
            } else {
                setSelectedOption('individuell');
                setCustomValue((initialValue).toString());
            }
        }
    }, [initialValue]);

    const handleOptionChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);

        if (value !== 'individuell') {
            setCustomValue('');
        }
    };

    const handleCustomValueChange = (e) => {
        const value = e.target.value;
        // Validierung: nur Zahlen, min 100, max 500 + tag
        const numValue = parseInt(value) || 0;
        const maxAllowed = 500 + getCurrentDay();

        if (numValue >= 100 && numValue <= maxAllowed) {
            setCustomValue(value);
        }
    };

    const day = getCurrentDay();

    return (
        <div className="form-group">
            <label className="form-label" htmlFor="victory-condition">
                🏆 Siegbedingung
            </label>

            <div className="victory-condition-container">
                <select
                    id="victory-condition"
                    className="form-select victory-condition-select"
                    value={selectedOption}
                    onChange={handleOptionChange}
                >
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="individuell">Individuell</option>
                </select>

                <input
                    type="number"
                    className="form-input victory-condition-input"
                    placeholder="Punkte eingeben..."
                    value={customValue}
                    onChange={handleCustomValueChange}
                    disabled={selectedOption !== 'individuell'}
                    min="100"
                    max={500 + dateSum}
                />

                <div className="victory-points-display">
                    <span className="victory-points-label">Benötigte Punkte zum Gewinnen:</span>
                    <span className="victory-points-value">{calculatedPoints}</span>
                </div>
            </div>

            {selectedOption === 'individuell' && (
                <div className="form-help">
                    <small>
                        Min. 100, Max. {500 + day} Punkte (500 + {day} für heute)
                    </small>
                </div>
            )}
        </div>
    );
}

export default VictoryConditionSelector;