![Logo](admin/weather-warnings.png)
# ioBroker.weather-warnings

[![NPM version](https://img.shields.io/npm/v/iobroker.weather-warnings.svg)](https://www.npmjs.com/package/iobroker.weather-warnings)
[![Downloads](https://img.shields.io/npm/dm/iobroker.weather-warnings.svg)](https://www.npmjs.com/package/iobroker.weather-warnings)
![Number of Installations](https://iobroker.live/badges/weather-warnings-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/weather-warnings-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.weather-warnings.png?downloads=true)](https://nodei.co/npm/iobroker.weather-warnings/)

**Tests:** ![Test and Release](https://github.com/ticaki/ioBroker.weather-warnings/workflows/Test%20and%20Release/badge.svg)
![Just see what we get](https://github.com/ticaki/ioBroker.weather-warnings/workflows/Test%20and%20Release/badge.svg?event=push)
## weather-warnings adapter for ioBroker

Describe your project here. English translation will come later.


Adapter ist noch in der Anfangsphase und soll schlußendlich dieses Skript: https://forum.iobroker.net/post/385276 ersetzen.

Bis Version 0.4.x wird er weniger einen direkten Nutzen haben, sondern mehr ein "da geht die Reise hin" Ansichtsadapter sein.

#### Aktueller Umfangsumfang:
- Abruf von Wetterdaten folgender Dienste:
    - DWD Ort und Kreis
    - UWZ Postleitzahlengebiet
    - ZAMG (Österreich) Koordinaten
- Unbearbeitete Daten werden in States hinterlegt
- formatierte Daten werden in States hinterlegt
- eine Vorlagenerstellung eigenen Nachrichten ist implementiert (noch keine gute Ausgabe)
- Es gibt States in denen dies Nachrichten angezeigt werden, aber die zappen da durch und die letzte bleibt. Der Code dahinter versenden später die Pushnachrichten.
- Testmodus steht zur Verfügung, beim Nutzen dieser ist der Adapter offline und gelb.
- Abruf von Warnungen in den von den Diensten zur Verfügung gestellten Sprachen.

#### Baustellen: 
- Übersetzungen sind noch lange nicht fertig, an vielen Stellen ist englisch und deutsch gemischt.

#### Todo:
- Vereinheitlichung der Warnungen, so das sie über die Dienste vergleichbar werden.
- Unterstützung der ioBroker Sprachen an jeder Stelle
- Bereitstellung von Nutzer formatierbarem Text für die Gestaltung von z.B. Html Tabellen
- Filtern von Warnungen nach Typ und Level
- Versand der Warnungen per Mail, telegram, pushover, whatsapp 
- Unterstützung von Sayit und Alexa
- States die es erlauben bei aktiver Warnung und innerhalb des Warnzeitraums automatisch Maßnahmen zu ergreifen (ich schließe den Balkonrollladen, bei Warnungen für Starkregen, Gewitter und Sturm wenn ich nicht da bin)
- manuelles Auslösen von Pushnachrichten
- Readme schreiben
- Unterstützung von mehr als einem Warngebiet.


Feedback gerne hier.

**Verbesserungvorschläge/Feature Requests bitte als Github Issue in deutsch oder englisch.**

https://forum.iobroker.net/topic/68595/test-adapter-weather-warnings

#### Kurze Erläuterung:

![Bildschirmfoto 2023-09-24 um 19.45.19.png](/assets/uploads/files/1695577524739-bildschirmfoto-2023-09-24-um-19.45.19-resized.png) 

**formatedKeys**: Die Datenpunkte darunter kann man in eigenen Meldungen verwenden.

Was braucht ihr noch an Daten?

**messages**: Darunter befinden sich die Mitteilungen die ihr im Admin unter Template/Vorlage (ka ob schon übersetzt) einrichten könnt.

**warning**: drunter sind alle Daten die vom Dienst geliefert werden. 

Unter den Info Ordnern seht ihr ob der Adapter/der Dienst beim letzten Zugriff online war.

**Im Admin/Template**
In der Tablelle schreibt ihr ins erste Feld einen Bezeichung die sich als state später unter Message erzeugt wird, also keine Punkte oder Leerzeichen.
In das zweite Feld kommt eure Formatierung. Zur Zeit hab ich folgende Datenpunkte vorbereitet:

```
/** Bezeichnungen die in Template verwendet werden können ohne "?: string;"
     * Erste Buchstabe groß geschrieben erzeugt auch im Ergebnis, das der erste Buchstabe großgeschrieben ist.
     * Ist der letzte Buchstabe großgeschrieben, wird die komplette Zeichenkette in Großbuchstaben umgewandelt.
     */
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
        warnlevelname?: string; // Textbezeichnung des Levels
        warnlevelnumber?: string; // Levelhöhe
        warnlevelcolorname?: string; // Farbbezeichnung des Levels
        warnlevelcolorhex?: string; // RGB im Hexformat
        warntypename?: string; // gelieferter Warntype
        location?: string; // gelieferte Location (meinst Unsinn)
        instruction?: string; // Anweisungen
        /** unix timestamp of start time for internal use */
        startunixtime?: string;
    };
```
Eine formatierte Nachricht könnte dann z.B. vorerst so aussehen:

```
Warnung: ${Warntypename} am ${startdayofweek} um ${starttime} Stufe: ${warnlevelnamE}
```

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->
### 0.2.2-alpha1.0 (2023-09-26)
* (ticaki) more CustomTokens,
* translations for warntypes, warnlevelcolor,
* total active warningcounts
* remove old warnings

### 0.2.1-alpha.0 (2023-09-25)
* (ticaki) initial release

## License
MIT License

Copyright (c) 2023 ticaki <github@renopoint.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.