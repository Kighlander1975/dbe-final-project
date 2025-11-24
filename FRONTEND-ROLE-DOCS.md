# 🎯 Role-System Dokumentation

## Übersicht

Das Role-System ermöglicht die Verwaltung von Benutzerrollen (Player, Admin, Banned) sowohl im Backend (Laravel) als auch im Frontend (React).

---

## 🔧 Backend (Laravel)

### Verfügbare Rollen

```php
enum UserRole: string
{
    case PLAYER = 'player';  // Standard-Rolle
    case ADMIN = 'admin';    // Administrator
    case BANNED = 'banned';  // Gesperrter Benutzer
}
```

### User Model - Helper-Methoden

```php
// Role-Checks
$user->isAdmin();           // true wenn Admin
$user->isPlayer();          // true wenn Player
$user->isBanned();          // true wenn gebannt
$user->hasRole('admin');    // Prüft spezifische Rolle
$user->canAccessAdmin();    // Alias für isAdmin()

// Role-Label
$user->getRoleLabel();      // "Administrator", "Spieler", "Gesperrt"

// Role setzen
$user->setRole(UserRole::ADMIN);
$user->setRole(UserRole::PLAYER);
$user->setRole(UserRole::BANNED);
```

### Query Scopes

```php
// Alle Admins
User::admins()->get();

// Alle Player
User::players()->get();

// Alle gebannten User
User::banned()->get();

// Alle aktiven User (nicht gebannt)
User::active()->get();
```

### Middleware

```php
// In routes/api.php
Route::middleware('role:admin')->group(function () {
    // Nur für Admins
});

Route::middleware('role:player')->group(function () {
    // Nur für Player
});
```

### API Endpoints

#### Öffentlich
```
POST /api/register              - Registrierung (automatisch role: player)
POST /api/login                 - Login (prüft ob gebannt)
POST /api/verify-email          - E-Mail verifizieren
POST /api/resend-verification   - Verifizierungs-Mail erneut senden
```

#### Authentifiziert
```
GET  /api/user                  - Aktuellen User abrufen
GET  /api/user/role             - Role-Informationen abrufen
POST /api/logout                - Logout
```

#### Admin-Only (Middleware: role:admin)
```
GET   /api/admin/users                  - Alle User abrufen (mit Filter)
PATCH /api/admin/users/{id}/role        - User-Rolle ändern
PATCH /api/admin/users/{id}/ban         - User sperren
PATCH /api/admin/users/{id}/unban       - User entsperren
```

### Tinker-Befehle

```bash
# Container öffnen
docker-compose exec backend php artisan tinker

# User erstellen
$user = User::factory()->create([
    'email' => 'admin@test.com',
    'role' => 'admin',
    'email_verified_at' => now()
]);

# Role prüfen
$user->isAdmin();           // true
$user->getRoleLabel();      // "Administrator"

# Role ändern
$user->setRole(\App\UserRole::PLAYER);
$user->setRole(\App\UserRole::BANNED);

# User bannen/entbannen
$user->setRole(\App\UserRole::BANNED);
$user->setRole(\App\UserRole::PLAYER);

# Queries
User::admins()->count();    // Anzahl Admins
User::players()->count();   // Anzahl Player
User::banned()->count();    // Anzahl gebannte User
User::active()->count();    // Anzahl aktive User
```

---

## ⚛️ Frontend (React)

### AuthContext - Verfügbare Funktionen

```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { 
    user,              // User-Objekt (mit role-Property)
    loading,           // Boolean: Lädt User-Daten
    isAuthenticated,   // Boolean: User eingeloggt?
    isAdmin,           // Function: () => boolean
    isPlayer,          // Function: () => boolean
    isBanned,          // Function: () => boolean
    hasRole,           // Function: (role) => boolean
    canAccessAdmin,    // Function: () => boolean
    login,             // Function: async (email, password)
    logout,            // Function: async ()
    register,          // Function: async (name, email, password, password_confirmation)
  } = useAuth()

  // Beispiel-Verwendung
  if (isAdmin()) {
    return <AdminPanel />
  }

  return <PlayerDashboard />
}
```

### Protected Routes

#### ProtectedRoute (für authentifizierte User)
```jsx
import ProtectedRoute from './components/ProtectedRoute'

<Route 
  path="/new-game" 
  element={
    <ProtectedRoute>
      <NewGame />
    </ProtectedRoute>
  } 
/>
```

#### AdminRoute (nur für Admins)
```jsx
import AdminRoute from './components/AdminRoute'

<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <Dashboard />
    </AdminRoute>
  } 
/>
```

