# Abschlussprojekt DBE-Academy Frontend Web Developer
### Projekt: **Stechen**-Helper

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

## Einleitung
Das **Stechen**-Helper Projekt ist eine Webanwendung, die entwickelt wird, um die Organisation und Verwaltung von dem Kartenspiel "**Stechen**" zu erleichtern. Die Anwendung soll Benutzern helfen, **Stechen**-Partien zu planen, zu verwalten und zu verfolgen, indem sie eine benutzerfreundliche Oberfläche und leistungsstarke Funktionen bietet. Diese Webanwendung wird für **Tablets und Desktop** entwickelt, aber geeignete, große Handys im Querformat werden ebenfalls unterstützt.

## Projektbeschreibung
### Die Idee
Das Kartenspiel **Stechen** ist in meiner Familie ein beliebtes Gesellschaftsspiel, das oft mit Freunden und der Familie gespielt wird. Es basiert auf dem Kartenspiel [**11er Raus**](https://amzn.eu/d/eReStgf), dessen Regeln ich gleich noch näher erläutere. Für dieses Spiel braucht man einen Schriftführer, der die Punkte mitschreibt und so später dann der Gewinner ermittelt werden kann. Und HIER kommt die App ins Spiel. Meine App soll den Papieraufwand minimieren, wenn nicht gleich eliminieren und einen schnelleren und zugleich komplett regelkonformen Ablauf zu gewährleisten. Das *tracken* einer Partie ist aber nur ein Teil der App. Mit dieser App soll man zudem auch mehrere Spielgruppen organisieren können und Ranglisten sowie Spielerstärken ermitteln.

### Die Regeln des Spiels **Stechen**
Für dieses Spiel benötigt man das oben erwähnte **11er Raus** Kartenspiel. **Stechen** ist ein Spiel für min. 2 und maximal 11 Personen. Den meisten Spielspaß hat man allerdings erst ab mindestens drei Personen.

Ziel dieses Spieles ist es, durch geschicktes Analysieren seiner Karten und ansagen seiner zu erwartenden Stiche eine bestimmte Punktzahl als erstes so schnell wie möglich zu erreichen.

Das **11er Raus** Kartenspiel besteht aus 80 Karten, aufgeteilt in 4 Farben, rot, gelb, grün und blau, zu Werten von 1-20. Daher ergibt sich auch die Höchstgrenze für Mitspieler: 11 Spieler á 7 Karten = 77 Karten, drei rest im Stack. Davon eine Karte noch als Trumpf-Karte = 78 Karten, zwei verbleibend.

Je nach Anzahl der Spieler gibt es unterschiedliche Anzahl von Karten, die die Spieler zu Beginn erhalten:
- 2 - 6 Spieler: 9 Karten
- 7 - 11 Spieler: 7 Karten

Die restlichen Karten verbleiben als Stapel, wobei noch EINE Karte als Trumpfkarte/Trumpf-Farbe aufgedeckt auf den Stapel gelegt wird.

Zu Beginn des Spieles wird der Kartengeber (Dealer) bestimmt, danach wechselt dieser pro Spielrunde im Uhrzeigersinn. Der Dealer mischt die Karten und teilt sie aus. Danach wird die Trumpfkarte aufgedeckt. Eine Runde besteht aus drei Spielabschnitten, die nun näher erläutert werden.

#### Das Ansagen
In diesem Spielabschnitt startet der Spieler **links vom Dealer** mit den Ansagen. Einen sogenannten *Stich* kann man machen, wenn man mit der ausgespielten Farbe die Höchste Zahl selbst hat oder, wenn die ausgespielte Karte keine Trumpf-Farbe ist, die höchste Trumpf-Farbenkarte auf den Tisch legt. Entscheidend ist, dass man die Farbe, die ausgespielt wurde, bedienen muss, es sei denn, man hat diese Farbe nicht. Dann kann man entweder eine Trumpf-Farbe legen und so eventuell den Stich zu bekommen oder eine andere Farbe abwerfen. Mit diesem Hintergrund *schätzt* der Spieler, wie viele Stiche er mit seinen Karten bekommt. Es sind Ansagen von 0 bis 7 (oder 9 bei Spieleranzahl kleiner sieben) möglich.

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

Der Schriftführer notiert die Punkte auf dem Zettel (später in der App) und zählt die Punkte zusammen. [Ein Beispiel eines solchen Punktezettels findet sich im Anhang/Ordner "preparation".] Sobald ein Spieler 100 Punkte + Datum erreicht hat, ist die Runde zu Ende. 100 plus Datum heißt, wenn heute z.B. der 6.11. wäre, dann ist die Gewinnmarke 106 Punkte, die es zu erreichen gilt. Haben mehrere Spieler die Gewinnmarke erreicht, dann ist derjenige Spieler, der diese Marke zuerst erreicht hat, der Gewinner.

### Glossar der Spielbegriffe

| Begriff | Erklärung |
|---------|-----------|
| **Stich** | Eine Spielrunde, bei der jeder Spieler eine Karte legt. Der Spieler mit der höchsten Karte der ausgespielten Farbe oder der höchsten Trumpf-Farbe gewinnt den Stich. |
| **Trumpf-Farbe** | Die zu Beginn des Spiels durch eine aufgedeckte Karte festgelegte Farbe, die alle anderen Farben schlägt. |
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
- Laravel 11 Framework
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
- Verwaltung mehrerer Spielgruppen
- Einladungssystem für Spiele

#### 4. Statistik und Ranglisten
- Globale Einzelspieler-Ranglisten
- Spielerwertungen basierend auf vergangenen Spielen
- Detaillierte Spielstatistiken
- Ligatabellen

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
- Horizontal scrollbarer Bereich zwischen den fixierten Spalten, der alle Rundendetails enthält und bei vielen Runden ein horizontales Scrollen ermöglicht, während die Spielernamen und Gesamtpunkte stets sichtbar bleiben
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

#### Spielleiter
- Spiele erstellen und verwalten
- Spieler einladen und hinzufügen
- Spielverlauf dokumentieren (Ansagen, Stiche, Punkte)
- Spielergebnisse finalisieren
- Spielgruppen organisieren und verwalten

#### Spieler
- An Spielen teilnehmen
- Eigenes Profil verwalten (Avatar, Einstellungen)
- Persönliche Statistiken einsehen
- Ranglisten und Ligatabellen betrachten
- Spielhistorie ansehen
- Bei Bedarf als Spielleiter fungieren (wenn nicht in aktiver Partie)

#### Administrator
- Systemeinstellungen verwalten
- Benutzerkonten verwalten
- Globale Statistiken einsehen
- Technische Probleme beheben
- Zugriff auf phpMyAdmin für Datenbankwartung

### Rollenmanagement und Zugriffslogik

- **Dynamische Rollenzuweisung**:
  - Ein Benutzer kann zwischen Spieler- und Spielleiter-Rolle wechseln
  - Ist ein Spieler in einer aktiven Partie, kann er nicht gleichzeitig als Spielleiter fungieren
  - Nach Anmeldung kann ein Spieler, der nicht in einer aktiven Partie ist, zwischen "Spiel leiten" und "Spielerprofil" wählen

- **Spielleiter-Exklusivität**:
  - Zu jedem Zeitpunkt kann nur ein Spielleiter pro Spiel/Liga aktiv sein
  - Der Spielleiter bleibt aktiv, bis er sich explizit abmeldet
  - Bei Verbindungsverlust bleibt die Spielleiter-Rolle erhalten (Session-Management)

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
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React-Komponenten
│   │   ├── pages/           # Seiten-Komponenten
│   │   ├── services/        # API-Services
│   │   ├── utils/           # Hilfsfunktionen
│   │   ├── App.jsx          # Haupt-App-Komponente
│   │   └── main.jsx         # Entry Point
│   ├── public/              # Statische Assets
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # API-Controller
│   │   │   └── Middleware/  # Custom Middleware
│   │   ├── Models/          # Eloquent Models
│   │   └── Policies/        # Authorization Policies
│   ├── database/
│   │   ├── migrations/      # Datenbank-Migrationen
│   │   └── seeders/         # Test-Daten
│   ├── routes/
│   │   ├── api.php          # API-Routen
│   │   └── web.php          # Web-Routen
│   ├── .env.example
│   └── composer.json
│
├── docker-compose.yml       # Docker-Konfiguration
├── .gitignore
└── README.md
```

---

**Entwickelt mit ❤️ für Kartenspieler**
