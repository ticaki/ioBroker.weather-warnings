"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var test_warnings_exports = {};
__export(test_warnings_exports, {
  getTestData: () => getTestData,
  useTestData: () => useTestData
});
module.exports = __toCommonJS(test_warnings_exports);
function useTestData() {
  return true;
}
const testData = {
  uwzService: {
    results: [
      {
        center: "UWZ",
        areaID: "UWZDE49809",
        dtgEnd: 1695337200,
        areaType: "UWZCODE",
        dtgStart: 1695301200,
        payload: {
          translationsLongText: {
            DE: "Ab Donnerstagnachmittag sind mit der Ankunft einer kr\xE4ftigen Kaltfront von EX-Hurrikan-LEE Gewitter m\xF6glich. Dabei besteht die Gefahr von Starkregen mit Mengen zwischen 10 und 15 l/m^2 und Sturmb\xF6en um 75 km/h, lokal auch etwas mehr. Donnerstagnacht l\xE4sst die Schauer- und Gewitterneigung wieder nach."
          },
          id: "16952761158501.6",
          creation: 1695276614e3,
          uwzLevel: 7,
          translationsShortText: {
            DE: "Gewitter aus SW mit Starkregen und Sturmb\xF6en."
          },
          fileName: "meteogroup_warn_16952761158501_20230921060814_1695337200_1695276614.xml",
          levelName: "alert_forewarn_orange",
          shortText: "Thunderstorms.",
          longText: "From Thursday afternoon thunderstorms may occur. The risk of heavy rain and violent gusts arises, thereby. Thursday night the risk of thunderstorms decreases.",
          altMin: -10,
          altMax: 9e3
        },
        severity: 7,
        type: 7
      },
      {
        center: "UWZ",
        areaID: "UWZDE55422",
        dtgEnd: 1695317400,
        areaType: "UWZCODE",
        dtgStart: 1695313800,
        payload: {
          translationsLongText: {
            DE: "Am 21.09.2023 um 18:30 Uhr wurde ein Gewitter der Stufe Orange registriert, dessen Schwerpunkt sich im Bereich Veitsrodt befindet. Es kommt aus S\xFCdwest und bewegt sich mit einer Geschwindigkeit von 79 km/h in nord\xF6stliche Richtung. Es sind lokal Starkregen und einzelne Sturmb\xF6en m\xF6glich. Punktuell ist auch kleink\xF6rniger Hagel nicht auszuschlie\xDFen. Die Blitzaktivit\xE4t ist hoch. Folgende Orte befinden sich auf der weiteren Zugbahn des Gewitters: Rhaunen (18:30), Kirchberg (Hunsr\xFCck) (18:35), Simmern/ Hunsr\xFCck (18:41), Rheinb\xF6llen (18:51), Oberwesel (18:55), Bornich (19:03), Miehlen (19:07). Angegeben ist die Ankunftszeit des Gewitters in dem Ort."
          },
          id: "16953140380002",
          creation: 16953138e5,
          uwzLevel: 10,
          translationsShortText: {
            DE: "Gewitter mit Starkregen, (kleiner Hagel und Sturmb\xF6en sind m\xF6glich)"
          },
          fileName: "meteogroup_warn_16953140380002_20230921163000_1695317400_1695314047.xml",
          levelName: "alert_warn_orange",
          shortText: "Warning ORANGE: thunderstorms - heavy rain",
          longText: "On 2023/09/21 at 18:30 local time a severe thunderstorm of level orange was detected. The center is located in the community of Veitsrodt. The storm is approaching from southwest and is moving in northeastern direction at a speed of 79 km/h. Regional heavy rain and isolated storm gusts are possible. Local hail of small size can not be ruled out. The lightning activity is high. The severe thunderstorm is expected to cross the following communities: Rhaunen (18:30), Kirchberg (Hunsr\xFCck) (18:35), Simmern/ Hunsr\xFCck (18:41), Rheinb\xF6llen (18:51), Oberwesel (18:55), Bornich (19:03), Miehlen (19:07). The arrival time of the storm is stated.",
          altMin: -10,
          altMax: 9e3
        },
        severity: 10,
        type: 7
      }
    ],
    cached: 1
  },
  dwdService: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "Warnungen_Gemeinden.807133073.2.49.0.0.276.0.DWD.PVW.1695315000000.a9404042-2094-45eb-96f0-7d87558b0d14.DEU",
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [7.4595, 49.8209],
                [7.429, 49.8096],
                [7.4329, 49.8006],
                [7.4445, 49.8027],
                [7.4485, 49.7973],
                [7.465, 49.8037],
                [7.4635, 49.8121],
                [7.4755, 49.8163],
                [7.4595, 49.8209]
              ]
            ]
          ]
        },
        geometry_name: "THE_GEOM",
        properties: {
          AREADESC: "Oberhausen/Kirn",
          NAME: "Gemeinde Oberhausen bei Kirn",
          WARNCELLID: 807133073,
          IDENTIFIER: "2.49.0.0.276.0.DWD.PVW.1695315000000.a9404042-2094-45eb-96f0-7d87558b0d14.DEU",
          SENDER: "opendata@dwd.de",
          SENT: "2023-09-21T16:50:00Z",
          STATUS: "Actual",
          MSGTYPE: "Update",
          SOURCE: "PVW",
          SCOPE: "Public",
          CODE: "id:2.49.0.0.276.0.DWD.PVW.1695315000000.a9404042-2094-45eb-96f0-7d87558b0d14",
          LANGUAGE: "de-DE",
          CATEGORY: "Met",
          EVENT: "STARKES GEWITTER",
          RESPONSETYPE: "Prepare",
          URGENCY: "Immediate",
          SEVERITY: "Moderate",
          CERTAINTY: "Likely",
          EC_PROFILE: "2.1.13",
          EC_LICENSE: "\xA9 GeoBasis-DE / BKG 2021 (Daten modifiziert)",
          EC_II: "38",
          EC_GROUP: "THUNDERSTORM;WIND;RAIN;HAIL",
          EC_AREA_COLOR: "251 140 0",
          EFFECTIVE: "2023-09-21T16:50:00Z",
          ONSET: "2023-09-21T16:50:00Z",
          EXPIRES: "2023-09-21T17:30:00Z",
          SENDERNAME: "Deutscher Wetterdienst",
          HEADLINE: "Amtliche WARNUNG vor STARKEM GEWITTER",
          DESCRIPTION: "Es treten Gewitter auf. Dabei gibt es Sturmb\xF6en mit Geschwindigkeiten zwischen 65 km/h (18 m/s, 35 kn, Bft 8) und 85 km/h (24 m/s, 47 kn, Bft 9) sowie Starkregen mit Niederschlagsmengen zwischen 15 l/m\xB2 und 25 l/m\xB2 pro Stunde und kleink\xF6rnigen Hagel.",
          INSTRUCTION: "ACHTUNG! Hinweis auf m\xF6gliche Gefahren: \xD6rtlich kann es Blitzschlag geben. Bei Blitzschlag besteht Lebensgefahr! Vereinzelt k\xF6nnen beispielsweise B\xE4ume entwurzelt und D\xE4cher besch\xE4digt werden. Achten Sie besonders auf herabst\xFCrzende \xC4ste, Dachziegel oder Gegenst\xE4nde. W\xE4hrend des Platzregens sind kurzzeitig Verkehrsbehinderungen m\xF6glich.",
          WEB: "https://www.wettergefahren.de",
          CONTACT: "Deutscher Wetterdienst",
          PARAMETERNAME: "gusts;precipitation;hail",
          PARAMETERVALUE: "65-85 [km/h];15-25 [l/m\xB2 in 1h];<2 [cm]",
          ALTITUDE: 0,
          CEILING: 9842.5197
        },
        bbox: [7.429, 49.7973, 7.4755, 49.8209]
      },
      {
        type: "Feature",
        id: "Warnungen_Gemeinden.807133073.2.49.0.0.276.0.DWD.PVW.1695300180000.d7e89266-cce4-4d25-be40-cc7ea987b822.DEU",
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [7.4595, 49.8209],
                [7.429, 49.8096],
                [7.4329, 49.8006],
                [7.4445, 49.8027],
                [7.4485, 49.7973],
                [7.465, 49.8037],
                [7.4635, 49.8121],
                [7.4755, 49.8163],
                [7.4595, 49.8209]
              ]
            ]
          ]
        },
        geometry_name: "THE_GEOM",
        properties: {
          AREADESC: "Oberhausen/Kirn",
          NAME: "Gemeinde Oberhausen bei Kirn",
          WARNCELLID: 807133073,
          IDENTIFIER: "2.49.0.0.276.0.DWD.PVW.1695300180000.d7e89266-cce4-4d25-be40-cc7ea987b822.DEU",
          SENDER: "opendata@dwd.de",
          SENT: "2023-09-21T12:43:00Z",
          STATUS: "Actual",
          MSGTYPE: "Alert",
          SOURCE: "PVW",
          SCOPE: "Public",
          CODE: "id:2.49.0.0.276.0.DWD.PVW.1695300180000.d7e89266-cce4-4d25-be40-cc7ea987b822",
          LANGUAGE: "de-DE",
          CATEGORY: "Met",
          EVENT: "WINDB\xD6EN",
          RESPONSETYPE: "Prepare",
          URGENCY: "Immediate",
          SEVERITY: "Minor",
          CERTAINTY: "Likely",
          EC_PROFILE: "2.1.13",
          EC_LICENSE: "\xA9 GeoBasis-DE / BKG 2021 (Daten modifiziert)",
          EC_II: "51",
          EC_GROUP: "WIND",
          EC_AREA_COLOR: "255 235 59",
          EFFECTIVE: "2023-09-21T12:43:00Z",
          ONSET: "2023-09-21T14:00:00Z",
          EXPIRES: "2023-09-21T18:00:00Z",
          SENDERNAME: "Deutscher Wetterdienst",
          HEADLINE: "Amtliche WARNUNG vor WINDB\xD6EN",
          DESCRIPTION: "Es treten Windb\xF6en mit Geschwindigkeiten bis 60 km/h (17 m/s, 33 kn, Bft 7) aus s\xFCdwestlicher Richtung auf. In Schauern\xE4he muss mit Sturmb\xF6en bis 70 km/h (20 m/s, 38 kn, Bft 8) gerechnet werden.",
          INSTRUCTION: null,
          WEB: "https://www.wettergefahren.de",
          CONTACT: "Deutscher Wetterdienst",
          PARAMETERNAME: "wind direction;gusts;exposed gusts",
          PARAMETERVALUE: "south-west;<60 [km/h];<70 [km/h]",
          ALTITUDE: 0,
          CEILING: 9842.5197
        },
        bbox: [7.429, 49.7973, 7.4755, 49.8209]
      }
    ],
    totalFeatures: 2,
    numberMatched: 2,
    numberReturned: 2,
    timeStamp: "2023-09-21T16:51:33.363Z",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:EPSG::4326"
      }
    },
    bbox: [7.429, 49.7973, 7.4755, 49.8209]
  },
  zamgService: {
    geometry: {
      coordinates: [
        [
          [
            [384585, 433660],
            [383852, 433151],
            [383353, 431290],
            [381870, 431179],
            [381618, 430396],
            [380698, 430219],
            [381e3, 428437],
            [380389, 428026],
            [379528, 429216],
            [378733, 428975],
            [377449, 428213],
            [376839, 428521],
            [376244, 428028],
            [375204, 429168],
            [375478, 430774],
            [374918, 431904],
            [374015, 432973],
            [375562, 435648],
            [374291, 437012],
            [375356, 438182],
            [375224, 439501],
            [376004, 438505],
            [376315, 438780],
            [376638, 438525],
            [376791, 437628],
            [377754, 436732],
            [379339, 437129],
            [379600, 438185],
            [380049, 437462],
            [381161, 437414],
            [381213, 436754],
            [381715, 436476],
            [381139, 435747],
            [381743, 434517],
            [382731, 434774],
            [383318, 433882],
            [384585, 433660]
          ]
        ]
      ],
      type: "MultiPolygon"
    },
    properties: {
      location: {
        properties: {
          gemeindenr: 50101,
          name: "Salzburg",
          urlname: "salzburg"
        },
        type: "Municipal"
      },
      warnings: [
        {
          properties: {
            auswirkungen: "* Kleine Muren, lokal \xFCberflutete Stra\xDFen\n* Punktuell kann es zu \xDCberschwemmungen kommen, Keller k\xF6nnen \xFCberflutet werden.\n* Blitzschlag kann zu Stromausf\xE4llen f\xFChren und Geb\xE4ude oder B\xE4ume in Brand stecken.\n* Aufgrund von Sturmb\xF6en k\xF6nnen Gegenst\xE4nde herumgewirbelt werden, \xC4ste abbrechen und vereinzelt auch B\xE4ume umfallen.",
            begin: "18.09.2023 17:00",
            chgid: 0,
            create: "2023-09-17 07:00:00+00",
            empfehlungen: "* Schlie\xDFen Sie Fenster, T\xFCren und Garagentore sowie Dachfenster und Lichtkuppeln!\n* Verlassen Sie bei einem herannahenden Gewitter umgehend Gew\xE4sser!\n* Suchen Sie vor allem im Gebirge rechtzeitig Schutz!\n* Beachten Sie Gewitter- und Sturmwarnungen an Seen!",
            end: "18.09.2023 23:00",
            meteotext: "Im Vorfeld einer Kaltfront bilden sich ab dem sp\xE4teren Nachmittag bzw. in der ersten Nachth\xE4lfte teils kr\xE4ftige Gewitter. Eine Hauptgefahr sind Sturmb\xF6en aus West. Auch Hagel und Starkregen k\xF6nnen gebietsweise dabei sein.",
            rawinfo: {
              end: "1695070800",
              start: "1695049200",
              wlevel: 1,
              wtype: 5
            },
            text: "Gelbe Gewitterwarnung von Mo, 18.09.2023 17:00 bis Mo, 18.09.2023 23:00",
            updategrund: "",
            verlaufid: 1,
            warnid: 4265,
            warnstufeid: 1,
            warntypid: 5
          },
          type: "Warning"
        },
        {
          properties: {
            auswirkungen: "* Kleine Muren, lokal \xFCberflutete Stra\xDFen\n* Punktuell kann es zu \xDCberschwemmungen kommen, Keller k\xF6nnen \xFCberflutet werden.\n* Blitzschlag kann zu Stromausf\xE4llen f\xFChren und Geb\xE4ude oder B\xE4ume in Brand stecken.\n* Aufgrund von Sturmb\xF6en k\xF6nnen Gegenst\xE4nde herumgewirbelt werden, \xC4ste abbrechen und vereinzelt auch B\xE4ume umfallen.",
            begin: "18.09.2023 17:00",
            chgid: 0,
            create: "2023-09-17 07:00:00+00",
            empfehlungen: "* Schlie\xDFen Sie Fenster, T\xFCren und Garagentore sowie Dachfenster und Lichtkuppeln!\n* Verlassen Sie bei einem herannahenden Gewitter umgehend Gew\xE4sser!\n* Suchen Sie vor allem im Gebirge rechtzeitig Schutz!\n* Beachten Sie Gewitter- und Sturmwarnungen an Seen!",
            end: "18.09.2023 23:00",
            meteotext: "Im Vorfeld einer Kaltfront bilden sich ab dem sp\xE4teren Nachmittag bzw. in der ersten Nachth\xE4lfte teils kr\xE4ftige Gewitter. Eine Hauptgefahr sind Sturmb\xF6en aus West. Auch Hagel und Starkregen k\xF6nnen gebietsweise dabei sein.",
            rawinfo: {
              end: "1695070800",
              start: "1695049200",
              wlevel: 3,
              wtype: 4
            },
            text: "Gelbe Gewitterwarnung von Mo, 18.09.2023 17:00 bis Mo, 18.09.2023 23:00",
            updategrund: "",
            verlaufid: 1,
            warnid: 4266,
            warnstufeid: 3,
            warntypid: 4
          },
          type: "Warning"
        }
      ]
    },
    type: "Feature"
  }
};
function getTestData(service, _that) {
  const result = JSON.parse(JSON.stringify(testData));
  if (service == "dwdService") {
    for (const i in testData.dwdService.features) {
      const f = testData.dwdService.features[i];
      const start = Date.now() + Math.random() * 12e5 + 6e4;
      if (new Date(f.properties.EXPIRES).getTime() + 36e5 < start) {
        f.properties.ONSET = new Date(start).toJSON();
        f.properties.EXPIRES = new Date(start + Math.random() * 24e5 + 3e5).toJSON();
      }
      if (new Date(f.properties.EXPIRES).getTime() < Date.now()) {
        result.dwdService.features[i] = null;
      } else {
        result.dwdService.features[i] = testData.dwdService.features[i];
      }
    }
    for (let i = result.dwdService.features.length - 1; i >= 0; i--) {
      if (result.dwdService.features[i] == null)
        result.dwdService.features.splice(i, 1);
    }
    return result.dwdService;
  } else if (service == "uwzService") {
    for (const i in testData.uwzService.results) {
      const f = testData.uwzService.results[i];
      const start = Date.now() + Math.random() * 12e5 + 6e4;
      if (f.dtgEnd * 1e3 + 36e5 < start) {
        f.dtgStart = new Date(start).getTime() / 1e3;
        f.dtgEnd = new Date(start + Math.random() * 24e5 + 3e5).getTime() / 1e3;
      }
      if (f.dtgEnd < Date.now() / 1e3) {
        result.uwzService.results[i] = null;
      } else {
        result.uwzService.results[i] = testData.uwzService.results[i];
      }
    }
    for (let i = result.uwzService.results - 1; i >= 0; i--) {
      if (result.uwzService.results[i] == null)
        result.uwzService.results.splice(i, 1);
    }
    return result.uwzService;
  } else if (service == "zamgService") {
    for (const i in testData.zamgService.properties.warnings) {
      const f = testData.zamgService.properties.warnings[i];
      const start = Date.now() + Math.random() * 12e5 + 6e4;
      if (Number(f.properties.rawinfo.end) * 1e3 + 36e5 < start) {
        f.properties.rawinfo.start = (new Date(start).getTime() / 1e3).toString();
        f.properties.rawinfo.start = (new Date(start + Math.random() * 24e5 + 3e5).getTime() / 1e3).toString();
      }
      if (Number(f.properties.rawinfo.end) * 1e3 < Date.now()) {
        result.zamgService.properties.warnings[i] = null;
      } else {
        result.zamgService.properties.warnings[i] = testData.zamgService.properties.warnings[i];
      }
    }
    for (let i = result.zamgService.properties.warnings - 1; i >= 0; i--) {
      if (result.zamgService.properties.warnings[i] === null)
        result.zamgService.properties.warnings.splice(i, 1);
    }
    return testData.zamgService;
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTestData,
  useTestData
});
//# sourceMappingURL=test-warnings.js.map
