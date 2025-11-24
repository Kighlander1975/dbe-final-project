// src/components/newgame/PlayerInput.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";

function PlayerInput({
    playerNumber,
    currentUser = null,
    availableEmails = [],
    usedEmails = [],
    usedGuestNames = [],
    allPlayerNames = [],
    onPlayerChange,
    isCurrentUser = false,
    existingData = null, // Neu: Existierende Daten für Persistenz
}) {
    // State
    const [primaryValue, setPrimaryValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [showNameField, setShowNameField] = useState(false);
    const [badge, setBadge] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [nameWarning, setNameWarning] = useState(null);
    
    // Ref für die Initialisierung, um zu verfolgen, ob die Komponente bereits initialisiert wurde
    const isInitialized = useRef(false);

    // ✅ useRef für onPlayerChange (verhindert Loop)
    const onPlayerChangeRef = useRef(onPlayerChange);
    useEffect(() => {
        onPlayerChangeRef.current = onPlayerChange;
    }, [onPlayerChange]);

    // ✅ useCallback für Validierungs-Funktionen
    const isValidEmail = useCallback((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }, []);

    const validateEmailDuplicate = useCallback((email) => {
        if (usedEmails.includes(email)) {
            setEmailError("Diese E-Mail wird bereits verwendet!");
            setShowNameField(false);
            setNameValue("");
            setBadge(null);
            return true;
        }
        setEmailError(null);
        return false;
    }, [usedEmails]);

    const validateGuestNameDuplicate = useCallback((name) => {
        if (usedGuestNames.includes(name.toLowerCase())) {
            setNameError("Dieser Name wird bereits verwendet!");
            return true;
        }
        setNameError(null);
        return false;
    }, [usedGuestNames]);

    const validateNameOverlap = useCallback((guestName) => {
        if (allPlayerNames.includes(guestName.toLowerCase())) {
            setNameWarning(
                'Ein anderer Spieler heißt ebenfalls "' + guestName + '". Tipp: Verwende einen Nicknamen (z.B. "' + guestName + ' 2"), um Verwechslungen zu vermeiden.'
            );
            return true;
        }
        setNameWarning(null);
        return false;
    }, [allPlayerNames]);

    const validateNameRequired = useCallback((type, name) => {
        if (type === "new" && !name.trim()) {
            setNameError("Name ist erforderlich!");
            return true;
        }
        setNameError(null);
        return false;
    }, []);

    // Initialisierung der Komponente mit existierenden Daten oder für den aktuellen Benutzer
    useEffect(() => {
        // Verhindere mehrfache Initialisierung
        if (isInitialized.current) return;
        
        let initialPrimaryValue = "";
        let initialNameValue = "";
        let initialShowNameField = false;
        let initialBadge = null;
        let initialType = "guest";
        let hasError = false;
        
        // Fall 1: Es handelt sich um den aktuellen Benutzer (Spieler 1)
        if (isCurrentUser && currentUser) {
            initialPrimaryValue = currentUser.email || "";
            initialNameValue = currentUser.name || "";
            initialShowNameField = true;
            initialBadge = { type: "current", label: "🔒 Du" };
            initialType = "current";
        }
        // Fall 2: Es gibt existierende Daten für diesen Spieler
        else if (existingData) {
            if (existingData.email) {
                // Es ist ein registrierter Benutzer oder neuer E-Mail-Benutzer
                initialPrimaryValue = existingData.email;
                initialNameValue = existingData.name || "";
                initialShowNameField = true;
                
                // Prüfen, ob es ein registrierter Benutzer ist
                const userInDb = availableEmails.find(
                    (item) => item.email === existingData.email
                );
                
                if (userInDb) {
                    initialBadge = { type: "registered", label: "✅ Registriert" };
                    initialType = "registered";
                } else {
                    initialBadge = { type: "new", label: "⚠️ Neu" };
                    initialType = "new";
                    hasError = !initialNameValue.trim();
                }
            } else if (existingData.name) {
                // Es ist ein Gast
                initialPrimaryValue = existingData.name;
                initialNameValue = "";
                initialShowNameField = false;
                initialBadge = { type: "guest", label: "👤 Gast" };
                initialType = "guest";
            }
        }
        
        // State setzen
        setPrimaryValue(initialPrimaryValue);
        setNameValue(initialNameValue);
        setShowNameField(initialShowNameField);
        setBadge(initialBadge);
        
        // Callback aufrufen, wenn Daten vorhanden sind
        if ((isCurrentUser && currentUser) || existingData) {
            if (onPlayerChangeRef.current) {
                onPlayerChangeRef.current({
                    playerNumber,
                    email: initialType !== "guest" ? initialPrimaryValue : null,
                    name: initialType !== "guest" ? initialNameValue : initialPrimaryValue,
                    type: initialType,
                    hasError: hasError,
                });
            }
        }
        
        // Markiere als initialisiert
        isInitialized.current = true;
    }, [isCurrentUser, currentUser, existingData, playerNumber, availableEmails]);

    // ✅ Reaktive Validierung: E-Mail-Duplikate
    useEffect(() => {
        if (!isCurrentUser && primaryValue && isValidEmail(primaryValue)) {
            validateEmailDuplicate(primaryValue);
        }
    }, [usedEmails, isCurrentUser, primaryValue, isValidEmail, validateEmailDuplicate]);

    // ✅ Reaktive Validierung: Gast-Name-Duplikate
    useEffect(() => {
        if (!isCurrentUser && primaryValue && !isValidEmail(primaryValue)) {
            if (primaryValue.length >= 2) {
                validateGuestNameDuplicate(primaryValue);
            }
        }
    }, [usedGuestNames, isCurrentUser, primaryValue, isValidEmail, validateGuestNameDuplicate]);

    // ✅ Reaktive Validierung: Name-Overlap
    useEffect(() => {
        if (!isCurrentUser && primaryValue && !isValidEmail(primaryValue)) {
            if (primaryValue.length >= 2) {
                validateNameOverlap(primaryValue);
            }
        }
    }, [allPlayerNames, isCurrentUser, primaryValue, isValidEmail, validateNameOverlap]);

    // Handler für Primary-Input
    const handlePrimaryChange = (e) => {
        const value = e.target.value;
        setPrimaryValue(value);

        if (isCurrentUser) return;

        // Reset
        setEmailError(null);
        setNameError(null);
        setNameWarning(null);

        let newBadge = null;
        let newShowNameField = false;
        let newNameValue = nameValue;
        let newType = "guest";
        let hasError = false;

        if (!value) {
            newShowNameField = false;
            newNameValue = "";
            newBadge = null;
        } else if (isValidEmail(value)) {
            if (usedEmails.includes(value)) {
                setEmailError("Diese E-Mail wird bereits verwendet!");
                newShowNameField = false;
                newNameValue = "";
                newBadge = null;
                hasError = true;
            } else {
                const userInDb = availableEmails.find(
                    (item) => item.email === value
                );

                if (userInDb) {
                    newNameValue = userInDb.name || "";
                    newShowNameField = true;
                    newBadge = { type: "registered", label: "✅ Registriert" };
                    newType = "registered";
                } else {
                    newNameValue = "";
                    newShowNameField = true;
                    newBadge = { type: "new", label: "⚠️ Neu" };
                    newType = "new";
                    hasError = validateNameRequired(newType, newNameValue);
                }
            }
        } else {
            newShowNameField = false;
            newNameValue = "";
            newBadge = { type: "guest", label: "👤 Gast" };
            newType = "guest";
        }

        setShowNameField(newShowNameField);
        setNameValue(newNameValue);
        setBadge(newBadge);

        // ✅ useRef statt direktem Aufruf
        if (onPlayerChangeRef.current) {
            onPlayerChangeRef.current({
                playerNumber,
                email: isValidEmail(value) ? value : null,
                name: isValidEmail(value) ? newNameValue : value,
                type: newType,
                hasError: hasError,
            });
        }
    };

    // Handler für onBlur
    const handlePrimaryBlur = () => {
        if (isCurrentUser || !primaryValue) return;

        let hasError = false;

        if (isValidEmail(primaryValue)) {
            hasError = validateEmailDuplicate(primaryValue);
            
            if (badge?.type === "new") {
                const nameRequired = validateNameRequired(badge.type, nameValue);
                hasError = hasError || nameRequired;
            }
        } else {
            const isDuplicate = validateGuestNameDuplicate(primaryValue);
            validateNameOverlap(primaryValue);
            hasError = isDuplicate;
        }

        // ✅ useRef statt direktem Aufruf
        if (onPlayerChangeRef.current) {
            onPlayerChangeRef.current({
                playerNumber,
                email: isValidEmail(primaryValue) ? primaryValue : null,
                name: isValidEmail(primaryValue) ? nameValue : primaryValue,
                type: badge?.type || "guest",
                hasError: hasError || emailError !== null || nameError !== null,
            });
        }
    };

    // Handler für Name-Input
    const handleNameChange = (e) => {
        const value = e.target.value;
        setNameValue(value);

        let hasError = false;
        if (badge?.type === "new") {
            hasError = validateNameRequired(badge.type, value);
        }

        // ✅ useRef statt direktem Aufruf
        if (onPlayerChangeRef.current) {
            onPlayerChangeRef.current({
                playerNumber,
                email: primaryValue,
                name: value,
                type: badge?.type || "guest",
                hasError: hasError || emailError !== null,
            });
        }
    };

    // Handler für Name-Blur
    const handleNameBlur = () => {
        if (badge?.type === "new") {
            const hasError = validateNameRequired(badge.type, nameValue);
            
            // ✅ useRef statt direktem Aufruf
            if (onPlayerChangeRef.current) {
                onPlayerChangeRef.current({
                    playerNumber,
                    email: primaryValue,
                    name: nameValue,
                    type: badge.type,
                    hasError: hasError || emailError !== null,
                });
            }
        }
    };

    // Badge-Styling
    const getBadgeClass = () => {
        if (!badge) return "player-badge player-badge--hidden";
        return `player-badge player-badge--${badge.type}`;
    };

    // Gefilterte E-Mail-Liste
    const getFilteredEmails = () => {
        return availableEmails.filter((item) => {
            if (item.email === currentUser?.email) return false;
            if (usedEmails.includes(item.email) && item.email !== primaryValue)
                return false;
            return true;
        });
    };

    return (
        <fieldset className="player-row">
            <legend className="player-legend">Spieler {playerNumber}</legend>

            <div className="player-row__fields">
                <div className="player-input-wrapper">
                    <input
                        type="text"
                        className={`form-input ${
                            isCurrentUser ? "form-input--locked" : ""
                        } ${emailError ? "form-input--error" : ""} ${
                            nameWarning && !nameError && !emailError ? "form-input--warning" : ""
                        }`}
                        placeholder="E-Mail oder (Nick-)Name"
                        value={primaryValue}
                        onChange={handlePrimaryChange}
                        onBlur={handlePrimaryBlur}
                        readOnly={isCurrentUser}
                        list={`emails-${playerNumber}`}
                    />

                    {!isCurrentUser && (
                        <datalist id={`emails-${playerNumber}`}>
                            {getFilteredEmails().map((item) => (
                                <option key={item.id} value={item.email}>
                                    {item.name}
                                </option>
                            ))}
                        </datalist>
                    )}

                    {emailError && (
                        <span className="input-error">❌ {emailError}</span>
                    )}

                    {nameWarning && !nameError && !emailError && (
                        <div className="input-info">
                            <span className="input-info__icon">ℹ️</span>
                            <span className="input-info__text">{nameWarning}</span>
                        </div>
                    )}
                </div>

                <div
                    className={`player-input-wrapper ${
                        !showNameField ? "player-input-wrapper--hidden" : ""
                    }`}
                >
                    <input
                        type="text"
                        className={`form-input ${
                            nameError && showNameField ? "form-input--error" : ""
                        }`}
                        placeholder="(Nick-)Name"
                        value={nameValue}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        readOnly={isCurrentUser && !!currentUser?.name}
                        disabled={!showNameField}
                    />
                    
                    {nameError && showNameField && (
                        <span className="input-error">❌ {nameError}</span>
                    )}
                </div>

                <span className={getBadgeClass()}>{badge?.label || ""}</span>
            </div>
        </fieldset>
    );
}

export default PlayerInput;