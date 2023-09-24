export type customFormatedKeysDef = {
    starttime?: string; // Start Uhrzeit HH:MM
    startdate?: string; // Start Datum DD.MM
    endtime?: string; // Endzeitpunkt
    enddate?: string; // Enddatum
    startdayofweek?: string; // Start Tag der Woche
    enddayofweek?: string; // End Tag der Woche
    headline?: string; // Schlagzeile
    description?: string; // Beschreibung
    weathertext?: string; // nur Zamg wetterbeschreibender Text
    ceiling?: string; // max höhe
    altitude?: string; // min höhe
    warnlevelname?: string; // Farbe des Levels text
    warnlevelnumber?: string; // Levelhöhe
    warnlevelcolor?: string; // RGB im Hexformat
    warntypename?: string; // gelieferter Warntype
    location?: string; // gelieferte Location (meinst Unsinn)
    instruction?: string; // Anweisungen
}; /**
 * Conversion jsons as a tool for formatedKeys.
 */
export const color = {
    generic: {
        0: `#00ff00`,
        1: `#00ff00`,
        2: `#fffc04`,
        3: `#ffb400`,
        4: `#ff0000`,
        5: `#ff00ff`, // 5 - Violett Warnungen vor extremem Unwetter (nur DWD/ Weltuntergang nach aktueller Erfahrung)
    },
    zamgColor: {
        0: `#00ff00`,
        1: `#00ff00`,
        2: `#01DF3A`,
        3: `#ffc400`,
        4: `#ff0404`,
    },
    textGeneric: {
        0: 'green',
        1: 'dark green',
        2: 'yellow',
        3: 'orange',
        4: 'red',
        5: 'violet',
    },
};
export const warnTypeName = {
    zamgService: {
        0: `unbekannt1`,
        1: `Sturm`,
        2: `Regen`,
        3: `Schnee`,
        4: `Glatteis`,
        5: `Gewitter`,
        6: `Hitze`,
        7: `Kälte`,
        8: `unbekannt2`,
    },
};
export const level = {
    uwz: { green: 0, darkgreen: 0, yellow: 1, orange: 2, red: 3, violet: 4 },
};
export const dwdLevel = { minor: 1, moderate: 2, severe: 3, extreme: 4 };