#### GuestRoute (nur für nicht-eingeloggte User)
```jsx
import GuestRoute from './components/GuestRoute'

<Route 
  path="/login" 
  element={
    <GuestRoute>
      <Login />
    </GuestRoute>
  } 
/>
```

### API Service

```javascript
import { authAPI, adminAPI } from '../services/api'

// Auth
await authAPI.login(email, password)
await authAPI.register(name, email, password, password_confirmation)
await authAPI.logout()
await authAPI.getUser()
await authAPI.checkRole()

// Admin
await adminAPI.getUsers(page, roleFilter)
await adminAPI.updateUserRole(userId, newRole)
await adminAPI.banUser(userId)
await adminAPI.unbanUser(userId)
```

### Komponenten-Beispiele

#### Conditional Rendering basierend auf Role
```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { isAdmin, isPlayer, user } = useAuth()

  return (
    <div>
      {isAdmin() && (
        <div>
          <h2>Admin-Bereich</h2>
          <AdminPanel />
        </div>
      )}

      {isPlayer() && (
        <div>
          <h2>Spieler-Bereich</h2>
          <PlayerDashboard />
        </div>
      )}

      <p>Eingeloggt als: {user?.name} ({user?.role})</p>
    </div>
  )
}
```

#### Role-Badge anzeigen
```jsx
function RoleBadge({ role }) {
  const styles = {
    admin: { bg: '#fbbf24', color: '#000' },
    player: { bg: '#3b82f6', color: '#fff' },
    banned: { bg: '#ef4444', color: '#fff' },
  }
  
  const style = styles[role] || styles.player
  
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      padding: '0.25rem 0.75rem',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    }}>
      {role}
    </span>
  )
}

// Verwendung
<RoleBadge role={user.role} />
```

#### Admin-Link nur für Admins zeigen
```jsx
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Navigation() {
  const { user, isAdmin } = useAuth()

  return (
    <nav>
      <Link to="/">Home</Link>
      
      {user && (
        <>
          <Link to="/new-game">Neues Spiel</Link>
          
          {isAdmin() && (
            <Link to="/admin">⚙️ Admin</Link>
          )}
        </>
      )}
    </nav>
  )
}
```

---

## 🧪 Testing

### Backend-Tests (Tinker)

```bash
docker-compose exec backend php artisan tinker
```

```php
// 1. Admin erstellen
$admin = User::factory()->create([
    'email' => 'admin@test.com',
    'role' => 'admin',
    'email_verified_at' => now()
]);

// 2. Player erstellen
$player = User::factory()->create([
    'email' => 'player@test.com',
    'role' => 'player',
    'email_verified_at' => now()
]);

// 3. Gebannten User erstellen
$banned = User::factory()->create([
    'email' => 'banned@test.com',
    'role' => 'banned',
    'email_verified_at' => now()
]);

// 4. Checks
$admin->isAdmin();          // true
$player->isPlayer();        // true
$banned->isBanned();        // true

// 5. Scopes
User::admins()->count();    // 1
User::players()->count();   // 1
User::banned()->count();    // 1
User::active()->count();    // 2
```

### API-Tests (curl)

```bash
# 1. Admin-Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'

# Response speichern:
TOKEN="1|xxxxxxxxxxxx"

# 2. Role checken
curl http://localhost:8000/api/user/role \
  -H "Authorization: Bearer $TOKEN"

# 3. Alle User abrufen (Admin)
curl http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"

# 4. User-Rolle ändern
curl -X PATCH http://localhost:8000/api/admin/users/2/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

# 5. User bannen
curl -X PATCH http://localhost:8000/api/admin/users/3/ban \
  -H "Authorization: Bearer $TOKEN"

# 6. User entsperren
curl -X PATCH http://localhost:8000/api/admin/users/3/unban \
  -H "Authorization: Bearer $TOKEN"

# 7. Als Player Admin-Route versuchen (sollte 403 geben)
curl http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer $PLAYER_TOKEN"
```

### Frontend-Tests

1. **Als Player einloggen**
   - Admin-Link sollte NICHT sichtbar sein
   - `/admin` manuell aufrufen → Redirect zu `/` mit Toast

2. **Als Admin einloggen**
   - Admin-Link sollte sichtbar sein
   - Admin-Badge neben Username
   - Admin-Panel funktioniert

3. **Gebannten User testen**
   - Login sollte fehlschlagen mit Meldung "Account gesperrt"

---

## 🔄 Workflows

### Neuen Admin erstellen

