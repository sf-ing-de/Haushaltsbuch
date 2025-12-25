// Funktion, die einen Datumsstring in ein Date-Objekt umwandelt
export function stringToDate(dateString, stringFormat) {
  // Variablen für Tag, Monat und Jahr initialisieren
  let day = String('');
  let month = String('');
  let year = String('');

  // Schleife durch das Format, um die entsprechenden Teile des Datums zu extrahieren
  for (let index = 0; index < stringFormat.length; index++) {
    // Überprüfen des Formats, um den Tag, Monat oder das Jahr zu bestimmen
    switch (stringFormat.toLowerCase()[index]) {
      case 'd':
        // Tag zum Day-String hinzufügen
        day = day.concat(dateString[index]);
        break;
      case 'm':
        // Monat zum Month-String hinzufügen
        month = month.concat(dateString[index]);
        break;
      case 'y':
        // Jahr zum Year-String hinzufügen
        year = year.concat(dateString[index]);
        break;
      default:
        break;
    }
  }

  // Rückgabe eines neuen Date-Objekts mit Jahr, Monat und Tag
  return new Date(year, Number(month) - 1, day);
}

// Funktion zur Änderung des Spaltenformats für Datum
export function changeColumnFormatDate(newColumnFormat, newColumnFormatDate) {
  // Definiert die Lokalisierung für das Datumsformat (Deutsch)
  const locale = 'de';
  // Optionen für die Datumformatierung
  const options = {
    'year'  : 'numeric',
    'month' : '2-digit',
    'day'   : '2-digit'
  }
  var date; 
  // Überprüft das gewählte Spaltenformat
  switch (newColumnFormat) {
    // Wenn das Format 'date' gewählt ist, wird der String in ein Datum umgewandelt und im ISO-Format ausgegeben
    case 'date':
    date = stringToDate(tmp, newColumnFormatDate).toISOString().slice(0, 10);
    // Option zur Ausgabe des Datums im lokalisierten Format (aktuell auskommentiert)
    // date = stringToDate(tmp, newColumnFormatDate.value).toLocaleDateString(locale, options);
    break;
    // Wenn das Format 'current' gewählt ist, wird der String in eine Zahl umgewandelt
    case 'current':
      date = Number(Number.parseFloat(tmp));
      break;
    // Standardfall oder Textformatierung
    case 'text':    
    default:
      tmp = String(tmp);
      break;  
  }
  // Gibt das formatierte Datum zurück
  return tmp;
}

// Funktion zur Änderung des Spaltenformats für aktuelle Werte
export function changeColumnFormatCurrent(tmp) {
  // Protokollierung des Ausgangswerts
  logger(logLevel.DEBUG, 'tmp begin: ', tmp);

  // Konvertiert den Wert in einen String
  tmp = String(tmp);

  // Entfernt führende und folgende Leerzeichen
  tmp = tmp.trim(); 
  // Entferne alle Zeichen außer Ziffern, Komma, Punkt und - am Anfang
  tmp = tmp.replace(/[^\d,.\-]/g, ''); 

  // Überprüft, ob das letzte Komma vor den letzten drei Ziffern vorkommt
  if (tmp.includes(',', tmp.length - 3) == true){
    // Entfernt den Punkt für die Formatierung und ersetzt das Komma durch einen Punkt
    tmp = tmp.replace('.', '');
    tmp = tmp.replace(',', '.');
  } else {
    // Entfernt den Punkt und ersetzt ihn durch ein Komma
    tmp = tmp.replace(',', '');
    tmp = tmp.replace('.', ',');
  }

  // Überprüfung, ob ein alternativer Formatwert für aktuelle Werte gewählt wurde
  if (newColumnFormatCurrentAlternate.value == 'yes'){
    // Wenn der Wert negativ ist, wird das Minuszeichen entfernt
    if (tmp[0] == '-') {
      tmp = tmp.substring(1);
    } else {
      // Andernfalls wird ein Minuszeichen vorangestellt
      tmp = '-'.concat(tmp);
    }
  }

  // Überprüft, ob das gewählte Trennzeichen ein Komma ist
  if (newColumnFormatCurrentSeperator.value == ','){
    // Ersetzt Punkt durch ein temporäres Zeichen
    tmp = tmp.replace('.', '!');

    // Ersetzt das Komma durch einen Punkt
    tmp = tmp.replace(',', '.');

    // Setzt das temporäre Zeichen wieder auf ein Komma
    tmp = tmp.replace('!', ',');
  }

  // Gibt den formatierten Wert als String zurück
  return String(tmp);
}

// Funktion zur Änderung des Spaltenformats basierend auf dem aktuellen Format
export function changeColumnFormat(tmp) {
  // Überprüfung des gewählten Spaltenformats
  switch (newColumnFormat.value) {
    // Wenn das Format 'date' gewählt ist, wird die Datumformatierungsfunktion aufgerufen
    case 'date':
      tmp = changeColumnFormatDate(tmp);
      break;
  
    // Wenn das Format 'current' gewählt ist, wird die aktuelle Formatierungsfunktion aufgerufen
    case 'current':
      tmp = changeColumnFormatCurrent(tmp);
      break;
  
    // Standardfall, hier passiert nichts
    default:
      break;
  }

  // Gibt den eventuell formatierten Wert zurück
return tmp;
}

// Exportiere alle Funktionen als Standardobjekt
export default {
  stringToDate,
  changeColumnFormatDate,
  changeColumnFormatCurrent,
  changeColumnFormat
};