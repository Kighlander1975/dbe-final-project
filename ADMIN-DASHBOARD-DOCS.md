# 📚 Admin-Dashboard: Neue Seiten hinzufügen

## 🎯 Übersicht

Das Admin-Dashboard verwendet eine **Sidebar-Navigation** mit verschachtelten Routen. Jede Unterseite ist über `/admin/{seitenname}` erreichbar.

---

## 📁 Dateistruktur

```
src/
├── pages/
│   └── admin/
│       ├── Dashboard.jsx          (Hauptcontainer mit Sidebar)
│       ├── Overview.jsx           (Übersicht)
│       ├── UserManagement.jsx     (Benutzerverwaltung)
│       └── NeueSeite.jsx          (Deine neue Seite)
├── components/
│   └── admin/
│       └── AdminSidebar.jsx       (Seitennavigation)
├── styles/
│   └── pages/
│       └── admin/
│           ├── dashboard.css
│           ├── admin-sidebar.css
│           ├── user-management.css
│           └── neue-seite.css
```

---

## ✅ Schritt-für-Schritt: Neue Seite hinzufügen

### **Schritt 1: Neue Komponente erstellen**

Erstelle eine neue Datei im Ordner `src/pages/admin/`:

```jsx
// src/pages/admin/MeinNeueSeite.jsx
import React from 'react'
import '../../styles/pages/admin/meine-neue-seite.css' // Optional

function MeinNeueSeite() {
  return (
    <div className="meine-neue-seite">
      <h1 className="meine-neue-seite__title">🎯 Meine neue Seite</h1>
      <p className="meine-neue-seite__subtitle">
        Beschreibung der Seite
      </p>

      <div className="meine-neue-seite__card">
        <h2>Inhalt</h2>
        <p>Hier kommt dein Content hin...</p>
      </div>
    </div>
  )
}

export default MeinNeueSeite
```

---

### **Schritt 2: Route in Dashboard.jsx hinzufügen**

Öffne `src/pages/admin/Dashboard.jsx` und füge folgendes hinzu:

```jsx
// src/pages/admin/Dashboard.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Overview from './Overview'
import UserManagement from './UserManagement'
import MeinNeueSeite from './MeinNeueSeite' // ⭐ 1. Import hinzufügen
import '../../styles/pages/admin/dashboard.css'

function Dashboard() {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <main className="admin-dashboard__content">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="meine-seite" element={<MeinNeueSeite />} /> {/* ⭐ 2. Route hinzufügen */}
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default Dashboard
```

**Wichtig:** Der `path` in der Route bestimmt die URL:
- `path="meine-seite"` → `/admin/meine-seite`
- `path="settings"` → `/admin/settings`

---

### **Schritt 3: Menüpunkt in AdminSidebar.jsx hinzufügen**

Öffne `src/components/admin/AdminSidebar.jsx` und erweitere das `menuItems`-Array:

```jsx
// src/components/admin/AdminSidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/components/admin-sidebar.css'

function AdminSidebar() {
  const menuItems = [
    {
      path: '/admin',
      icon: '📊',
      label: 'Übersicht',
      exact: true
    },
    {
      path: '/admin/users',
      icon: '👥',
      label: 'Benutzerverwaltung'
    },
    // ⭐ Neuer Menüpunkt
    {
      path: '/admin/meine-seite',
      icon: '🎯',
      label: 'Meine Seite'
    },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2 className="admin-sidebar__title">⚙️ Admin</h2>
      </div>
      
      <nav className="admin-sidebar__nav">
        <ul className="admin-sidebar__menu">
          {menuItems.map((item) => (
            <li key={item.path} className="admin-sidebar__menu-item">
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  \`admin-sidebar__link \${isActive ? 'admin-sidebar__link--active' : ''}\`
                }
              >
                <span className="admin-sidebar__icon">{item.icon}</span>
                <span className="admin-sidebar__label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default AdminSidebar
```

**Menüpunkt-Optionen:**
- `path`: URL-Pfad (z.B. `/admin/settings`)
- `icon`: Emoji oder Icon (z.B. `⚙️`, `🎮`, `📊`)
- `label`: Angezeigter Text im Menü
- `exact`: `true` nur für die Übersicht (`/admin`), sonst weglassen

---

### **Schritt 4 (Optional): CSS-Datei erstellen**

Erstelle eine neue CSS-Datei für deine Seite:

```css
/* src/styles/pages/admin/meine-neue-seite.css */

.meine-neue-seite {
  max-width: 1200px;
}

.meine-neue-seite__title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-green-dark);
}

.meine-neue-seite__subtitle {
  font-size: 1.1rem;
  color: var(--text-medium);
  margin-bottom: 2rem;
}

.meine-neue-seite__card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
}

.meine-neue-seite__card h2 {
  font-size: 1.3rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .meine-neue-seite {
    padding: 1rem;
  }

  .meine-neue-seite__title {
    font-size: 1.5rem;
  }
}
```

**Verfügbare CSS-Variablen:**
- `var(--primary-green)` - Hauptfarbe
- `var(--primary-green-dark)` - Dunklere Hauptfarbe
- `var(--bg-card)` - Karten-Hintergrund
- `var(--bg-subtle)` - Subtiler Hintergrund
- `var(--text-dark)` - Dunkler Text
- `var(--text-medium)` - Mittlerer Text
- `var(--radius-lg)` - Großer Border-Radius
- `var(--radius-md)` - Mittlerer Border-Radius
- `var(--radius-sm)` - Kleiner Border-Radius
- `var(--shadow-card)` - Karten-Schatten
- `var(--shadow-sm)` - Kleiner Schatten

---

## 📋 Checkliste: Neue Seite hinzufügen

