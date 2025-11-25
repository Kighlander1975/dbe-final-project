# 📚 LoadingContext & LoadingOverlay Dokumentation

---

## 📖 **Übersicht**

Das **LoadingContext**-System bietet ein **globales Loading-Overlay**, das während asynchroner Operationen (z.B. API-Calls) angezeigt wird.

### **Vorteile:**
- ✅ **Zentrale Verwaltung** des Loading-States
- ✅ **Konsistentes UX** in der gesamten App
- ✅ **Anti-Flicker-Mechanismus** (150ms Delay)
- ✅ **Anpassbare Nachrichten** pro Aktion
- ✅ **Einfache Integration** in bestehende Komponenten

---

## 🏗️ **Architektur**

```
┌─────────────────────────────────────┐
│         LoadingProvider             │
│  (Verwaltet globalen State)         │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌───────▼────────┐
│ LoadingOverlay │  │  Komponenten   │
│  (Zeigt UI)    │  │ (Login, etc.)  │
└────────────────┘  └────────────────┘
```

---

## 📁 **Dateien**

### **1. LoadingContext.jsx**
**Pfad:** `src/context/LoadingContext.jsx`

**Zweck:** Verwaltet den globalen Loading-State

```jsx
// Exports:
- LoadingProvider    // Provider-Komponente
- useLoading()       // Hook für Komponenten
```

**State:**
| Variable | Typ | Beschreibung |
|----------|-----|--------------|
| `isLoading` | `boolean` | Ist Loading aktiv? |
| `loadingMessage` | `string` | Angezeigte Nachricht |

**Funktionen:**
| Funktion | Parameter | Beschreibung |
|----------|-----------|--------------|
| `startLoading(message)` | `string` (optional) | Startet Loading mit Nachricht |
| `stopLoading()` | - | Beendet Loading |

---

### **2. LoadingOverlay.jsx**
**Pfad:** `src/components/LoadingOverlay.jsx`

**Zweck:** Zeigt das visuelle Overlay an

**Features:**
- ⏱️ **150ms Delay** (verhindert Flackern bei schnellen Requests)
- 🎨 **Spinner-Animation**
- 💬 **Dynamische Nachricht**
- 🚀 **Sofortiges Ausblenden** nach `stopLoading()`

---

## 🔧 **Setup**

### **1. Provider einbinden**

In `App.jsx`:

```jsx
import { LoadingProvider } from './context/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';

function App() {
  return (
    <LoadingProvider>
      <LoadingOverlay />  {/* ✅ Einmal hier einbinden */}
      
      {/* Deine App-Komponenten */}
      <Router>
        <Routes>
          {/* ... */}
        </Routes>
      </Router>
    </LoadingProvider>
  );
}
```

---

## 💻 **Verwendung in Komponenten**

### **Schritt 1: Import**
```jsx
import { useLoading } from '../context/LoadingContext';
```

### **Schritt 2: Hook einbinden**
```jsx
const { startLoading, stopLoading } = useLoading();
```

### **Schritt 3: Loading starten/stoppen**

#### **Beispiel: Login-Formular**

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // ✅ SOFORT starten (vor allem anderen!)
  startLoading('Anmeldung läuft...');
  
  // Validation
  if (!email || !password) {
    setError('Felder ausfüllen');
    stopLoading(); // ✅ Bei Fehler stoppen
    return;
  }
  
  try {
    const result = await login(email, password);
    
    if (result.success) {
      // ❌ KEIN stopLoading() hier!
      // Grund: navigate() unmountet Komponente
      navigate('/');
    } else {
      setError(result.message);
      stopLoading(); // ✅ Bei API-Fehler stoppen
    }
  } catch (err) {
    setError('Fehler');
    stopLoading(); // ✅ Bei Exception stoppen
  }
};
```

---

## 📋 **Wann stopLoading() aufrufen?**

| **Situation** | **stopLoading()** | **Grund** |
|---------------|-------------------|-----------|
| ✅ **Validation-Fehler** | **JA** | Request wird nicht gesendet |
| ✅ **API-Fehler** (catch) | **JA** | Loading muss manuell beendet werden |
| ✅ **Erfolg OHNE Navigation** | **JA** | User bleibt auf der Seite |
| ❌ **Erfolg MIT Navigation** | **NEIN** | Komponente wird unmounted → Overlay verschwindet automatisch |

---

## 🎨 **Nachrichten anpassen**

```jsx
// Standard-Nachricht
startLoading(); // → "Wird geladen..."

// Eigene Nachricht
startLoading('Anmeldung läuft...');
startLoading('Passwort wird geändert...');
startLoading('Benutzer wird gesperrt...');
startLoading('Lade Spielerdaten...');
```

---

## ⏱️ **Anti-Flicker-Mechanismus**

### **Problem:**
Bei sehr schnellen Requests (<150ms) würde das Overlay kurz aufblitzen → schlechte UX

### **Lösung:**
Overlay erscheint **erst nach 150ms**

```jsx
const LOADING_DELAY_MS = 150;

