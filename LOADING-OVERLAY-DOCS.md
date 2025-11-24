# Loading-Overlay Dokumentation

## Übersicht

Diese Dokumentation beschreibt die implementierte Loading-Overlay-Funktion, die während API-Anfragen einen vollständigen Bildschirmblock mit visueller Rückmeldung anzeigt.

## Funktionalität

Der Loading-Overlay bietet folgende Funktionen:
- Vollständige Abdunkelung des Bildschirms während API-Anfragen
- Blockierung aller Benutzerinteraktionen während des Ladevorgangs
- Visuelle Animation mit Spinner
- Kontextspezifische Lademeldungen für verschiedene API-Operationen
- Eleganter Blur-Effekt im Hintergrund

## Technische Implementierung

### Komponenten

1. **LoadingContext** (`frontend/src/context/LoadingContext.jsx`)
   - Verwaltet den globalen Ladezustand
   - Bietet Funktionen zum Starten und Stoppen des Ladevorgangs
   - Ermöglicht das Setzen spezifischer Lademeldungen

2. **LoadingOverlay** (`frontend/src/components/LoadingOverlay.jsx`)
   - Rendert den visuellen Overlay mit Spinner und Meldung
   - Wird nur angezeigt, wenn `isLoading` im Context `true` ist

3. **CSS-Styling** (`frontend/src/styles/components/loading.css`)
   - Definiert das Erscheinungsbild des Overlays
   - Enthält Animationen für den Spinner
   - Implementiert den Blur-Effekt und die Abdunkelung

### Integration mit API

Die API-Service-Datei (`frontend/src/services/api.js`) wurde angepasst, um:
- Bei jeder API-Anfrage den Loading-Overlay zu aktivieren
- Nach Abschluss der Anfrage den Overlay zu deaktivieren
- Spezifische Lademeldungen für verschiedene API-Endpunkte bereitzustellen

```javascript
// Beispiel für eine API-Anfrage mit Loading-Overlay
login: async (email, password) => {
    await initCSRF();
    return apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        loadingMessage: "Anmeldung wird verarbeitet..."
    });
},
```

### Einbindung in die Anwendung

1. **In main.jsx**
   - LoadingProvider wurde in die Provider-Hierarchie eingefügt

2. **In App.jsx**
   - Verbindung zwischen LoadingContext und API hergestellt

3. **In MainLayout.jsx**
   - LoadingOverlay in das Layout integriert

## Verwendung

Der Loading-Overlay wird automatisch bei allen API-Anfragen aktiviert. Es ist keine manuelle Aktivierung erforderlich.

### Hinzufügen neuer API-Endpunkte

Wenn Sie neue API-Endpunkte hinzufügen, können Sie spezifische Lademeldungen definieren:

```javascript
newApiFunction: async (data) => {
    return apiRequest("/endpoint", {
        method: "POST",
        body: JSON.stringify(data),
        loadingMessage: "Spezifische Lademeldung..."
    });
},
```

## Anpassung

### Design anpassen

Um das Erscheinungsbild des Overlays zu ändern, bearbeiten Sie die CSS-Datei:
`frontend/src/styles/components/loading.css`

### Verhalten anpassen

Um das Verhalten des Loading-Overlays anzupassen, können Sie den LoadingContext modifizieren:
`frontend/src/context/LoadingContext.jsx`

---

© 2024 Stechen Helper