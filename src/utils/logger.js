
// Definierte Log-Level (kannst du erweitern)
export const logLevel = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
};

// Aktuelles Log-Level (standardmäßig DEBUG)
let currentLogLevel = logLevel.DEBUG;

/**
 * Setzt das aktuelle Log-Level.
 * @param {number} level - Eine der logLevel Konstanten.
 */
export function setLogLevel(level) {
  if (Object.values(logLevel).includes(level)) {
    currentLogLevel = level;
  } else {
    console.warn(`Logger: Unbekanntes Log-Level ${level}, Level bleibt unverändert.`);
  }
}

/**
 * Logger-Funktion mit Level-Filter und farbiger Konsolenausgabe.
 * 
 * @param {number} level - Log-Level z.B. logLevel.DEBUG
 * @param  {...any} args - args wie bei console.log
 */
export function logger(level, ...args) {
  if (level >= currentLogLevel) {
    const colorMap = {
      [logLevel.DEBUG]: 'color: gray',
      [logLevel.INFO]: 'color: blue',
      [logLevel.WARN]: 'color: orange',
      [logLevel.ERROR]: 'color: red; font-weight: bold',
    };
    const prefixMap = {
      [logLevel.DEBUG]: '[DEBUG]',
      [logLevel.INFO]: '[INFO]',
      [logLevel.WARN]: '[WARN]',
      [logLevel.ERROR]: '[ERROR]',
    };
    const style = colorMap[level] || '';
    const prefix = prefixMap[level] || '[LOG]';
    console.log(`%c${prefix}`, style, ...args);
  }
}