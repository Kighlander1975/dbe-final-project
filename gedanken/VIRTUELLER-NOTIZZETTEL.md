# Virtueller Spiel-Notizzettel - Offizielle Spezifikation

## 🎯 Überblick

Dieses Dokument beschreibt den **virtuellen Spiel-Notizzettel** für die Stechen-Helper App. Er ersetzt den traditionellen Papier-Notizzettel und ermöglicht eine digitale, interaktive Spielverfolgung mit Touch-Gesten und automatischer Validierung.

## 🎮 Spiel-Beispiel

**Spiel:** Stechen-Abend bei Familie Müller
**Datum:** 10. Dezember 2025
**Spieler:** Spieler 1, Spieler 2, Spieler 3, Spieler 4, Spieler 5
**Regeln:** Standard Stechen, 5 Spieler, 9 Karten/Spieler
**Siegbedingung:** 110 Punkte (100 + 10 für heutiges Datum)

## 📊 Spiel-Tabelle

### Aktueller Stand (Runde 4)

| Spieler | R1-Ans | R1-Erg | R2-Ans | R2-Erg | R3-Ans | R3-Erg | R4-Ans | R4-Erg | Gesamt | Rang |
|---------|--------|--------|--------|--------|--------|--------|--------|--------|--------|------|
| Spieler 1 | 2 | 1 | 3 | 3 | 0 | 2 | 2 | - | 16 | 3 |
| Spieler 2 (SD) | 4 | 1 | 2 | 3 | 0 | 4 | 3 | - | 8 | 4 |
| Spieler 3 | 2 | 2 | 1 | 1 | 1 | 2 | 3 | - | 25 | 1 |
| Spieler 4 | 3 | 4 | 0 | 0 | 3 | 0 | 4 | - | 24 | 2 |
| Spieler 5 (AD) | 0 | 1 | 1 | 2 | 3 | 1 | 1 | - | 4 | 5 |

**Aktuelle Runde:** 4
**Aktueller Dealer (AD):** Spieler 5
**Start Dealer (SD):** Spieler 2 (zufällig gewählt)

### Zusätzliche Notizen
- Besondere Ereignisse: Anzahl eingehaltener "NULL" Ansagen: 2

## 🎨 Darstellung im Spiel

### Layout-Struktur
```
┌─────────────────────────────────────────────────────────────┐
│ Spieler  │ Runden (scrollable) │ Gesamt │ Rang │
├─────────┼──────────────────────┼────────┼──────┤
│ Fix     │ ←── Swipe-able ──→  │ Fix    │ Fix  │
│ Links   │                      │ Rechts │ Rechts│
└─────────┴──────────────────────┴────────┴──────┘
```

### Responsive Design
- **Desktop/Tablet:** Komplette Tabelle sichtbar
- **Mobile:** Runden horizontal scrollen, fixe Spalten bleiben sichtbar
- **Touch-Gesten:** Swipe zwischen Runden, Doppel-Tap zum Editieren

### Interaktive Elemente
- **Editierbare Felder:** Ansage (Ans.) und Ergebnis (Erg.) der aktuellen Runde
- **Nicht editierbar:** Abgeschlossene Runden (grau dargestellt)
- **Dealer-Markierung:** (SD) für Start-Dealer, (AD) für aktuellen Dealer

## 🎯 Spiel-Flow

### Runden-Ablauf
1. **Ansage-Phase:** Alle Spieler geben ihre Ansagen ab (0-9 Stiche)
2. **Eingabe bestätigen:** Button wird aktiv, wenn alle Ansagen eingegeben
3. **Ergebnis-Phase:** Tatsächliche Stiche werden eingetragen
4. **Runden-Abschluss:** Neue Runde wird automatisch erstellt oder Spiel endet

### Siegbedingungen
- Spiel endet, wenn ein Spieler die Siegbedingung erreicht
- Neue Runde wird automatisch hinzugefügt, wenn Siegbedingung nicht erreicht
- Dealer wechselt automatisch nach jeder Runde

## 🔧 Technische Anforderungen

### Tabellen-Struktur
- **Fixe Spalten:** Spieler (links), Gesamt + Rang (rechts)
- **Scrollable Bereich:** Runden-Spalten (Ans./Erg. pro Runde)
- **Automatisches Layout:** Passt sich an verfügbaren Platz an

### Interaktionen
- **Bearbeitung:** Doppelklick/Tippen öffnet Modal
- **Validierung:** Clientseitig + serverseitig
- **Touch-Gesten:** Swipe für Navigation, Long-Press für Menüs
- **Responsive:** Funktioniert auf allen Geräten

