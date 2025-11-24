# New Game Pre-Start Dokumentation

Diese Dokumentation beschreibt die "Neues Spiel"-Funktionalität der Stechen Helper-Anwendung, insbesondere die Seite zur Spielerauswahl und -konfiguration vor dem eigentlichen Spielstart.

## Übersicht

Die "Neues Spiel"-Seite ermöglicht es Benutzern:
- Die Anzahl der Spieler (2-11) auszuwählen
- Spielerdaten einzugeben (registrierte Benutzer, neue E-Mail-Benutzer oder Gäste)
- Einen Spielnamen festzulegen
- Die Spielkonfiguration zu validieren, bevor das Spiel gestartet wird

## Komponenten-Struktur

### Hauptkomponente

**NewGame** (`frontend/src/pages/NewGame.jsx`)
- Hauptseite für die Spielerstellung
- Verwaltet den Gesamtzustand und orchestriert die Unterkomponenten

### Unterkomponenten

1. **PlayerCountSelector** (`frontend/src/components/newgame/PlayerCountSelector.jsx`)
   - Ermöglicht die Auswahl der Spieleranzahl (2-11)
   - Zeigt die Anzahl der Karten pro Spieler basierend auf der Spieleranzahl an

2. **PlayerInput** (`frontend/src/components/newgame/PlayerInput.jsx`)
   - Verwaltet die Eingabe und Validierung von Spielerdaten
   - Unterstützt verschiedene Spielertypen: aktueller Benutzer, registrierte Benutzer, neue E-Mail-Benutzer und Gäste

## Datenfluss

```
NewGame (Hauptkomponente)
  ├── Verwaltet Spieleranzahl und Spielerdaten
  ├── PlayerCountSelector
  │     └── Gibt Änderungen der Spieleranzahl zurück
  └── PlayerInput (für jeden Spieler)
        └── Gibt Änderungen der Spielerdaten zurück
```

## Detaillierte Komponentenbeschreibung

### NewGame

#### Imports
```javascript
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import PlayerCountSelector from "../components/newgame/PlayerCountSelector";
import PlayerInput from "../components/newgame/PlayerInput";
import "../styles/pages/newgame.css";
```

#### State
- `playerCount`: Anzahl der Spieler (Standard: 5)
- `players`: Array mit Spielerdaten
- `availableEmails`: Liste der registrierten Benutzer
- `loading`: Ladezustand
- `error`: Fehlermeldung

#### Hauptfunktionen
- `handlePlayerCountChange`: Aktualisiert die Spieleranzahl
- `handlePlayerChange`: Aktualisiert die Spielerdaten eines bestimmten Spielers
- `getUsedEmails`: Berechnet bereits verwendete E-Mail-Adressen
- `getUsedGuestNames`: Berechnet bereits verwendete Gastnamen
- `getAllPlayerNames`: Berechnet alle Spielernamen für Überlappungsprüfungen
- `renderPlayerInputs`: Rendert die Eingabefelder für alle Spieler
- `isFormValid`: Prüft, ob das Formular gültig ist

#### Besonderheiten
- **Persistente Spielerdaten**: Spielerdaten bleiben erhalten, auch wenn die Spieleranzahl reduziert und später wieder erhöht wird
- **Automatische Validierung**: Prüft auf doppelte E-Mail-Adressen und Namen
- **Benutzertypen**: Unterstützt verschiedene Spielertypen mit unterschiedlichen Validierungsregeln

### PlayerCountSelector

#### Imports
```javascript
import React, { useState } from "react";
```

#### Props
- `initialCount`: Anfängliche Spieleranzahl (Standard: 5)
- `onChange`: Callback-Funktion, die bei Änderung der Spieleranzahl aufgerufen wird

#### Funktionen
- `calculateCardsPerPlayer`: Berechnet die Anzahl der Karten pro Spieler nach den Spielregeln
- `handleSelect`: Handler für Button-Klicks zur Auswahl der Spieleranzahl

#### Besonderheiten
- **Dynamische Kartenberechnung**: 
  - 2-6 Spieler: 9 Karten pro Spieler
  - 7-11 Spieler: 7 Karten pro Spieler
- **Visuelle Rückmeldung**: Aktiver Button wird hervorgehoben

### PlayerInput

#### Imports
```javascript
import React, { useState, useEffect, useCallback, useRef } from "react";
```

#### Props
- `playerNumber`: Nummer des Spielers
- `currentUser`: Aktueller angemeldeter Benutzer (für Spieler 1)
- `availableEmails`: Liste der verfügbaren E-Mail-Adressen
- `usedEmails`: Liste der bereits verwendeten E-Mail-Adressen
- `usedGuestNames`: Liste der bereits verwendeten Gastnamen
- `allPlayerNames`: Liste aller Spielernamen
- `onPlayerChange`: Callback-Funktion für Änderungen der Spielerdaten
- `isCurrentUser`: Flag, ob es sich um den aktuellen Benutzer handelt
- `existingData`: Bestehende Daten für den Spieler (für Persistenz)

