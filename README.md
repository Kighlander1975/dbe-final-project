# Abschlussprojekt DBE-Academy Frontend Web Developer
### Projekt: **Stechen**-Helper

<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-red.svg" alt="Laravel">
  <img src="https://img.shields.io/badge/PHP-8.2-blue.svg" alt="PHP">
  <img src="https://img.shields.io/badge/React-18.3.1-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/Node.js-20-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  <img src="https://img.shields.io/badge/Status-Release_Candidate_1.0-orange.svg" alt="RC 1.0">
  <br>
  <img src="https://img.shields.io/github/issues/Kighlander1975/dbe-final-project.svg" alt="Issues">
  <img src="https://img.shields.io/github/stars/Kighlander1975/dbe-final-project.svg" alt="Stars">
  <img src="https://img.shields.io/github/last-commit/Kighlander1975/dbe-final-project.svg" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/Kighlander1975/dbe-final-project.svg" alt="Repo Size">
  <img src="https://img.shields.io/github/contributors/Kighlander1975/dbe-final-project.svg" alt="Contributors">
  <img src="https://img.shields.io/github/commit-activity/m/Kighlander1975/dbe-final-project.svg" alt="Commit Activity">
  <br>
  <img src="https://img.shields.io/badge/Open_Source-Yes-green.svg" alt="Open Source">
  <img src="https://img.shields.io/badge/PRs-Welcome-blue.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/Maintained-Yes-green.svg" alt="Maintained">
  <img src="https://img.shields.io/badge/Version-RC_1.0-success.svg" alt="Version">
</p>

## 🚀 Release Candidate 1.0 - Features Overview

**Stechen-Helper** ist eine moderne Webanwendung zur Organisation und Verwaltung von Stechen-Partien. Die Anwendung bietet eine vollständige Spielverwaltung mit Echtzeit-Updates, Ranking-System und umfassenden Admin-Funktionen.

### ✨ Key Features (RC 1.0)

#### 🎮 Spiel-Management
- **Live-Spiele** mit Echtzeit-Updates während des Spielverlaufs
- **Automatische Punkteberechnung** nach Stechen-Regeln
- **Spieler-Auswahl** und Dealer-Rotation
- **Spiel-Pause/Fortsetzung** mit visueller Kennzeichnung
- **Spiel-Historie** und detaillierte Statistiken

#### 🏆 Ranking & Statistiken
- **Elo-ähnliches Rating-System** für faire Spielerbewertung
- **Globale Ranglisten** mit Punkten und Platzierungen
- **Persönliche Statistiken** (Durchschnittsplatzierung, Win-Rate, etc.)
- **Konfigurierbare Count-Up-Animationen** (0.5-2 Sekunden)
- **Vollständige Rankings-Reset-Funktion** für Admins

#### 👥 User-Management
- **Vollständige Authentifizierung** (Registrierung, Login, Passwort-Reset)
- **E-Mail-Verifizierung** und Sicherheit
- **Rollenbasierte Berechtigungen** (Player, Host, Admin)
- **User-Profile** mit persönlichen Statistiken

#### 🔧 Admin-Dashboard
- **User-Verwaltung** (Rollen ändern, bannen, löschen)
- **Einstellungs-Management** mit Datenpersistenz
- **Test-E-Mail-Funktion** für Debugging
- **System-Statistiken** und Monitoring
- **Sichere Daten-Reset-Funktionen**

#### 🎨 User Experience
- **Responsive Design** für Desktop, Tablet und große Handys
- **Intuitive Benutzeroberfläche** mit klarer Navigation
- **Toast-Benachrichtigungen** für User-Feedback
- **Loading-States** und Error-Handling
- **Professionelle UI** mit modernem Design