### Daten-Management
- **Echtzeit-Speicherung:** Automatisches Speichern bei Änderungen
- **Offline-Modus:** Funktioniert ohne Internet
- **Synchronisation:** Daten werden zwischen Geräten abgeglichen

## 🎮 Buttons & Aktionen

### "Eingaben bestätigen"
- **Status:** Disabled bis alle Eingaben korrekt
- **Funktion:** Wechselt zwischen Ansage- und Ergebnis-Phase
- **Validierung:** Prüft alle Eingaben der aktuellen Phase

### "Spiel abbrechen"
- **Funktion:** Spiel pausieren oder beenden
- **Optionen:** Später fortsetzen oder komplett verwerfen
- **Navigation:** Zurück zu "Neues Spiel" mit gespeicherten Daten

---

## 📋 Technische ToDo-Liste

### Phase 1: Grundgerüst
- [x] React-Komponente `GameTable` erstellen
- [x] Basis-Layout mit fixen und scrollbaren Spalten implementieren
- [x] Datenstruktur für Spieler, Runden und Punkte definieren
- [x] State-Management für Spiel-Status (aktiv, pausiert, beendet)
- [x] Responsive Design für Desktop/Tablet/Mobile
- [x] Sticky-Elemente (Header, Buttons, Spalten)
- [x] Drag-to-Scroll für Desktop
- [x] Touch-Scrolling für Mobile (versteckte Scrollbars)
- [x] Dynamische Daten aus vorheriger Seite
- [x] Caching für Spiel-Daten (keine API-Calls während Spiel)

### Phase 2: Tabellen-Funktionalität
- [x] Erste Runde ohne Daten hinzugefügt (Phase 2 Start)
- [x] Scrollbare Runden-Ansicht implementieren (bereits funktional)
- [x] Zell-Editierung mit Doppelklick/Tap aktivieren
- [x] Modal-Komponente für Eingabe erstellen (große Schrift, zentriert)
- [x] Validierung für Ansagen (0-9) und Ergebnisse (logische Verteilung)

### Phase 3: Spiel-Logik
- [x] Dealer-System implementieren (zufällige Auswahl, automatischer Wechsel)
- [x] Runden-Status verwalten (aktiv, abgeschlossen, editierbar)
- [x] Siegbedingungs-Prüfung integrieren
- [x] Automatisches Hinzufügen neuer Runden
- [x] Punkteberechnung nach Stechen-Regeln (exakte Ansage +10, 0-0=20)
- [x] Live-Ranking mit übersprungenen Rängen bei Gleichstand
- [x] Visuelle Evaluierung: FontSize 1.8rem für abgeschlossene Runden, Farben (gelb=korrekt, rot=falsch) nach Rundenabschluss
- [x] Auto-Vervollständigung: Letztes Feld automatisch füllen, fehlende auf 0 setzen
- [x] Korrekturmöglichkeit mit temporärer Überschreitung der Summe
- [x] Zwei-Phasen-Runden: Ansagen → Ergebnisse

### Phase 4: Touch-Gesten & Mobile
- [x] Swipe-Gesten für Runden-Navigation (react-use-gesture)
- [x] Touch-Feedback und Vibration hinzufügen
- [x] Responsive Design für alle Bildschirmgrößen
- [x] Mobile-Optimierung (Touch-Ziele mind. 44px, numerische Tastatur)

### Phase 5: Daten & Persistenz
- [ ] Lokale Speicherung mit IndexedDB
- [ ] Automatisches Speichern bei Änderungen
- [ ] Daten-Export/Import Funktionalität
- [ ] Synchronisation mit Backend (falls online)

### Phase 6: UX-Polish
- [ ] Ladezustände und Fehlerbehandlung
- [ ] Undo/Redo Funktionalität
- [ ] Statistiken und Spielzusammenfassung
- [ ] Accessibility (Screenreader, Tastatur-Navigation)

### Phase 7: Testing & Deployment
- [ ] Unit-Tests für Spiel-Logik
- [ ] Integration-Tests für Touch-Gesten
- [ ] Cross-Browser Testing
- [ ] Performance-Optimierung

---

*Letzte Aktualisierung: 11. Dezember 2025 - Phase 4 abgeschlossen, Phase 5 bereit*
*Diese ToDo-Liste wird bei expliziter Aufforderung aktualisiert.*