#### State
- `primaryValue`: Primärer Eingabewert (E-Mail oder Gastname)
- `nameValue`: Name für E-Mail-Benutzer
- `showNameField`: Flag, ob das Namensfeld angezeigt werden soll
- `badge`: Badge-Informationen (Typ und Label)
- `emailError`: E-Mail-Fehler
- `nameError`: Namensfehler
- `nameWarning`: Namenswarnung

#### Hauptfunktionen
- Validierungsfunktionen:
  - `isValidEmail`: Prüft, ob eine E-Mail-Adresse gültig ist
  - `validateEmailDuplicate`: Prüft auf doppelte E-Mail-Adressen
  - `validateGuestNameDuplicate`: Prüft auf doppelte Gastnamen
  - `validateNameOverlap`: Prüft auf Namensüberlappungen
  - `validateNameRequired`: Prüft, ob ein Name erforderlich ist
- Event-Handler:
  - `handlePrimaryChange`: Handler für Änderungen im Primärfeld
  - `handlePrimaryBlur`: Handler für Blur-Events im Primärfeld
  - `handleNameChange`: Handler für Änderungen im Namensfeld
  - `handleNameBlur`: Handler für Blur-Events im Namensfeld

#### Besonderheiten
- **Intelligente Typenerkennung**: Erkennt automatisch, ob es sich um eine E-Mail-Adresse oder einen Gastnamen handelt
- **Kontextabhängige Validierung**: Unterschiedliche Validierungsregeln für verschiedene Spielertypen
- **Persistente Daten**: Initialisiert die Komponente mit vorhandenen Daten, wenn verfügbar
- **Benutzertypen**:
  - `current`: Aktueller angemeldeter Benutzer (Spieler 1)
  - `registered`: Registrierter Benutzer aus der Datenbank
  - `new`: Neuer Benutzer mit E-Mail-Adresse
  - `guest`: Gastbenutzer ohne E-Mail-Adresse

## Datenmodell

### Spielerdaten-Objekt
```javascript
{
  playerNumber: Number,  // Spielernummer (1-basiert)
  email: String,         // E-Mail-Adresse (null für Gäste)
  name: String,          // Name des Spielers
  type: String,          // 'current', 'registered', 'new', oder 'guest'
  hasError: Boolean      // Flag, ob Validierungsfehler vorliegen
}
```

## Benutzertypen und Validierungsregeln

### 1. Aktueller Benutzer (`current`)
- Immer Spieler 1
- Felder sind gesperrt und nicht editierbar
- Keine Validierung erforderlich

### 2. Registrierter Benutzer (`registered`)
- E-Mail-Adresse muss in der Datenbank vorhanden sein
- Name wird automatisch aus der Datenbank übernommen
- Validierung: E-Mail darf nicht doppelt verwendet werden

### 3. Neuer E-Mail-Benutzer (`new`)
- E-Mail-Adresse muss gültig sein und nicht in der Datenbank vorhanden sein
- Name ist erforderlich
- Validierung: E-Mail darf nicht doppelt verwendet werden, Name ist erforderlich

### 4. Gastbenutzer (`guest`)
- Kein E-Mail-Feld, nur Name
- Validierung: Name darf nicht doppelt verwendet werden

## Persistenz der Spielerdaten

Ein wichtiges Feature ist die Persistenz der Spielerdaten beim Ändern der Spieleranzahl:

1. Alle Spielerdaten werden im `players`-Array in der NewGame-Komponente gespeichert
2. Beim Reduzieren der Spieleranzahl bleiben die Daten im Array erhalten
3. Beim Erhöhen der Spieleranzahl werden die PlayerInput-Komponenten mit den vorhandenen Daten initialisiert
4. Die Spielerdaten bleiben dadurch erhalten, auch wenn die Spieleranzahl zwischenzeitlich reduziert wurde

### Implementierung
- Die PlayerInput-Komponente erhält einen `existingData`-Parameter mit den vorhandenen Daten
- Eine Initialisierungslogik in der PlayerInput-Komponente stellt die Daten wieder her
- Ein `isInitialized`-Ref verhindert mehrfache Initialisierungen

## Styling

Das Styling für die "Neues Spiel"-Seite ist in der Datei `frontend/src/styles/pages/newgame.css` definiert. Es umfasst:
- Layout für das Formular
- Styling für die Spielerauswahl-Buttons
- Styling für die Spielereingabefelder
- Badges für verschiedene Spielertypen
- Fehler- und Warnmeldungen

## Nutzung und Erweiterung

### Hinzufügen eines neuen Spielertyps
1. Neuen Typ in der PlayerInput-Komponente definieren
2. Validierungslogik für den neuen Typ implementieren
3. Badge und Styling für den neuen Typ hinzufügen

### Ändern der Validierungsregeln
Die Validierungsfunktionen befinden sich in der PlayerInput-Komponente und können bei Bedarf angepasst werden.

### Ändern der maximalen Spieleranzahl
Die Konstanten `MIN_PLAYERS` und `MAX_PLAYERS` in der PlayerCountSelector-Komponente können angepasst werden.

---

© 2024 Stechen Helper