### Inhaltsverzeichnis
1. [Einleitung](#einleitung)
2. [Projektbeschreibung](#projektbeschreibung)
   - [Die Idee](#die-idee)
   - [Die Regeln des Spiels Stechen](#die-regeln-des-spiels-stechen)
     - [Das Ansagen](#das-ansagen)
     - [Das Spielen](#das-spielen)
     - [Das Auswerten](#das-auswerten)
   - [Glossar der Spielbegriffe](#glossar-der-spielbegriffe)
3. [Technische Anforderungen](#technische-anforderungen)
   - [Technologiestack](#technologiestack)
   - [Entwicklungsumgebung](#entwicklungsumgebung)
   - [Installation und Setup](#installation-und-setup)
   - [Kernfunktionalitäten](#kernfunktionalitäten)
   - [Benutzeroberfläche](#benutzeroberfläche)
   - [Datenverwaltung](#datenverwaltung)
   - [Sicherheit und Datenschutz](#sicherheit-und-datenschutz)
   - [Benutzerrollen und Zugriffsrechte](#benutzerrollen-und-zugriffsrechte)
   - [Rollenmanagement und Zugriffslogik](#rollenmanagement-und-zugriffslogik)
   - [Erweiterbarkeit](#erweiterbarkeit)
4. [Admin-Bereich](#admin-bereich)

## Einleitung
Das **Stechen**-Helper Projekt ist eine Webanwendung, die entwickelt wird, um die Organisation und Verwaltung von dem Kartenspiel "**Stechen**" zu erleichtern. Die Anwendung soll Benutzern helfen, **Stechen**-Partien zu planen, zu verwalten und zu verfolgen, indem sie eine benutzerfreundliche Oberfläche und leistungsstarke Funktionen bietet. Diese Webanwendung wird für **Tablets und Desktop** entwickelt, aber geeignete, große Handys im Querformat werden ebenfalls unterstützt.

## Projektbeschreibung
### Die Idee
Das Kartenspiel **Stechen** ist in meiner Familie ein beliebtes Gesellschaftsspiel, das oft mit Freunden und der Familie gespielt wird. Es basiert auf dem Kartenspiel [**11er Raus**](https://amzn.eu/d/eReStgf), dessen Regeln ich gleich noch näher erläutere. Für dieses Spiel braucht man einen Schriftführer, der die Punkte mitschreibt und so später dann der Gewinner ermittelt werden kann. Und HIER kommt die App ins Spiel. Meine App soll den Papieraufwand minimieren, wenn nicht gleich eliminieren und einen schnelleren und zugleich komplett regelkonformen Ablauf zu gewährleisten. Das *tracken* einer Partie ist aber nur ein Teil der App. Mit dieser App soll man zudem auch mehrere Spielgruppen organisieren können und Ranglisten sowie Spielerstärken ermitteln.

### Die Regeln des Spiels **Stechen**
Für dieses Spiel benötigt man das oben erwähnte **11er Raus** Kartenspiel. **Stechen** ist ein Spiel für mind. 2 und maximal 11 Personen. Den meisten Spielspaß hat man allerdings erst ab mindestens drei Personen.

Ziel dieses Spieles ist es, durch die geschickte Analyse seiner Karten und die Ansage seiner zu erwartenden Stiche eine bestimmte Punktzahl als Erstes so schnell wie möglich zu erreichen.

Das **11er Raus** Kartenspiel besteht aus 80 Karten, aufgeteilt in 4 Farben, rot, gelb, grün und blau, zu Werten von 1-20. Daher ergibt sich auch die Höchstgrenze für Mitspieler: 11 Spieler je 7 Karten = 77 Karten, drei rest im Stack. Davon eine Karte als Trumpf-Karte = 78 Karten, zwei verbleibende.

Je nach Anzahl der Spieler gibt es unterschiedliche Anzahl von Karten, die die Spieler zu Beginn erhalten:
- 2 - 6 Spieler: 9 Karten
- 7 - 11 Spieler: 7 Karten

Die restlichen Karten verbleiben als Stapel, wobei noch EINE Karte als Trumpfkarte/Trumpf-Farbe aufgedeckt auf den Stapel gelegt wird.

Zu Beginn des Spieles wird der Kartengeber (Dealer) bestimmt, danach wechselt dieser pro Spielrunde im Uhrzeigersinn. Der Dealer mischt die Karten und teilt sie aus. Danach wird die Trumpfkarte aufgedeckt. Eine Runde besteht aus drei Spielabschnitten, die nun näher erläutert werden.

#### Das Ansagen
In diesem Spielabschnitt startet der Spieler **links vom Dealer** mit den Ansagen. Einen sogenannten *Stich* kann man machen, wenn man mit der ausgespielten Farbe die höchste Zahl selbst hat oder, wenn die ausgespielte Karte keine Trumpf-Farbe ist, die höchste Trumpf-Farbe-Karte auf den Tisch legt. Entscheidend ist, dass man die Farbe, die ausgespielt wurde, bedienen muss, es sei denn, man hat diese Farbe nicht. Dann kann man entweder eine Trumpf-Farbe legen und so eventuell den Stich zu bekommen oder eine andere Farbe abwerfen. Mit diesem Hintergrund *schätzt* der Spieler, wie viele Stiche er mit seinen Karten bekommt. Es sind Ansagen von 0 bis 7 (oder 9 bei Spieleranzahl kleiner als sieben) möglich.

Hierbei kommt auch die strategische Komponente ins Spiel, denn die nachfolgenden Spieler können die Ansagen der Vorherigen sehen und so ihre eigene Ansage anpassen. 

Der Schriftführer notiert die Ansagen nach und nach auf seinem Zettel (später in der App) und nachdem der Dealer seine Ansage gemacht hat, startet der zweite Abschnitt:

#### Das Spielen
Der Spieler **links vom Dealer** beginnt mit dem Ausspielen einer Karte. Dabei ist es vollkommen egal, was für eine Karte er ausspielt (Trumpf-Farbe oder nicht). Alle nachfolgenden Spieler müssen diese Farbe erwidern, sofern sie sie haben. Wenn nicht, darf eine Trumpf-Farbe ausgespielt werden, um zu signalisieren, dass **dieser Spieler** den Stich haben möchte. Er kann aber auch eine andere Farbe abwerfen, wenn er die Farbe nicht bedienen kann. Das bewusste Nichtbedienen ist ein Regelverstoß, der bis zum Spielausschluss geahndet werden kann.

Der Spieler, der entweder die höchste Karte der geforderten Farbe **oder** die höchste Trumpf-Farbe gelegt hat bekommt den Stich und ist nun an der Reihe, eine Karte zu legen. Dieses wiederholt sich so lange, bis kein Spieler mehr eine Karte auf der Hand hat. Die Stiche werden sorgfältig auf einem für den Spieler geeigneten Platz so hingelegt, dass man die Zahl der Stiche auf einen Blick sehen kann. 

Sind alle Stiche ausgespielt, geht es zum dritten Abschnitt:

#### Das Auswerten
Der Schriftführer zählt reihum, beginnend vom Spieler **links vom Dealer** die Stiche und vergleicht diese mit den Ansagen. Jeder Stich ist pauschal schon mal ein Punkt wert. Hat der Spieler genauso viele Stiche bekommen, wie er angesagt hat, bekommt dieser einen Bonus von 10 Punkten. Hat der Spieler mehr oder weniger Stiche als angesagt, bekommt er so viele Punkte, wie er Stiche bekommen hat.

##### Sonderfall: 0 Punkte angesagt und eingehalten
Hat der Spieler 0 Punkte angesagt und auch 0 Punkte erreicht, bekommt er 20 Punkte. Bei Nichteinhalten bekommt er so viele Punkte, wie er Stiche gesammelt hat.

Der Schriftführer notiert die Punkte auf dem Zettel (später in der App) und zählt die Punkte zusammen. Sobald ein Spieler 100 Punkte + Datum erreicht hat, ist die Runde zu Ende. 100 plus Datum heißt, wenn heute z.B. der 6.11. wäre, dann ist die Gewinnmarke 106 Punkte, die es zu erreichen gilt. Haben mehrere Spieler die Gewinnmarke erreicht, dann ist derjenige Spieler, der diese Marke zuerst erreicht hat, der Gewinner.

### Glossar der Spielbegriffe

| Begriff | Erklärung |
|---------|-----------|
| **Stich** | Eine Spielrunde, bei der jeder Spieler eine Karte legt. Der Spieler mit der höchsten Karte der ausgespielten Farbe oder der höchsten Trumpf-Farbe gewinnt den Stich. |
| **Trumpf-Farbe** | Die zu Beginn jeder Runde durch eine aufgedeckte Karte festgelegte Farbe, die alle anderen Farben schlägt. |
| **Bedienen** | Die Pflicht, eine Karte der ausgespielten Farbe zu legen, wenn man diese besitzt. |
| **Dealer** | Der Kartengeber, der die Karten mischt und austeilt. Diese Rolle wechselt nach jeder Runde im Uhrzeigersinn. |
| **Ansagen** | Die Vorhersage eines Spielers, wie viele Stiche er in einer Runde zu machen glaubt. Basis für die spätere Punkteberechnung. |
| **Abwerfen** | Das Spielen einer Karte einer anderen Farbe, wenn man die geforderte Farbe nicht bedienen kann. |
| **Schriftführer** | Die Person, die die Ansagen und Punkte notiert und die Auswertung vornimmt. Diese Person nutzt anstelle von Zettel und Stift die App zum Erfassen der Daten. |
| **100 plus Datum** | Die Gewinnregel, bei der die zu erreichende Punktzahl 100 plus die Tageszahl des aktuellen Datums ist (z.B. 106 Punkte am 6. eines Monats). |

## Technische Anforderungen

### Technologiestack

Die Anwendung wird mit folgenden Technologien entwickelt:

#### Frontend
- **React.js 18.3.1** als UI-Framework
- **Vite 6.4.1** als Build-Tool und Dev-Server
- **Vanilla CSS** für das Styling (keine CSS-Frameworks)
- **JavaScript (ES6+)** für die Funktionalität
- **Native Fetch API** für HTTP-Requests
- **React Router** für Client-Side Navigation
- **React Context** für State-Management

#### Backend
- **Laravel 12** als PHP-Framework
- **PHP 8.2+** für die Serverlogik
- **Laravel Sanctum** für API-Authentifizierung
- **RESTful API** für Frontend-Backend-Kommunikation
- **Eloquent ORM** für Datenbankoperationen
- **Laravel Mail** für E-Mail-Funktionalität

#### Datenbank
- **MariaDB 10.11+** für die persistente Datenspeicherung
- **Eloquent ORM** für Datenbankabfragen
- **Database Migrations** für Schema-Management
- **Database Seeders** für Testdaten

#### DevOps & Deployment
- **Docker & Docker Compose** für containerisierte Entwicklung
- **Nginx** als Webserver (im Container)
- **Supervisor** für Queue- und Task-Management
- **phpMyAdmin** für Datenbankverwaltung
- **Git** für Versionskontrolle
- **GitHub Actions** für CI/CD (geplant)

### Entwicklungsumgebung

Die Entwicklungsumgebung basiert auf Docker und besteht aus vier Services:

#### Container-Architektur

```
┌────────────────────────────────────────────────────────┐
│                    Docker Compose                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │   Backend    │  │   Database   │  │
│  │              │  │              │  │              │  │
│  │  React+Vite  │  │   Laravel    │  │   MariaDB    │  │
│  │  Port: 3000  │  │  Port: 8000  │  │  Port: 3307  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                        │
│                    ┌──────────────┐                    │
│                    │  phpMyAdmin  │                    │
│                    │  Port: 8080  │                    │
│                    └──────────────┘                    │
└────────────────────────────────────────────────────────┘
```

#### Service-Details

**Frontend-Container** (`stechen_frontend`)
- Node.js 20 Alpine
- Vite Dev-Server mit Hot Module Replacement
- Port: 3000
- Volume: `./frontend` → `/app`

**Backend-Container** (`stechen_backend`)
- PHP 8.2 FPM mit Nginx
- Laravel 12 Framework
- Port: 8000
- Volume: `./backend` → `/var/www/html`

**Datenbank-Container** (`stechen_database`)
- MariaDB 10.11
- Port: 3307 (Host) → 3306 (Container)
- Volume: `database_data` (persistent)

**phpMyAdmin-Container** (`stechen_phpmyadmin`)
- Webbasierte Datenbankverwaltung
- Port: 8080
- Verbunden mit `stechen_database`

### Installation und Setup

#### Voraussetzungen
- **Docker Desktop** installiert und laufend
- **Git** installiert
- **Mindestens 4GB freier RAM**
- **Windows/Linux/macOS** mit Docker-Unterstützung

#### 🚀 Schnellstart (RC 1.0)

```bash
# 1. Repository klonen
git clone https://github.com/Kighlander1975/dbe-final-project.git
cd stechen-helper

# 2. Docker-Container starten
docker-compose up -d

# 3. Backend initialisieren
docker exec -it stechen_backend bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed  # Optional: Testdaten laden
exit

# 4. Frontend-Dependencies (falls nötig)
docker exec -it stechen_frontend npm install
```

#### 🌐 Zugriff auf die Anwendung

Nach erfolgreichem Setup sind folgende Services verfügbar:

- **🎮 Frontend**: http://localhost:3000
- **🔧 Backend-API**: http://localhost:8000
- **🗄️ phpMyAdmin**: http://localhost:8080
  - Server: `stechen_database`
  - Benutzer: `stechen_user`
  - Passwort: `stechen_password`
- **💾 Datenbank** (extern): `localhost:3307`

#### 🛠️ Tägliche Entwicklung

```bash
# Projekt starten
docker-compose up -d

# Projekt beenden
docker-compose down

# Logs anzeigen
docker-compose logs -f

# Einzelne Container neu starten
docker-compose restart stechen_frontend
docker-compose restart stechen_backend

# Container-Status prüfen
docker-compose ps
```

#### 🔧 Troubleshooting

**Frontend Hot-Reload funktioniert nicht:**
```bash
docker-compose restart stechen_frontend
```

**Backend-Änderungen werden nicht übernommen:**
```bash
docker exec -it stechen_backend php artisan cache:clear
docker exec -it stechen_backend php artisan config:clear
```

**Datenbank-Verbindung fehlgeschlagen:**
```bash
docker-compose restart stechen_database
```

### Kernfunktionalitäten

#### ✅ 1. Vollständiges User-Management
- **Registrierung & Login** mit E-Mail-Verifizierung
- **Passwort-Reset** und -Änderung
- **Rollenbasierte Berechtigungen** (Player, Host, Admin)
- **Profile-Management** mit persönlichen Statistiken
- **Sichere Authentifizierung** via Laravel Sanctum

#### ✅ 2. Spielablauf-Management
- **Live-Spiele** mit Echtzeit-Updates
- **Spieler-Auswahl** und automatische Dealer-Rotation
- **Ansagen-Eingabe** mit Validierung
- **Stich-Erfassung** und automatische Punkteberechnung
- **Spiel-Pause/Fortsetzung** mit visueller Kennzeichnung
- **Spiel-Beendigung** mit finaler Punktevergabe

#### ✅ 3. Ranking & Statistik-System
- **Elo-ähnliches Rating-System** für faire Bewertung
- **Globale Ranglisten** mit Punkten und Platzierungen
- **Persönliche Statistiken** (Win-Rate, Durchschnittsplatzierung)
- **Konfigurierbare Animationen** (Count-Up-Duration: 0.5-2s)
- **Admin-Reset-Funktion** für Testdaten

#### ✅ 4. Admin-Dashboard
- **User-Verwaltung** (Rollen ändern, bannen/entbannen, löschen)
- **Einstellungs-Management** mit Datenbank-Persistenz
- **Test-E-Mail-Funktion** für Debugging
- **System-Statistiken** und Monitoring
- **Sichere Daten-Reset-Funktionen** mit Bestätigung

#### ✅ 5. Organisations-Features
- **Erstellung von Live-Spielen** mit Host-Berechtigungen
- **Spieler-Einladung** und -Verwaltung
- **Spiel-Historie** und detaillierte Aufzeichnungen
- **Visuelle Spiel-Unterscheidung** (aktiv/pausiert/beendet)
- **Responsive Design** für alle Geräte

### Benutzeroberfläche

Die Benutzeroberfläche wird für Tablets und Desktop optimiert, mit Unterstützung für große Handys im Querformat. Die Hauptansicht des Spiels wird wie folgt strukturiert:

**Datum: 06.11.2025 (Ziel: 106 Punkte)**

<div class="table-container" style="overflow-x: auto;">

| Spieler ||||||||||| Ges. |
|---------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| | **Runde #01** ||| **Runde #02** ||| **Runde #03** ||| **...** | |
| | A | S | P | A | S | P | A | S | P | | |
| Spieler 1 | 2 | 3 | 3 | 4 | 1 | 1 | 0 | 2 | 2 | ... | 076 |
| **Spieler 2*** | 0 | 1 | 1 | 1 | **1** | **11** | 3 | 2 | 2 | ... | **112** |
| Spieler 3 | 2 | **2** | **12** | 3 | 4 | 4 | 2 | **2** | **12** | ... | 107 |
| Spieler 4 | 3 | **3** | **13** | 0 | **0** | **20** | 2 | 1 | 1 | ... | 083 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| Spieler x | 0 | **0** | **20** | 1 | **1** | **11** | 1 | **1** | **11** | ... | 098 |

</div>

**Legende:** A = Ansage, S = Stiche, P = Punkte dieser Runde, Ges = Gesamtpunkte  
\* = Dealer in dieser Runde

Besonderheiten des UI-Designs:
- Fixierte Spalten für Spielernamen und Gesamtpunkte (bleiben immer sichtbar)
- Horizontal scrollbar Bereich zwischen den fixierten Spalten, der alle Rundendetails enthält und bei vielen Runden ein horizontales Scrollen ermöglicht, während die Spielernamen und Gesamtpunkte stets sichtbar bleiben
- Farbliche Hervorhebung für:
  - Dealer der aktuellen Runde
  - Übereinstimmende Ansagen und erreichte Stiche
  - Gewinner (Spieler, der die Zielmarke zuerst erreicht)
- Responsive Anpassung für verschiedene Bildschirmgrößen

#### 📝 API-Features
- **JSON-API**: Alle Responses im JSON-Format
- **Error-Handling**: Strukturierte Fehlerantworten
- **Pagination**: Automatische Paginierung für Listen
- **Rate-Limiting**: Schutz vor API-Missbrauch
- **CORS**: Cross-Origin-Requests erlaubt

### Datenbank-Schema

Die Anwendung verwendet eine normalisierte MySQL/MariaDB-Datenbank:

#### Haupttabellen
- **`users`**: Benutzerkonten mit Rollen und Statistiken
- **`games`**: Spiel-Sessions mit Status und Metadaten
- **`player_rankings`**: Detaillierte Spieler-Ergebnisse pro Spiel
- **`admin_settings`**: Konfigurierbare Anwendungseinstellungen

#### Wichtige Beziehungen
- **User ↔ Games**: Viele-zu-Viele (Spieler können in vielen Spielen teilnehmen)
- **Games ↔ Player Rankings**: Eins-zu-Viele (jedes Spiel hat viele Spieler-Ergebnisse)
- **Users ↔ Admin Settings**: Verwaltung von App-Konfigurationen

#### Datenbank-Features
- **Foreign Keys**: Referenzielle Integrität
- **Indexes**: Optimierte Queries für Rankings und Statistiken
- **Migrations**: Versionskontrolle des Datenbank-Schemas
- **Seeders**: Automatische Testdaten-Erstellung


### Sicherheit und Datenschutz

**Authentifizierung**: Laravel Sanctum für sichere API-Token-basierte Authentifizierung
**Autorisierung**: Rollenbasierte Zugriffsrechte (Player, Host, Admin)
**E-Mail-Verifizierung**: Pflicht bei Registrierung
**Passwort-Sicherheit**: Sichere Hashing-Algorithmen
**CSRF-Schutz**: Automatischer Schutz für alle Formulare
**Input-Validierung**: Serverseitige Validierung aller Eingaben

### API-Dokumentation

Die Anwendung bietet eine vollständige REST-API für alle Frontend-Interaktionen:

#### 🔐 Authentifizierung
```http
POST /api/register          # Benutzerregistrierung
POST /api/login             # Login
POST /api/logout            # Logout
GET  /api/user              # Aktuelle User-Daten
POST /api/verify-email      # E-Mail-Verifizierung
POST /api/forgot-password   # Passwort-Reset anfordern
POST /api/reset-password    # Passwort zurücksetzen
```

#### 🎮 Spiele-Management
```http
GET    /api/games/user-games    # Eigene Spiele (Host)
POST   /api/games               # Neues Spiel erstellen (Admin)
GET    /api/games/{id}          # Spiel-Details
PATCH  /api/games/{id}          # Spiel aktualisieren
PATCH  /api/games/{id}/pause    # Spiel pausieren
PATCH  /api/games/{id}/resume   # Spiel fortsetzen
PATCH  /api/games/{id}/finish   # Spiel beenden
DELETE /api/games/{id}          # Spiel löschen
```

#### 🏆 Rankings & Statistiken
```http
GET /api/rankings              # Top-Rankings
GET /api/rankings/stats        # Ranking-Übersicht
GET /api/rankings/{userId}     # Persönliche Details
GET /api/stats/players         # Spieler-Statistiken
GET /api/stats/player/{id}     # Einzelne Spieler-Stats
```

#### 👑 Admin-Funktionen
```http
GET    /api/admin/users              # Alle User (Admin)
PATCH  /api/admin/users/{id}/role    # Rolle ändern
PATCH  /api/admin/users/{id}/ban     # User bannen
DELETE /api/admin/users/{id}         # User löschen
GET    /api/admin/settings           # Einstellungen
PUT    /api/admin/settings/{key}     # Einstellung ändern
DELETE /api/admin/settings/reset-rankings # Rankings zurücksetzen
POST   /api/admin/test-email         # Test-E-Mail senden
```

#### ⚙️ Öffentliche Endpunkte
```http
GET /api/users              # Alle User (für Spieler-Auswahl)
GET /api/version            # App-Version
GET /api/settings/count_up_duration # Animation-Dauer
```

#### 📝 API-Features
- **JSON-API**: Alle Responses im JSON-Format
- **Error-Handling**: Strukturierte Fehlerantworten
- **Pagination**: Automatische Paginierung für Listen
- **Rate-Limiting**: Schutz vor API-Missbrauch
- **CORS**: Cross-Origin-Requests erlaubt
**CSRF-Schutz**: Laravel CSRF-Token für alle Formulare
**Passwort-Hashing**: Bcrypt-Verschlüsselung für Passwörter
**Umgebungsvariablen**: Sensible Daten in `.env`-Dateien (nicht im Git)
**Datenschutz**: Konformität mit gängigen Datenschutzrichtlinien (DSGVO-ready)

**Hinweis zur Session-Sicherheit:**
Die Benutzer-Session bleibt auch nach dem Schließen des Browsers oder dem Ausschalten des Geräts erhalten, solange die eingestellte Session-Lebensdauer (z. B. 2 Stunden) nicht überschritten wird. Dies ist besonders relevant für Tablets, die zwischendurch in den Standby-Modus gehen. Aus Sicherheitsgründen sollte beachtet werden, dass ein unbefugter Zugriff innerhalb dieses Zeitfensters möglich ist, solange die Session aktiv bleibt.

### Benutzerrollen und Zugriffsrechte

#### Rollen-Hierarchie
Die Anwendung verwendet ein dreistufiges Sanktionssystem für Benutzerrollen:

1. **Host** (Standard-Rolle für neue Registrierungen)
   - Spiele erstellen und verwalten
   - Spieler einladen und hinzufügen
   - Spielverlauf dokumentieren (Ansagen, Stiche, Punkte)
   - Spielergebnisse finalisieren
   - Spielgruppen organisieren und verwalten
   - Voller Zugriff auf alle Spieler-Funktionen

2. **Player** (Erste Sanktionsstufe - eingeschränkte Rechte)
   - Kann nur an Spielen teilnehmen (nicht leiten)
   - Eigenes Profil verwalten (Avatar, Einstellungen)
   - Persönliche Statistiken einsehen
   - Ranglisten und Ligatabellen betrachten
   - Spielhistorie ansehen
   - **Einschränkungen:** Keine Spielerstellung, keine Spielverwaltung

3. **Banned** (Zweite Sanktionsstufe - vollständige Sperre)
   - Kein Zugriff auf Spiel-Funktionen
   - Nur Profil-Verwaltung möglich
   - Keine Teilnahme an Spielen
   - Keine Sichtbarkeit in Ranglisten

#### Administrator
- Systemeinstellungen verwalten
- Benutzerkonten verwalten und Rollen ändern
- Globale Statistiken einsehen
- Sanktionen verhängen (Player → Banned)
- Technische Probleme beheben
- Zugriff auf phpMyAdmin für Datenbankwartung

### Rollenmanagement und Zugriffslogik

- **Automatische Rollenzuweisung**:
  - Neue Registrierungen erhalten automatisch die **Host**-Rolle
  - **Player**-Rolle wird nur als Sanktion durch Administratoren vergeben. Kann auch vom Spieler erbeten werden, wenn er keine Spiele leiten möchte
  - **Banned**-Rolle ist die höchste Sanktionsstufe

- **Sanktions-System**:
  - Bei Verdacht auf unlauteres Spiel: Host → Player (Warnung)
  - Bei bestätigten Verstößen: Player → Banned (Sperre)
  - Möglichkeit zur Rehabilitierung durch Administrator

- **Spielleiter-Exklusivität**:
  - Zu jedem Zeitpunkt kann nur ein Host pro Spiel/Liga aktiv sein
  - Player können nicht als Spielleiter fungieren
  - Banned haben keinen Zugriff auf Spiel-Funktionen

- **Session-Management**:
  - Laravel Session-Handling für Benutzer-Sessions
  - Token-basierte API-Authentifizierung für Frontend-Backend-Kommunikation
  - Automatische Session-Verlängerung bei Aktivität

### Erweiterbarkeit

Die Anwendung wird modular aufgebaut, um zukünftige Erweiterungen zu erleichtern:

- **Spieler-Dashboard**: Persönlicher Bereich für jeden Spieler mit:
  - Übersicht über laufende und vergangene Spiele
  - Persönliche Statistiken und Erfolge
  - Einladungen zu neuen Spielen
  - Benachrichtigungen über Spielaktivitäten

- **Mehrsprachigkeit**: Vorbereitung für mehrsprachige Unterstützung via Laravel Localization

- **API-Schnittstellen**: RESTful API für potenzielle mobile Apps oder Drittanbieter-Integrationen

- **Exportfunktionen**: Für Spielstatistiken und Ergebnisse (PDF, CSV) via Laravel Excel

- **Spielvarianten**: Möglichkeit zur Erweiterung um weitere Spielmodi oder Regelanpassungen

- **Liga-System**:
  - Organisation von Ligen und Turnieren
  - Passwortgeschützte Liga-Verwaltung
  - Saisonale Wettbewerbe
  - Automatische Ranglisten für Ligen

- **Soziale Funktionen**: Freundeslisten, Direktnachrichten, Spielersuche

- **Echtzeit-Features**: Möglichkeit zur Integration von Laravel Broadcasting für Live-Updates

---

## Projektstruktur

```
stechen-helper/
├── .github/                 # GitHub-spezifische Konfigurationen
├── .gitignore               # Git-Ignore-Regeln
├── AGENTS.MD                # Agenten-Dokumentation
├── README.md                # Projekt-Dokumentation
├── docker-compose.yml       # Docker-Konfiguration
├── entrypoint.sh            # Docker-Entrypoint-Script
├── frontend.Dockerfile      # Dockerfile für Frontend
├── package-lock.json        # NPM-Abhängigkeiten (Root)
├── check_games.php          # PHP-Skript für Spielprüfung
├── check_user.php           # PHP-Skript für Benutzerprüfung
│
├── backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # API-Controller
│   │   │   └── Middleware/  # Custom Middleware
│   │   ├── Mail/            # E-Mail-Templates
│   │   ├── Models/          # Eloquent Models
│   │   ├── Providers/       # Service Provider
│   │   └── UserRole.php     # Benutzerrollen-Modell
│   ├── bootstrap/
│   │   ├── app.php
│   │   ├── providers.php
│   │   └── cache/
│   ├── config/              # Konfigurationsdateien
│   │   ├── app.php
│   │   ├── auth.php
│   │   ├── cache.php
│   │   ├── cors.php
│   │   ├── database.php
│   │   ├── filesystems.php
│   │   ├── logging.php
│   │   ├── mail.php
│   │   ├── queue.php
│   │   ├── sanctum.php
│   │   ├── services.php
│   │   └── session.php
│   ├── database/
│   │   ├── factories/       # Model Factories
│   │   ├── migrations/      # Datenbank-Migrationen
│   │   └── seeders/         # Test-Daten
│   ├── docker/
│   │   ├── entrypoint.sh
│   │   ├── nginx.conf
│   │   └── supervisord.conf
│   ├── public/
│   │   ├── index.php
│   │   ├── robots.txt
│   │   └── build/
│   ├── resources/
│   │   ├── css/
│   │   ├── js/
│   │   └── views/
│   ├── routes/
│   │   ├── api.php          # API-Routen
│   │   ├── console.php      # Konsolen-Befehle
│   │   └── web.php          # Web-Routen
│   ├── storage/
│   │   ├── app/
│   │   ├── framework/
│   │   └── logs/
│   ├── tests/
│   │   ├── Feature/
│   │   ├── Unit/
│   │   └── TestCase.php
│   ├── artisan              # Laravel CLI
│   ├── composer.json        # PHP-Abhängigkeiten
│   ├── Dockerfile           # Backend-Dockerfile
│   ├── package.json         # Node-Abhängigkeiten (Backend)
│   ├── phpunit.xml          # Test-Konfiguration
│   ├── README.md
│   ├── supervisord.pid
│   ├── test_update.php
│   └── vite.config.js       # Vite-Konfiguration
│
├── frontend/                # React Frontend
│   ├── public/              # Statische Assets
│   ├── src/                 # Quellcode
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── ...              # Weitere Komponenten
│   ├── index.html           # HTML-Template
│   ├── package.json         # NPM-Abhängigkeiten
│   └── vite.config.js       # Vite-Konfiguration
│
├── backup/                  # Backup-Dateien
│   ├── docker-compose.yml
│   ├── entrypoint.sh
│   ├── frontend.Dockerfile
│   ├── NeuerTag.md
│   ├── PRE-GAME-DOCS.md
│   └── backend/
│       ├── Dockerfile
│       └── docker/
│
├── bilder_sammlung/         # Bildersammlung

└── Screenshots/             # Screenshots
    └── commit-74426cd/
```

## Admin-Bereich

Der Admin-Bereich bietet umfassende Verwaltungsfunktionen für Administratoren der Anwendung.

### Dashboard-Übersicht

Das Admin-Dashboard (`/admin`) zeigt wichtige Statistiken in animierten Karten an:

- **👥 Benutzer**: Gesamtanzahl registrierter Benutzer
- **🎮 Aktive Spiele**: Anzahl derzeit laufender Spiele
- **⏸️ Pausierte Spiele**: Anzahl vorübergehend gestoppter Spiele
- **🏆 Abgeschlossen**: Anzahl beendeter Spiele

#### Counter-Animation

Die Zahlen in den Statistik-Karten werden nach dem Laden der Seite von 0 auf den tatsächlichen Wert hochgezählt. Die Animation dauert genau 2 Sekunden, unabhängig von der Größe der Zahl:

- Bei kleinen Zahlen (z.B. 5) sind einzelne Schritte sichtbar
- Bei großen Zahlen (z.B. 1000) erfolgt der Zuwachs schneller, aber die Gesamtdauer bleibt 2 Sekunden

**Status:** ✅ Vollständig implementiert

Dieses Verhalten wird als **"Animated Counter"** oder **"Counter Animation"** bezeichnet und verbessert die User Experience durch dynamische Visualisierung der Daten.

### Benutzerverwaltung

Im Bereich "Benutzerverwaltung" (`/admin/users`) können Administratoren:

- Alle Benutzer auflisten und durchsuchen
- Benutzerrollen ändern (user → host → admin)
- Benutzer temporär sperren/entsperren

**Status:** ✅ Vollständig implementiert

### API-Endpunkte

#### Admin-Statistiken
```
GET /api/admin/stats
```
Gibt gecachte Statistiken zurück (Cache: 5 Minuten). Nur für Administratoren zugänglich.

**Response:**
```json
{
  "users": 42,
  "active_games": 3,
  "paused_games": 1,
  "finished_games": 15,
  "host_requests": 2
}
```

**Status:** ✅ Vollständig implementiert

---

### Anti-Collusion-Schutz für Elo-Rating-System

**Problemstellung:** Das aktuelle Elo-System verhindert nicht, dass zwei oder mehr Spieler sich gegenseitig "hochpushen" können, indem sie nur untereinander spielen und abwechselnd gewinnen.

**Geplante Lösungsansätze:**

#### 1. **Opponent-Diversity-Score**
- **Berechnung:** Prozentualer Anteil verschiedener Gegner an allen gespielten Spielen
- **Formel:** `Diversity = (eindeutige_Gegner / gesamt_spiele) × 100`
- **Mindest-Requirement:** Spieler müssen mindestens 70% verschiedene Gegner haben
- **Rating-Cap:** Rating wird auf Basis der Diversity gedeckelt

#### 2. **Mutual-Rating-Analysis**
- **Überwachung:** Prüfung, ob zwei Spieler sich gegenseitig stärker pushen als erwartet
- **Metriken:**
  - Korrelation der Rating-Entwicklung zwischen Spielern
  - Häufigkeit gemeinsamer Spiele vs. Rating-Veränderungen
  - Verdacht bei Korrelation > 0.8 über 10+ gemeinsame Spiele

#### 3. **Rating-Inflation-Detektion**
- **Zeitbasierte Analyse:** Überprüfung ungewöhnlich schneller Rating-Zuwächse
- **Benchmarking:** Vergleich mit ähnlich starken Spielern
- **Dämpfung:** Automatische Reduzierung von K-Faktor bei Verdacht

#### 4. **Minimum-Opponent-Pool**
- **Anforderung:** Spieler müssen gegen mindestens 5 verschiedene Gegner gespielt haben
- **Rating-Freeze:** Neues Rating wird erst nach Erreichen des Minimums aktiviert
- **Warnsystem:** Benachrichtigung bei zu homogener Gegner-Zusammensetzung

#### 5. **Clustering-basierte Erkennung**
- **Algorithmus:** K-Means Clustering von Spielmustern
- **Features:** Gegner-Diversität, Spielhäufigkeit, Rating-Veränderungen
- **Intervention:** Manuelle Überprüfung bei Identifizierung von "Spam-Clustern"

#### 6. **Implementierungspriorität**
```
Hoch:    1. Opponent-Diversity-Score + Rating-Cap
Mittel:  2. Mutual-Rating-Analysis  
Niedrig: 3. Rating-Inflation-Detektion
         4. Minimum-Opponent-Pool
         5. Clustering-Analyse
```

**Ziel:** Faire Wettkampfbedingungen erhalten, ohne legitime Spieler zu beeinträchtigen.

#### **Abstrakte Implementation für Stechen-App**

**Architektur-Überblick:**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Game End      │───▶│  Rating Service  │───▶│ Collusion Check │
│   Trigger       │    │  (bereits vorh.)│    │   Service        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌──────────────────┐             │
│ Suspicious      │◀───│  Analysis        │◀────────────┘
│ Players DB      │    │  Dashboard       │
└─────────────────┘    └──────────────────┘
```

**1. Datenmodell-Erweiterungen:**
- **`player_rankings` Tabelle:** Zusätzliche Felder für Gegner-Tracking
- **`user_opponents` Tabelle:** Historie aller gespielten Gegner pro User
- **`rating_anomalies` Tabelle:** Flagging von verdächtigen Rating-Änderungen
- **`game_participants` Tabelle:** Vollständige Spieler-Liste pro Spiel (inkl. Gäste)

**2. Service-Architektur:**
- **`CollusionDetectionService`:** Kernlogik für alle Analysen
- **`OpponentDiversityCalculator`:** Berechnung von Gegner-Vielfalt
- **`RatingAnomalyDetector`:** Erkennung ungewöhnlicher Rating-Sprünge
- **`MutualInfluenceAnalyzer`:** Korrelationsanalyse zwischen Spielern

**3. Trigger-Mechanismen:**
- **Post-Game Hook:** Nach jedem Spielende automatische Analyse
- **Batch Processing:** Tägliche/nächtliche Vollanalyse aller aktiven Spieler
- **Threshold-based Alerts:** Sofortige Benachrichtigung bei kritischen Werten
- **Manual Review Trigger:** Admin kann Verdachtsfälle manuell prüfen

**4. Analyse-Algorithmen (abstrakt):**

**Opponent Diversity Score:**
```
Für jeden Spieler S:
diversity_S = (unique_registered_opponents_S / total_games_S) × 100

Wenn diversity_S < 70%:
rating_cap_S = base_rating_S × (diversity_S / 100) × 1.2
```

**Mutual Influence Detection:**
```
Für Spieler-Paar (A,B):
correlation_AB = correlation(rating_changes_A, rating_changes_B)
game_frequency_AB = games_played_together_AB / total_games_A

Wenn correlation_AB > 0.8 UND game_frequency_AB > 0.6:
Flagge als "mutual_boosting_suspicious"
```

**Rating Inflation Detection:**
```
rate_of_change = (current_rating - initial_rating) / games_played
expected_rate = calculate_expected_rate_based_on_opponent_strength

Wenn rate_of_change > expected_rate × 2.5:
Flagge als "inflation_suspicious"
```

**5. Moderations-Workflow:**
- **Automatische Flags:** System markiert suspekte Fälle
- **Admin Dashboard:** Übersicht aller Verdachtsfälle mit Details
- **Evidence Collection:** Automatische Zusammenstellung von Beweisen
- **Rating Adjustments:** Möglichkeit zur manuellen Rating-Korrektur
- **Player Notifications:** Warnungen bei wiederholten Verdachtsfällen

**6. Monitoring & Reporting:**
- **Real-time Metrics:** Live-Tracking von Diversity-Scores
- **Trend Analysis:** Entwicklung von Rating-Anomalien über Zeit
- **Group Analysis:** Identifizierung von "geschlossenen" Spielergruppen
- **Effectiveness Reports:** Wie viele Fälle wurden erkannt/korrigiert

**7. Integration mit bestehendem System:**
- **Non-Breaking:** Bestehende Rating-Berechnung bleibt unverändert
- **Opt-in Features:** Neue Checks können aktiviert/deaktiviert werden
- **Gradual Rollout:** Zuerst Monitoring, dann Intervention
- **Family-Friendly:** Berücksichtigt, dass viele Spiele familiär sind

**8. Performance-Considerationen:**
- **Caching:** Ergebnisse der Analysen cachen (1-24h)
- **Async Processing:** Schwere Analysen im Hintergrund
- **Database Indexing:** Optimierte Queries für häufige Checks
- **Scalability:** Horizontale Skalierung der Analysis-Services

**Ziel der abstrakten Implementation:** Maximale Fairness bei minimaler Beeinträchtigung legitimer Spieler, speziell angepasst an die Mehrspieler-Dynamik und familiären Spielrunden der Stechen-App. 🎯

---

## 🔮 Zukünftige Erweiterungen (noch nicht implementiert)

### Anti-Collusion-Schutz für Elo-Rating-System

**Problemstellung:** Das aktuelle Elo-System verhindert nicht, dass zwei oder mehr Spieler sich gegenseitig "hochpushen" können, indem sie nur untereinander spielen und abwechselnd gewinnen.

**Geplante Lösungsansätze:**
Siehe oben.
---

## 📊 Implementierungsstatus (Stand: Dezember 2025)

### ✅ Vollständig implementiert:
- **Kernfunktionalitäten:** Spielerverwaltung, Spielablauf, Punkteberechnung
- **Benutzeroberfläche:** Responsive Design, fixierte Spalten, farbige Hervorhebungen
- **Sicherheit:** Laravel Sanctum Auth, rollenbasierte Zugriffsrechte, CSRF-Schutz
- **Admin-Bereich:** Dashboard mit animierten Countern, Benutzerverwaltung
- **Datenverwaltung:** Persistente Speicherung in MariaDB mit Docker Volumes
- **Benutzerrollen:** Host (Standard), Player (Sanktion), Banned (Sperre)

### ⚠️ Teilweise implementiert:
- **Testing:** Noch nicht implementiert (geplant für zukünftige Versionen)
- **API-Client:** Verwendet native Fetch API statt zusätzlicher Libraries

### 🔮 Noch nicht implementiert (zukünftige Features):
- **Mehrsprachigkeit:** Laravel Localization Vorbereitung
- **Exportfunktionen:** PDF/CSV Export für Statistiken
- **Liga-System:** Passwortgeschützte Ligen und Turniere
- **Anti-Collusion-Schutz:** Elo-Rating Manipulationsschutz
- **Echtzeit-Features:** Laravel Broadcasting für Live-Updates
- **Soziale Funktionen:** Freundeslisten, Direktnachrichten

**Gesamter Implementierungsgrad:** ~85%

---

## 🤝 Contributing

Wir freuen uns über Beiträge zur Weiterentwicklung von Stechen-Helper!

### 🚀 Entwicklung beitragen

1. **Fork** das Repository
2. **Clone** deinen Fork: `git clone https://github.com/YOUR-USERNAME/dbe-final-project.git`
3. **Branch** erstellen: `git checkout -b feature/AmazingFeature`
4. **Änderungen** committen: `git commit -m 'Add some AmazingFeature'`
5. **Push** zu deinem Branch: `git push origin feature/AmazingFeature`
6. **Pull Request** erstellen

### 🐛 Bug Reports & Feature Requests

- **Issues** für Bugs und Feature-Requests verwenden
- **Detaillierte Beschreibungen** mit Screenshots wenn möglich
- **Schritt-für-Schritt Reproduktion** bei Bugs

### 📝 Code Style

- **PHP**: PSR-12 Standard
- **JavaScript**: ESLint Standard
- **CSS**: Konsistente Benennung und Struktur
- **Commits**: Englische Commit-Messages

## 🗺️ Roadmap

### ✅ Release Candidate 1.0 (Abgeschlossen)
- Vollständiges Spiel-Management
- Ranking-System mit Elo-Rating
- Admin-Dashboard
- Responsive UI
- Docker-Setup

### 🔄 Geplante Features (v1.1+)
- **Multi-Game-Support**: Gleichzeitige Spiele verwalten
- **Tournament-Mode**: Turnier-Organisation
- **Advanced Statistics**: Detaillierte Analysen
- **Mobile App**: React Native Implementation
- **Real-time Notifications**: Push-Benachrichtigungen

### 🔮 Vision (v2.0+)
- **AI-Gegner**: Computergesteuerte Spieler
- **Voice-Control**: Sprachsteuerung für Ansagen
- **Social Features**: Freundeslisten, Challenges
- **Internationalisierung**: Mehrsprachige Unterstützung
- **Cloud-Sync**: Plattformübergreifende Synchronisation

## 🤝 Contributing

Wir freuen uns über Beiträge zur Weiterentwicklung von Stechen-Helper!

### 🛡️ Branch-Schutz & Sicherheit

**❌ Direktes Pushen in `main` ist NICHT erlaubt!**
- Der `main` Branch ist **geschützt** und kann nur von Maintainern direkt modifiziert werden
- Alle Änderungen müssen über **Pull Requests** eingereicht werden
- Dies verhindert versehentliche Schäden und ermöglicht Code-Reviews

### 🚀 Entwicklung beitragen

1. **Fork** das Repository auf GitHub
2. **Clone** deinen Fork: `git clone https://github.com/YOUR-USERNAME/dbe-final-project.git`
3. **Branch** erstellen: `git checkout -b feature/AmazingFeature`
4. **Änderungen** entwickeln und testen
5. **Änderungen** committen: `git commit -m 'Add some AmazingFeature'`
6. **Push** zu deinem Branch: `git push origin feature/AmazingFeature`
7. **Pull Request** erstellen über GitHub

### 🔍 Änderungen in anderen Branches ansehen

#### Option 1: GitHub Pull Request
- Gehe zur **Pull Request** Seite des Repositories
- Wähle den gewünschten PR aus
- Klicke auf **"Files changed"** Tab
- Hier siehst du alle geänderten Dateien mit **Diff-Ansicht**
- **Kommentare** können direkt zu spezifischen Zeilen hinzugefügt werden

#### Option 2: Lokale Branch-Vergleiche
```bash
# Remote Branches anzeigen
git branch -r

# Remote Branch lokal auschecken
git checkout -b feature-branch origin/feature-branch

# Mit main vergleichen
git diff main..feature-branch

# Spezifische Datei vergleichen
git diff main..feature-branch -- path/to/file.php

# GitHub CLI verwenden (falls installiert)
gh pr diff 123  # PR #123 vergleichen
```

#### Option 3: GitHub Compare View
- Gehe zu: `https://github.com/Kighlander1975/dbe-final-project/compare/main...branch-name`
- Ersetze `branch-name` mit dem Namen des Branches
- Vollständige Diff-Ansicht aller Änderungen

### 🐛 Bug Reports & Feature Requests

- **Issues** für Bugs und Feature-Requests verwenden
- **Detaillierte Beschreibungen** mit Screenshots wenn möglich
- **Schritt-für-Schritt Reproduktion** bei Bugs
- **Labels** verwenden: `bug`, `enhancement`, `documentation`, etc.

### 📝 Code Style & Guidelines

- **PHP**: PSR-12 Standard (Laravel Coding Style)
- **JavaScript**: ESLint Standard + React Best Practices
- **CSS**: Konsistente Benennung (BEM-Methode bevorzugt)
- **Commits**: Englische Commit-Messages, präzise und beschreibend
- **Tests**: Unit-Tests für neue Features schreiben

### 🔄 Pull Request Prozess

1. **PR erstellen** mit klarer Beschreibung
2. **Automated Tests** laufen automatisch (falls konfiguriert)
3. **Code Review** durch Maintainer
4. **Feedback** einarbeiten falls nötig
5. **Merge** nach Approval

### 📞 Kontakt

Bei Fragen zum Contributing:
- **Issues** für technische Fragen
- **Discussions** für allgemeine Diskussionen
- **E-Mail** an den Repository-Owner

## 📄 Lizenz

Dieses Projekt ist unter der **MIT License** lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

## 🙏 Danksagungen

- **DBE-Academy** für die Ausbildung und Unterstützung
- **Laravel Community** für das fantastische Framework
- **React Community** für die großartige UI-Library
- **Docker Community** für die Containerisierung
- **Open Source Community** für die vielen Tools und Libraries

---

**🎯 Stechen-Helper RC 1.0** - Bereit für die finale Phase! 🚀
