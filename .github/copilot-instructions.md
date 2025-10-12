# Copilot Instructions für Haushaltsbuch (Vue 3 + Vite)

## Architektur & Hauptkomponenten
- Single-Page-App mit Vue 3, Einstiegspunkt: `src/App.vue`.
- Hauptfunktion: CSV-Dateien einlesen, bearbeiten und als neue CSV exportieren.
- UI-Logik und Datenmanipulation sind in `App.vue` gebündelt (kein Vuex, keine Router-Struktur).
- Externe Bibliothek: [PapaParse](https://www.papaparse.com/) für CSV-Parsing und -Export.

## Entwickler-Workflows
- **Entwicklung starten:**
  ```powershell
  npm install; npm run dev
  ```
- **Build für Produktion:**
  ```powershell
  npm run build
  ```
- **Preview des Builds:**
  ```powershell
  npm run preview
  ```
- Hot-Reload ist standardmäßig aktiv (Vite).

## Projekt-spezifische Konventionen
- Komponenten liegen direkt in `src/` (z.B. `App.vue`, `tmp.vue`, `tmp2.vue`).
- CSV-Handling: Spalten können hinzugefügt, formatiert (Datum, Währung, Text) und gelöscht werden.
- UI-Interaktionen (z.B. Doppelklick auf Spaltennamen zum Löschen) sind direkt im Template implementiert.
- Keine globale State-Management-Lösung, alle States sind lokale `ref`-Objekte.
- Encoding und Zeilenskip für CSV-Import sind konfigurierbar.

## Integration & externe Abhängigkeiten
- PapaParse wird für alle CSV-Operationen verwendet (Parsing, Unparsing, Download).
- Keine Backend-Integration, alle Datenverarbeitung erfolgt clientseitig.
- Vite als Build-Tool, keine spezielle Konfiguration außer Standard.

## Beispiele für Muster
- **CSV-Import:**
  ```js
  Papa.parse(fileObject.value, { ... })
  ```
- **CSV-Export:**
  ```js
  Papa.unparse(fileContentNew.value, papaConfig)
  ```
- **Spalte löschen:**
  ```js
  fileContentNew.value[index].splice(header - 1, 1)
  ```

## Wichtige Dateien & Verzeichnisse
- `src/App.vue`: Hauptlogik und UI
- `package.json`: Build-Skripte und Abhängigkeiten
- `README.md`: Basis-Setup und Build-Befehle

## Hinweise für AI Agents
- Fokus auf UI-Logik und CSV-Datenmanipulation.
- Keine serverseitigen Komponenten oder API-Calls.
- Erweiterungen sollten sich an die bestehende Struktur in `App.vue` halten.
- Für neue Features: Muster aus `App.vue` übernehmen (z.B. lokale `ref`, Methodenstruktur, Template-Events).