**Option 1: Via Tinker**
```bash
docker-compose exec backend php artisan tinker
```
```php
$user = User::where('email', 'user@example.com')->first();
$user->setRole(\App\UserRole::ADMIN);
```

**Option 2: Via Admin-Panel**
1. Als Admin einloggen
2. Admin-Panel öffnen
3. User suchen
4. Rolle auf "Admin" ändern

### User bannen

**Option 1: Via Tinker**
```php
$user = User::find(1);
$user->setRole(\App\UserRole::BANNED);
```

**Option 2: Via Admin-Panel**
1. Als Admin einloggen
2. Admin-Panel öffnen
3. User suchen
4. "Sperren"-Button klicken

**Option 3: Via API**
```bash
curl -X PATCH http://localhost:8000/api/admin/users/1/ban \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### User entsperren

**Option 1: Via Tinker**
```php
$user = User::find(1);
$user->setRole(\App\UserRole::PLAYER);
```

**Option 2: Via Admin-Panel**
1. Filter auf "Banned" setzen
2. User suchen
3. "Entsperren"-Button klicken

**Option 3: Via API**
```bash
curl -X PATCH http://localhost:8000/api/admin/users/1/unban \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 🚨 Troubleshooting

### "Keine Berechtigung" obwohl Admin

**Lösung:**
```bash
# 1. Cache leeren
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear

# 2. User-Rolle in DB prüfen
docker-compose exec backend php artisan tinker
```
```php
$user = User::find(1);
echo $user->role->value; // Sollte "admin" sein
```

### Middleware funktioniert nicht

**Lösung:**
```bash
# 1. bootstrap/app.php prüfen
# Middleware-Alias muss registriert sein:
# 'role' => \App\Http\Middleware\EnsureUserHasRole::class

# 2. Container neu starten
docker-compose restart backend
```

### Frontend zeigt Admin-Link nicht

**Lösung:**
```javascript
// 1. Browser-Console öffnen
// 2. User-Objekt prüfen
console.log(user)
console.log(user?.role)

// 3. AuthContext prüfen
const { isAdmin } = useAuth()
console.log(isAdmin()) // Sollte true sein
```

### Gebannter User kann sich einloggen

**Lösung:**
```php
// AuthController.php prüfen
// Login-Methode muss Ban-Check enthalten:
if ($user->isBanned()) {
    return response()->json([
        'message' => 'Ihr Account wurde gesperrt.',
        'error' => 'account_banned'
    ], 403);
}
```

---

## 📝 Checkliste für neue Rollen

Falls Sie in Zukunft eine neue Rolle hinzufügen möchten:

### Backend
- [ ] `UserRole` Enum erweitern
- [ ] Helper-Methode im User Model (`isNewRole()`)
- [ ] Scope im User Model (`scopeNewRoles()`)
- [ ] Label in `getRoleLabel()` hinzufügen
- [ ] Migration erstellen (falls nötig)
- [ ] Middleware-Logic anpassen (falls nötig)

### Frontend
- [ ] Helper-Funktion in AuthContext (`isNewRole()`)
- [ ] Badge-Style definieren
- [ ] Protected Route erstellen (falls nötig)
- [ ] Navigation anpassen

---

## 🎯 Best Practices

1. **Immer Helper-Methoden verwenden**
   ```php
   // ✅ Gut
   if ($user->isAdmin()) { ... }
   
   // ❌ Schlecht
   if ($user->role === 'admin') { ... }
   ```

2. **Middleware für Route-Protection**
   ```php
   // ✅ Gut
   Route::middleware('role:admin')->group(function () { ... });
   
   // ❌ Schlecht
   if (Auth::user()->role !== 'admin') abort(403);
   ```

3. **Frontend: Komponenten statt Inline-Checks**
   ```jsx
   // ✅ Gut
   <AdminRoute><Dashboard /></AdminRoute>
   
   // ❌ Schlecht
   {isAdmin() ? <Dashboard /> : <Redirect to="/" />}
   ```

4. **Scopes für Queries**
   ```php
   // ✅ Gut
   $admins = User::admins()->get();
   
   // ❌ Schlecht
   $admins = User::where('role', 'admin')->get();
   ```

---

## 📚 Weitere Ressourcen

- Laravel Enums: https://laravel.com/docs/11.x/eloquent-mutators#enum-casting
- Laravel Middleware: https://laravel.com/docs/11.x/middleware
- React Context: https://react.dev/reference/react/useContext
- React Router: https://reactrouter.com/en/main

---

**Version:** 1.0  
**Letzte Aktualisierung:** November 2024  
**Autor:** Stechen Helper Team