useEffect(() => {
  let timer;
  
  if (isLoading) {
    // ⏱️ Warte 150ms, bevor Overlay erscheint
    timer = setTimeout(() => {
      setShowOverlay(true);
    }, LOADING_DELAY_MS);
  } else {
    // 🚀 Sofort ausblenden
    setShowOverlay(false);
  }
  
  return () => clearTimeout(timer);
}, [isLoading]);
```

### **Beispiel-Szenarien:**

| Request-Dauer | Overlay sichtbar? |
|---------------|-------------------|
| **50ms** | ❌ Nein (zu schnell) |
| **120ms** | ❌ Nein (zu schnell) |
| **200ms** | ✅ Ja (für 50ms) |
| **2000ms** | ✅ Ja (für 1850ms) |

---

## 🎯 **Best Practices**

### ✅ **DO:**
```jsx
// 1. Sofort nach e.preventDefault() starten
const handleSubmit = async (e) => {
  e.preventDefault();
  startLoading('Wird geladen...'); // ✅ Hier!
  
  // ... rest
};

// 2. Bei JEDEM Exit-Point stoppen
if (!valid) {
  stopLoading(); // ✅
  return;
}

try {
  // ...
} catch (err) {
  stopLoading(); // ✅
}
```

### ❌ **DON'T:**
```jsx
// 1. NICHT nach Validation starten
if (!valid) return;
startLoading(); // ❌ Zu spät!

// 2. NICHT bei Navigation stoppen
if (success) {
  stopLoading(); // ❌ Unnötig
  navigate('/');
}

// 3. NICHT vergessen zu stoppen
try {
  await api.call();
  // ❌ Fehlt: stopLoading()
} catch (err) {
  stopLoading();
}
```

---

## 🔮 **Zukünftige Erweiterungen**

### **TODO: Admin-Dashboard-Konfiguration**

```jsx
// Geplant: Delay im Admin-Dashboard einstellbar
const LOADING_DELAY_MS = adminSettings.loadingDelay || 150;

// Mögliche Optionen:
- 0ms   (kein Delay)
- 100ms (sehr schnell)
- 150ms (Standard)
- 300ms (langsam)
```

---

## 🐛 **Troubleshooting**

### **Problem: Overlay verschwindet nicht**

**Ursache:** `stopLoading()` fehlt in einem Exit-Path

**Lösung:**
```jsx
// Prüfe ALLE Stellen, wo die Funktion verlassen wird:
if (error1) {
  stopLoading(); // ✅
  return;
}

if (error2) {
  stopLoading(); // ✅
  return;
}

try {
  // ...
} catch (err) {
  stopLoading(); // ✅
}
```

---

### **Problem: Overlay flackert bei schnellen Requests**

**Ursache:** Delay zu kurz oder deaktiviert

**Lösung:** Erhöhe `LOADING_DELAY_MS` in `LoadingOverlay.jsx`:
```jsx
const LOADING_DELAY_MS = 200; // Statt 150
```

---

### **Problem: "useLoading must be used within LoadingProvider"**

**Ursache:** `LoadingProvider` fehlt in `App.jsx`

**Lösung:**
```jsx
<LoadingProvider>  {/* ✅ Muss ganz außen sein */}
  <LoadingOverlay />
  {/* Rest der App */}
</LoadingProvider>
```

---

## 📊 **Verwendete Komponenten (Stand jetzt)**

| Komponente | Status | Nachricht |
|------------|--------|-----------|
| **Login.jsx** | ✅ | "Anmeldung läuft..." |
| **Register.jsx** | ✅ | "Registrierung läuft..." |
| **ForgotPassword.jsx** | ✅ | "Reset-Link wird gesendet..." |
| **ChangePassword.jsx** | ✅ | "Passwort wird geändert..." |
| **NewGame.jsx** | ✅ | "Lade Spielerdaten..." |
| **UserManagement.jsx** | ✅ | "Lade Benutzer..." / "Rolle wird geändert..." |

---

## 🎓 **Zusammenfassung**

### **3 einfache Schritte:**

1️⃣ **Import:**
```jsx
import { useLoading } from '../context/LoadingContext';
```

2️⃣ **Hook:**
```jsx
const { startLoading, stopLoading } = useLoading();
```

3️⃣ **Verwenden:**
```jsx
startLoading('Nachricht...');
// ... async operation
stopLoading();
```

---

## 📞 **Support**

Bei Fragen oder Problemen:
- 📖 Diese Dokumentation lesen
- 🔍 Beispiel-Komponenten anschauen (Login.jsx)
- 🐛 Console-Logs prüfen

---

**Version:** 1.0  
**Letzte Aktualisierung:** 2025
**Autor:** Dein Stechen-Helper-Team 🚀