- [ ] **Schritt 1:** Komponente erstellen (`src/pages/admin/NeueSeite.jsx`)
- [ ] **Schritt 2:** Import + Route in `Dashboard.jsx` hinzufügen
- [ ] **Schritt 3:** Menüpunkt in `AdminSidebar.jsx` hinzufügen
- [ ] **Schritt 4:** (Optional) CSS-Datei erstellen und importieren
- [ ] **Test:** Seite im Browser unter `/admin/neue-seite` aufrufen

---

## 🎯 Beispiel: Settings-Seite hinzufügen

### 1. Komponente erstellen

```jsx
// src/pages/admin/Settings.jsx
import React from 'react'
import '../../styles/pages/admin/settings.css'

function Settings() {
  return (
    <div className="admin-settings">
      <h1 className="admin-settings__title">⚙️ Einstellungen</h1>
      <p className="admin-settings__subtitle">
        Systemeinstellungen verwalten
      </p>

      <div className="admin-settings__card">
        <h2>Allgemeine Einstellungen</h2>
        <form>
          <label>
            Seitenname:
            <input type="text" defaultValue="Mein Spiel" />
          </label>
          <button type="submit">Speichern</button>
        </form>
      </div>
    </div>
  )
}

export default Settings
```

---

### 2. Route hinzufügen

```jsx
// src/pages/admin/Dashboard.jsx
import Settings from './Settings' // Import

<Route path="settings" element={<Settings />} /> // Route
```

---

### 3. Menüpunkt hinzufügen

```jsx
// src/components/admin/AdminSidebar.jsx
{
  path: '/admin/settings',
  icon: '⚙️',
  label: 'Einstellungen'
}
```

---

### 4. CSS erstellen

```css
/* src/styles/pages/admin/settings.css */

.admin-settings {
  max-width: 800px;
}

.admin-settings__title {
  font-size: 2rem;
  color: var(--primary-green-dark);
  margin-bottom: 0.5rem;
}

.admin-settings__subtitle {
  font-size: 1.1rem;
  color: var(--text-medium);
  margin-bottom: 2rem;
}

.admin-settings__card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
}

.admin-settings__card h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.admin-settings__card form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-settings__card label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
}

.admin-settings__card input {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-sm);
}

.admin-settings__card button {
  align-self: flex-start;
  padding: 0.75rem 1.5rem;
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
}

.admin-settings__card button:hover {
  background: var(--primary-green-dark);
}
```

**Fertig!** Die Settings-Seite ist jetzt unter `/admin/settings` erreichbar.

---

## 🔧 Troubleshooting

### Problem: Seite wird nicht angezeigt
- ✅ Prüfe, ob der Import in `Dashboard.jsx` korrekt ist
- ✅ Prüfe, ob die Route hinzugefügt wurde
- ✅ Prüfe die Konsole auf Fehler

### Problem: Menüpunkt ist nicht aktiv
- ✅ Prüfe, ob der `path` in `AdminSidebar.jsx` mit der Route übereinstimmt
- ✅ Für die Übersicht (`/admin`) muss `exact: true` gesetzt sein

### Problem: Styling funktioniert nicht
- ✅ Prüfe, ob die CSS-Datei importiert wurde
- ✅ Prüfe, ob die Klassennamen korrekt sind
- ✅ Prüfe die Browser-Konsole auf CSS-Fehler

---

## 📊 URL-Struktur

| URL | Seite | Datei |
|-----|-------|-------|
| `/admin` | Übersicht | `src/pages/admin/Overview.jsx` |
| `/admin/users` | Benutzerverwaltung | `src/pages/admin/UserManagement.jsx` |
| `/admin/settings` | Einstellungen | `src/pages/admin/Settings.jsx` |
| `/admin/meine-seite` | Meine Seite | `src/pages/admin/MeinNeueSeite.jsx` |

---

## 🎨 Best Practices

### Naming Conventions
- **Komponenten:** PascalCase (`MeinNeueSeite.jsx`)
- **CSS-Dateien:** kebab-case (`meine-neue-seite.css`)
- **CSS-Klassen:** BEM-Notation (`meine-neue-seite__title`)
- **Routes:** kebab-case (`/admin/meine-seite`)

### CSS-Struktur
```css
.komponenten-name { }
.komponenten-name__element { }
.komponenten-name__element--modifier { }
```

Beispiel:
```css
.admin-settings { }
.admin-settings__title { }
.admin-settings__card { }
.admin-settings__card--highlighted { }
```

### Komponenten-Struktur
```jsx
function MeineKomponente() {
  // 1. Hooks (useState, useEffect, etc.)
  // 2. Funktionen
  // 3. Return (JSX)
  
  return (
    <div className="meine-komponente">
      <h1 className="meine-komponente__title">Titel</h1>
      <div className="meine-komponente__content">
        {/* Content */}
      </div>
    </div>
  )
}
```

---

## 📚 Weitere Ressourcen

- **React Router:** https://reactrouter.com/
- **BEM CSS:** http://getbem.com/
- **CSS Variables:** https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

---

## ✅ Zusammenfassung

### Dateien, die du bearbeiten musst:

| Datei | Was hinzufügen? |
|-------|----------------|
| `src/pages/admin/NeueSeite.jsx` | Neue Komponente erstellen |
| `src/pages/admin/Dashboard.jsx` | Import + `<Route>` hinzufügen |
| `src/components/admin/AdminSidebar.jsx` | Menüpunkt im `menuItems`-Array |
| `src/styles/pages/admin/neue-seite.css` | (Optional) Styles |

### Minimale Schritte:
1. Komponente erstellen
2. In `Dashboard.jsx` importieren + Route hinzufügen
3. Menüpunkt in `AdminSidebar.jsx` hinzufügen

**Das war's!** 🚀

---

*Erstellt: November 2024*  
*Version: 1.0*