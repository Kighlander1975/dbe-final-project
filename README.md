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
  <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Status">
</p>

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
- **React.js 18+** als UI-Framework
- **Vite** als Build-Tool und Dev-Server
- **Vanilla CSS** für das Styling
- **JavaScript (ES6+)** für die Funktionalität
- **Native Fetch API** für HTTP-Requests (keine zusätzlichen Libraries wie Axios)

#### Backend
- **Laravel 12** als PHP-Framework
- **PHP 8.2+** für die Serverlogik
- **Laravel Sanctum** für API-Authentifizierung
- **RESTful API** für Frontend-Backend-Kommunikation

#### Datenbank
- **MariaDB 10.11+** für die persistente Datenspeicherung
- **Eloquent ORM** für Datenbankabfragen

#### DevOps & Deployment
- **Docker & Docker Compose** für containerisierte Entwicklung
- **Nginx** als Webserver (im Container)
- **phpMyAdmin** für Datenbankverwaltung
- **Git** für Versionskontrolle
- **Testing:** Unit- und Integrationstests noch nicht implementiert (geplant für zukünftige Versionen)

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
- Docker Desktop installiert
- Git installiert
- Mindestens 4GB freier RAM

#### Ersteinrichtung

```powershell
# 1. Repository klonen
git clone <repository-url>
cd stechen-helper

# 2. Docker-Container starten
docker-compose up -d

# 3. Backend initialisieren
docker exec -it stechen_backend bash
composer install
php artisan key:generate
php artisan migrate
exit

**Hinweis:** Für E-Mail-Funktionalität bitte die `.env`-Datei des Backends anpassen, sonst könnten Fehler auftreten.

# 4. Frontend-Dependencies installieren (falls nötig)
docker exec -it stechen_frontend npm install
```

#### Zugriff auf die Anwendung

- **Frontend**: http://localhost:3000
- **Backend-API**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080
  - Server: `stechen_database`
  - Benutzer: `stechen_user`
  - Passwort: `stechen_password`
- **Datenbank** (extern): `localhost:3307`

#### Tägliche Nutzung

**Projekt starten:**
```powershell
cd C:\WebProjects\stechen-helper
docker-compose up -d
```

**Projekt beenden:**
```powershell
docker-compose down
```

**Logs anzeigen:**
```powershell
# Alle Services
docker-compose logs -f

# Einzelner Service
docker logs stechen_frontend -f
docker logs stechen_backend -f
```

**Container-Status prüfen:**
```powershell
docker-compose ps
```

### Kernfunktionalitäten

#### 1. Spielerverwaltung
- Benutzerprofile erstellen und verwalten
- Authentifizierung und Autorisierung via Laravel Sanctum
- Spielerstatistiken und -wertungen speichern
- Persönliche Einstellungen (Avatar, Benachrichtigungen)

#### 2. Spielablauf-Management
- Spielerauswahl und Dealer-Bestimmung
- Eingabe und Verfolgung von angesagten Stichen
- Eingabe der tatsächlich erzielten Stiche
- Automatische Punkteberechnung
- Dealer-Rotation und Spielfortschritt

#### 3. Organisations-Features
- Erstellung von Einzelspielen
- Verwaltung mehrerer Spielgruppen *(noch nicht implementiert)*
- Einladungssystem für Spiele *(noch nicht implementiert)*
- Visuelle Unterscheidung pausierter Spiele: Auf der Startseite werden pausierte Spiele mit drei verschiedenen Pastellfarben (Blau, Lila, Orange) hervorgehoben, um Verwechslungen bei gleichen Spielnamen zu vermeiden
- Detaillierte Tooltips: Hover über pausierte Spiel-Buttons zeigt Spielerliste mit aktuellen Punkten und Rängen

#### 4. Statistik und Ranglisten
- Globale Einzelspieler-Ranglisten
- Spielerwertungen basierend auf vergangenen Spielen
- Detaillierte Spielstatistiken
- Ligatabellen *(noch nicht implementiert)*

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

### Datenverwaltung

- **Persistente Speicherung**: Alle Spielergebnisse werden dauerhaft in MariaDB gespeichert
- **Docker Volume**: Datenbank-Daten bleiben auch nach Container-Neustart erhalten
- **Datenstruktur**: Effiziente Datenbankstruktur mit Laravel Migrations für:
  - Spieler (ID, Name, Profilinformationen, Avatar)
  - Spiele (ID, Datum, Teilnehmer, Gewinner)
  - Runden (Spiel-ID, Rundennummer, Dealer)
  - Ergebnisse (Runden-ID, Spieler-ID, Ansage, Stiche, Punkte)
- **Skalierbarkeit**: Optimierte Eloquent-Queries für schnelle Datenverarbeitung auch bei großen Datenmengen
- **Backup**: Docker Volume `database_data` kann für Backups exportiert werden

### Sicherheit und Datenschutz

- **Authentifizierung**: Laravel Sanctum für sichere API-Token-basierte Authentifizierung
- **Autorisierung**: Rollenbasierte Zugriffsrechte via Laravel Policies (Spieler, Schriftführer, Administrator)
- **CSRF-Schutz**: Laravel CSRF-Token für alle Formulare
- **Passwort-Hashing**: Bcrypt-Verschlüsselung für Passwörter
- **Umgebungsvariablen**: Sensible Daten in `.env`-Dateien (nicht im Git)
- **Datenschutz**: Konformität mit gängigen Datenschutzrichtlinien (DSGVO-ready)

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

**Entwickelt mit ❤️ für Kartenspieler**
