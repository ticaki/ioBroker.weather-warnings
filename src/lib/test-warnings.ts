import type WeatherWarnings from '../main';
import type { DataImportType } from './def/provider-def';

export function useTestData(): boolean {
    return true;
}

export const defaultData = {
    uwzService: {
        center: 'UWZ',
        areaID: '',
        dtgEnd: 1,
        areaType: '',
        dtgStart: 1,
        payload: {
            translationsLongText: {
                DE: '',
            },
            id: '1.6',
            creation: 1,
            uwzLevel: 0,
            translationsShortText: {
                DE: '',
            },
            fileName: '',
            levelName: 'notice_forewarn_green',
            shortText: '',
            longText: '',
            altMin: 0,
            altMax: 0,
        },
        severity: 0,
        type: 0,
    },

    dwdService: {
        AREADESC: '',
        NAME: '',
        WARNCELLID: 0,
        IDENTIFIER: '',
        SENDER: '',
        SENT: '1970-01-01T01:00:00Z',
        STATUS: '',
        MSGTYPE: '',
        SOURCE: '',
        SCOPE: '',
        CODE: '',
        LANGUAGE: '',
        CATEGORY: '',
        EVENT: '',
        RESPONSETYPE: '',
        URGENCY: '',
        SEVERITY: 'none',
        CERTAINTY: '',
        EC_PROFILE: '',
        EC_LICENSE: '',
        EC_II: '0',
        EC_GROUP: 'NONE',
        EC_AREA_COLOR: '32 255 26',
        EFFECTIVE: '1970-01-01T01:00:00Z',
        ONSET: '1970-01-01T01:00:00Z',
        EXPIRES: '1970-01-01T01:00:00Z',
        SENDERNAME: '',
        HEADLINE: '',
        DESCRIPTION: '',
        INSTRUCTION: '',
        WEB: 'https://www.wettergefahren.de',
        CONTACT: 'Deutscher Wetterdienst',
        PARAMETERNAME: '',
        PARAMETERVALUE: '',
        ALTITUDE: 0,
        CEILING: 0,
    },

    zamgService: {
        auswirkungen: '',
        begin: '',
        chgid: 0,
        create: '',
        empfehlungen: '',
        end: '',
        meteotext: '',
        rawinfo: {
            end: '1',
            start: '1',
            wlevel: 0,
            wtype: 0,
        },
        text: '',
        updategrund: '',
        verlaufid: 1,
        warnid: 1,
        warnstufeid: 0,
        warntypid: 0,
        nachrichtentyp: '',
        location: '',
    },
};

const testData = {
    uwzService: {
        results: [
            {
                center: 'UWZ',
                areaID: 'UWZDE49809',
                dtgEnd: 1695337200,
                areaType: 'UWZCODE',
                dtgStart: 1695301200,
                payload: {
                    translationsLongText: {
                        DE: 'Ab Donnerstagnachmittag sind mit der Ankunft einer kräftigen Kaltfront von EX-Hurrikan-LEE Gewitter möglich. Dabei besteht die Gefahr von Starkregen mit Mengen zwischen 10 und 15 l/m^2 und Sturmböen um 75 km/h, lokal auch etwas mehr. Donnerstagnacht lässt die Schauer- und Gewitterneigung wieder nach.',
                    },
                    id: '16952761158501.6',
                    creation: 1695276614000,
                    uwzLevel: 7,
                    translationsShortText: {
                        DE: 'Gewitter aus SW mit Starkregen und Sturmböen.',
                    },
                    fileName: 'meteogroup_warn_16952761158501_20230921060814_1695337200_1695276614.xml',
                    levelName: 'alert_forewarn_orange',
                    shortText: 'Thunderstorms.',
                    longText:
                        'From Thursday afternoon thunderstorms may occur. The risk of heavy rain and violent gusts arises, thereby. Thursday night the risk of thunderstorms decreases.',
                    altMin: -10,
                    altMax: 9000,
                },
                severity: 7,
                type: 7,
            },
            {
                center: 'UWZ',
                areaID: 'UWZDE55422',
                dtgEnd: 1695317400,
                areaType: 'UWZCODE',
                dtgStart: 1695313800,
                payload: {
                    translationsLongText: {
                        DE: 'Am 21.09.2023 um 18:30 Uhr wurde ein Gewitter der Stufe Orange registriert, dessen Schwerpunkt sich im Bereich Veitsrodt befindet. Es kommt aus Südwest und bewegt sich mit einer Geschwindigkeit von 79 km/h in nordöstliche Richtung. Es sind lokal Starkregen und einzelne Sturmböen möglich. Punktuell ist auch kleinkörniger Hagel nicht auszuschließen. Die Blitzaktivität ist hoch. Folgende Orte befinden sich auf der weiteren Zugbahn des Gewitters: Rhaunen (18:30), Kirchberg (Hunsrück) (18:35), Simmern/ Hunsrück (18:41), Rheinböllen (18:51), Oberwesel (18:55), Bornich (19:03), Miehlen (19:07). Angegeben ist die Ankunftszeit des Gewitters in dem Ort.',
                    },
                    id: '16953140380002',
                    creation: 1695313800000,
                    uwzLevel: 10,
                    translationsShortText: {
                        DE: 'Gewitter mit Starkregen, (kleiner Hagel und Sturmböen sind möglich)',
                    },
                    fileName: 'meteogroup_warn_16953140380002_20230921163000_1695317400_1695314047.xml',
                    levelName: 'alert_warn_orange',
                    shortText: 'Warning ORANGE: thunderstorms - heavy rain',
                    longText:
                        'On 2023/09/21 at 18:30 local time a severe thunderstorm of level orange was detected. The center is located in the community of Veitsrodt. The storm is approaching from southwest and is moving in northeastern direction at a speed of 79 km/h. Regional heavy rain and isolated storm gusts are possible. Local hail of small size can not be ruled out. The lightning activity is high. The severe thunderstorm is expected to cross the following communities: Rhaunen (18:30), Kirchberg (Hunsrück) (18:35), Simmern/ Hunsrück (18:41), Rheinböllen (18:51), Oberwesel (18:55), Bornich (19:03), Miehlen (19:07). The arrival time of the storm is stated.',
                    altMin: -10,
                    altMax: 9000,
                },
                severity: 10,
                type: 7,
            },
        ],
        cached: 1,
    },
    dwdService: {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                id: 'Warnungen_Gemeinden.807133073.2.49.0.0.276.0.DWD.PVW.1695315000000.a9404042-2094-45eb-96f0-7d87558b0d14.DEU',
                geometry: {
                    type: 'MultiPolygon',
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
                                [7.4595, 49.8209],
                            ],
                        ],
                    ],
                },
                geometry_name: 'THE_GEOM',
                properties: {
                    AREADESC: 'Oberhausen/Kirn',
                    NAME: 'Gemeinde Oberhausen bei Kirn',
                    WARNCELLID: 807133073,
                    IDENTIFIER: '2.49.0.0.276.0.DWD.PVW.1695315000000.a9404042-2094-45eb-96f0-7d87558b0d14.DEU',
                    SENDER: 'opendata@dwd.de',
                    SENT: '2023-09-21T16:50:00Z',
                    STATUS: 'Actual',
                    MSGTYPE: 'Update',
                    SOURCE: 'PVW',
                    SCOPE: 'Public',
                    CODE: 'id:2.49.0.0.276.0.DWD.PVW.1695315000000.a9404042-2094-45eb-96f0-7d87558b0d14',
                    LANGUAGE: 'de-DE',
                    CATEGORY: 'Met',
                    EVENT: 'STARKES GEWITTER',
                    RESPONSETYPE: 'Prepare',
                    URGENCY: 'Immediate',
                    SEVERITY: 'Moderate',
                    CERTAINTY: 'Likely',
                    EC_PROFILE: '2.1.13',
                    EC_LICENSE: '© GeoBasis-DE / BKG 2021 (Daten modifiziert)',
                    EC_II: '38',
                    EC_GROUP: 'THUNDERSTORM;WIND;RAIN;HAIL',
                    EC_AREA_COLOR: '251 140 0',
                    EFFECTIVE: '2023-09-21T16:50:00Z',
                    ONSET: '2023-09-21T16:50:00Z',
                    EXPIRES: '2023-09-21T17:30:00Z',
                    SENDERNAME: 'Deutscher Wetterdienst',
                    HEADLINE: 'Amtliche WARNUNG vor STARKEM GEWITTER',
                    DESCRIPTION:
                        'Es treten Gewitter auf. Dabei gibt es Sturmböen mit Geschwindigkeiten zwischen 65 km/h (18 m/s, 35 kn, Bft 8) und 85 km/h (24 m/s, 47 kn, Bft 9) sowie Starkregen mit Niederschlagsmengen zwischen 15 l/m² und 25 l/m² pro Stunde und kleinkörnigen Hagel.',
                    INSTRUCTION:
                        'ACHTUNG! Hinweis auf mögliche Gefahren: Örtlich kann es Blitzschlag geben. Bei Blitzschlag besteht Lebensgefahr! Vereinzelt können beispielsweise Bäume entwurzelt und Dächer beschädigt werden. Achten Sie besonders auf herabstürzende Äste, Dachziegel oder Gegenstände. Während des Platzregens sind kurzzeitig Verkehrsbehinderungen möglich.',
                    WEB: 'https://www.wettergefahren.de',
                    CONTACT: 'Deutscher Wetterdienst',
                    PARAMETERNAME: 'gusts;precipitation;hail',
                    PARAMETERVALUE: '65-85 [km/h];15-25 [l/m² in 1h];<2 [cm]',
                    ALTITUDE: 0,
                    CEILING: 9842.5197,
                },
                bbox: [7.429, 49.7973, 7.4755, 49.8209],
            },
            {
                type: 'Feature',
                id: 'Warnungen_Gemeinden.807133073.2.49.0.0.276.0.DWD.PVW.1695300180000.d7e89266-cce4-4d25-be40-cc7ea987b822.DEU',
                geometry: {
                    type: 'MultiPolygon',
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
                                [7.4595, 49.8209],
                            ],
                        ],
                    ],
                },
                geometry_name: 'THE_GEOM',
                properties: {
                    AREADESC: 'Oberhausen/Kirn',
                    NAME: 'Gemeinde Oberhausen bei Kirn',
                    WARNCELLID: 807133073,
                    IDENTIFIER: '2.49.0.0.276.0.DWD.PVW.1695300180000.d7e89266-cce4-4d25-be40-cc7ea987b822.DEU',
                    SENDER: 'opendata@dwd.de',
                    SENT: '2023-09-21T12:43:00Z',
                    STATUS: 'Actual',
                    MSGTYPE: 'Alert',
                    SOURCE: 'PVW',
                    SCOPE: 'Public',
                    CODE: 'id:2.49.0.0.276.0.DWD.PVW.1695300180000.d7e89266-cce4-4d25-be40-cc7ea987b822',
                    LANGUAGE: 'de-DE',
                    CATEGORY: 'Met',
                    EVENT: 'WINDBÖEN',
                    RESPONSETYPE: 'Prepare',
                    URGENCY: 'Immediate',
                    SEVERITY: 'Minor',
                    CERTAINTY: 'Likely',
                    EC_PROFILE: '2.1.13',
                    EC_LICENSE: '© GeoBasis-DE / BKG 2021 (Daten modifiziert)',
                    EC_II: '51',
                    EC_GROUP: 'WIND',
                    EC_AREA_COLOR: '255 235 59',
                    EFFECTIVE: '2023-09-21T12:43:00Z',
                    ONSET: '2023-09-21T14:00:00Z',
                    EXPIRES: '2023-09-21T18:00:00Z',
                    SENDERNAME: 'Deutscher Wetterdienst',
                    HEADLINE: 'Amtliche WARNUNG vor WINDBÖEN',
                    DESCRIPTION:
                        'Es treten Windböen mit Geschwindigkeiten bis 60 km/h (17 m/s, 33 kn, Bft 7) aus südwestlicher Richtung auf. In Schauernähe muss mit Sturmböen bis 70 km/h (20 m/s, 38 kn, Bft 8) gerechnet werden.',
                    INSTRUCTION: null,
                    WEB: 'https://www.wettergefahren.de',
                    CONTACT: 'Deutscher Wetterdienst',
                    PARAMETERNAME: 'wind direction;gusts;exposed gusts',
                    PARAMETERVALUE: 'south-west;<60 [km/h];<70 [km/h]',
                    ALTITUDE: 0,
                    CEILING: 9842.5197,
                },
                bbox: [7.429, 49.7973, 7.4755, 49.8209],
            },
        ],
        totalFeatures: 2,
        numberMatched: 2,
        numberReturned: 2,
        timeStamp: '2023-09-21T16:51:33.363Z',
        crs: {
            type: 'name',
            properties: {
                name: 'urn:ogc:def:crs:EPSG::4326',
            },
        },
        bbox: [7.429, 49.7973, 7.4755, 49.8209],
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
                        [381000, 428437],
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
                        [384585, 433660],
                    ],
                ],
            ],
            type: 'MultiPolygon',
        },
        properties: {
            location: {
                properties: {
                    gemeindenr: 50101,
                    name: 'Salzburg',
                    urlname: 'salzburg',
                },
                type: 'Municipal',
            },
            warnings: [
                {
                    type: 'Warning',
                    properties: {
                        warnid: 10,
                        chgid: 202406270,
                        verlaufid: 31,
                        warntypid: 6,
                        begin: '29.06.2024 00:00',
                        end: '29.06.2024 23:59',
                        create: '2024-06-27 07:00:00+00',
                        text: 'Es ist mit erhöhter Hitzebelastung zu rechnen.',
                        auswirkungen:
                            '* Erhöhte Körpertemperatur\n* Erhöhter Puls\n* Schwäche/Müdigkeit\n* Kopfschmerzen\n* Muskelkrämpfe\n* Trockener Mund und Hals\n* Verwirrtheit, Schwindel, Bewusstseinsstörungen\n* Übelkeit, Erbrechen, Durchfall',
                        empfehlungen:
                            '* Meiden Sie direktes Sonnenlicht! Achten Sie darauf, dass Kinder vor der Sonne geschützt sind!\n* Meiden Sie verbaute und versiegelte Plätze wo es keinen Schatten gibt.\n* Gehen Sie nicht in der heißesten Tageszeit nach draußen!\n* Ziehen Sie die Vorhänge zu bzw. schließen Sie die Jalousien. Öffnen Sie die Fenster vorwiegend in der Nacht bzw. in den kühlen Morgenstunden!\n* Vermeiden Sie große Anstrengungen bzw. verschieben Sie körperliche Aktivitäten im Freien auf die frühen Morgenstunden oder den Abend!\n* Tragen Sie luftige, helle Kleidung und eine Kopfbedeckung!\n* Nehmen Sie eine kühle Dusche! Auch kalte Arm- und Fußbäder wirken entlastend.\n* Trinken Sie ausreichend und regelmäßig (mindestens 2 - 3 Liter pro Tag)! Optimal sind Wasser, ungesüßter Tee oder mit Wasser verdünnte Fruchtsäfte.\n* Denken Sie an ältere Mitmenschen und Kinder, dass auch diese regelmäßig trinken. \n* Bevorzugen Sie leichtes Essen!\n* Meiden Sie Alkohol!',
                        meteotext: null,
                        updategrund: null,
                        warnstufeid: 1,
                        rawinfo: {
                            wtype: 6,
                            wlevel: 1,
                            start: '1719612000',
                            end: '1719698340',
                        },
                    },
                },
                {
                    properties: {
                        auswirkungen:
                            '* Kleine Muren, lokal überflutete Straßen\n* Punktuell kann es zu Überschwemmungen kommen, Keller können überflutet werden.\n* Blitzschlag kann zu Stromausfällen führen und Gebäude oder Bäume in Brand stecken.\n* Aufgrund von Sturmböen können Gegenstände herumgewirbelt werden, Äste abbrechen und vereinzelt auch Bäume umfallen.',
                        begin: '18.09.2023 17:00',
                        chgid: 0,
                        create: '2023-09-17 07:00:00+00',
                        empfehlungen:
                            '* Schließen Sie Fenster, Türen und Garagentore sowie Dachfenster und Lichtkuppeln!\n* Verlassen Sie bei einem herannahenden Gewitter umgehend Gewässer!\n* Suchen Sie vor allem im Gebirge rechtzeitig Schutz!\n* Beachten Sie Gewitter- und Sturmwarnungen an Seen!',
                        end: '18.09.2023 23:00',
                        meteotext:
                            'Im Vorfeld einer Kaltfront bilden sich ab dem späteren Nachmittag bzw. in der ersten Nachthälfte teils kräftige Gewitter. Eine Hauptgefahr sind Sturmböen aus West. Auch Hagel und Starkregen können gebietsweise dabei sein.',
                        rawinfo: {
                            end: '1695070800',
                            start: '1695049200',
                            wlevel: 1,
                            wtype: 5,
                        },
                        text: 'Gelbe Gewitterwarnung von Mo, 18.09.2023 17:00 bis Mo, 18.09.2023 23:00',
                        updategrund: '',
                        verlaufid: 1,
                        warnid: 4265,
                        warnstufeid: 1,
                        warntypid: 5,
                    },
                    type: 'Warning',
                },
                {
                    properties: {
                        auswirkungen:
                            '* Kleine Muren, lokal überflutete Straßen\n* Punktuell kann es zu Überschwemmungen kommen, Keller können überflutet werden.\n* Blitzschlag kann zu Stromausfällen führen und Gebäude oder Bäume in Brand stecken.\n* Aufgrund von Sturmböen können Gegenstände herumgewirbelt werden, Äste abbrechen und vereinzelt auch Bäume umfallen.',
                        begin: '18.09.2023 17:00',
                        chgid: 3,
                        create: '2023-09-17 07:00:00+00',
                        empfehlungen:
                            '* Schließen Sie Fenster, Türen und Garagentore sowie Dachfenster und Lichtkuppeln!\n* Verlassen Sie bei einem herannahenden Gewitter umgehend Gewässer!\n* Suchen Sie vor allem im Gebirge rechtzeitig Schutz!\n* Beachten Sie Gewitter- und Sturmwarnungen an Seen!',
                        end: '18.09.2023 23:00',
                        meteotext:
                            'Im Vorfeld einer Kaltfront bilden sich ab dem späteren Nachmittag bzw. in der ersten Nachthälfte teils kräftige Gewitter. Eine Hauptgefahr sind Sturmböen aus West. Auch Hagel und Starkregen können gebietsweise dabei sein.',
                        rawinfo: {
                            end: '1695070800',
                            start: '1695049200',
                            wlevel: 3,
                            wtype: 4,
                        },
                        text: 'Gelbe Glatteis von Mo, 18.09.2023 17:00 bis Mo, 18.09.2023 23:00',
                        updategrund: '',
                        verlaufid: 1,
                        warnid: 4266,
                        warnstufeid: 3,
                        warntypid: 4,
                    },
                    type: 'Warning',
                },
            ],
        },
        type: 'Feature',
    },
};
export function getTestData(service: string, _that: WeatherWarnings): DataImportType {
    const result = JSON.parse(JSON.stringify(testData));
    const random = Math.round(Math.random());
    if (service == 'dwdService') {
        for (const i in testData.dwdService.features) {
            if (_that.providerController!.testStatus == 2) {
                if (Number(i) % 2 == random) {
                    result.dwdService.features[i] = null;
                    continue;
                }
            } else if (_that.providerController!.testStatus == 3) {
                result.dwdService.features[i] = null;
                continue;
            }
            const f = testData.dwdService.features[i];
            const start = Date.now() + Math.random() * 12000000 + 60000;
            if (new Date(f.properties.EXPIRES).getTime() + 14000000 < start) {
                f.properties.ONSET = new Date(start).toJSON();
                f.properties.EXPIRES = new Date(start + Math.random() * 2400000 + 300000).toJSON();
            }
            if (new Date(f.properties.EXPIRES).getTime() < Date.now()) {
                result.dwdService.features[i] = null;
            } else {
                result.dwdService.features[i] = testData.dwdService.features[i];
            }
        }
        for (let i = result.dwdService.features.length - 1; i >= 0; i--) {
            if (result.dwdService.features[i] == null) {
                result.dwdService.features.splice(i, 1);
            }
        }
        return result.dwdService as unknown as DataImportType;
    } else if (service == 'uwzService') {
        for (const i in testData.uwzService.results) {
            if (_that.providerController!.testStatus == 2) {
                if (Number(i) % 2 == random) {
                    result.uwzService.results[i] = null;
                    continue;
                }
            } else if (_that.providerController!.testStatus == 3) {
                result.uwzService.results[i] = null;
                continue;
            }
            const f = testData.uwzService.results[i];
            const start = Date.now() + Math.random() * 1200000 + 300000;
            if (f.dtgEnd * 1000 + 3600000 < start) {
                f.dtgStart = new Date(start).getTime() / 1000;
                f.dtgEnd = new Date(start + Math.random() * 1200000 + 300000).getTime() / 1000;
            }
            if (f.dtgEnd < Date.now() / 1000) {
                result.uwzService.results[i] = null;
            } else {
                result.uwzService.results[i] = testData.uwzService.results[i];
            }
        }
        for (let i = result.uwzService.results.length - 1; i >= 0; i--) {
            if (result.uwzService.results[i] == null) {
                result.uwzService.results.splice(i, 1);
            }
        }
        return result.uwzService as unknown as DataImportType;
    } else if (service == 'zamgService') {
        for (const i in testData.zamgService.properties.warnings) {
            if (_that.providerController!.testStatus == 2) {
                if (Number(i) % 2 == random) {
                    result.zamgService.properties.warnings[i] = null;
                    continue;
                }
            } else if (_that.providerController!.testStatus == 3) {
                result.zamgService.properties.warnings[i] = null;
                continue;
            }
            const f = testData.zamgService.properties.warnings[i];
            const start = Date.now() + Math.random() * 1200000 + 300000;
            if (Number(f.properties.rawinfo.end) * 1000 + 3600000 < start) {
                f.properties.rawinfo.start = (new Date(start).getTime() / 1000).toString();
                f.properties.rawinfo.end = (
                    new Date(start + Math.random() * 2400000 + 300000).getTime() / 1000
                ).toString();
            }
            if (Number(f.properties.rawinfo.end) * 1000 < Date.now()) {
                result.zamgService.properties.warnings[i] = null;
            } else {
                result.zamgService.properties.warnings[i] = testData.zamgService.properties.warnings[i];
            }
        }
        for (let i = result.zamgService.properties.warnings.length - 1; i >= 0; i--) {
            if (result.zamgService.properties.warnings[i] == null) {
                result.zamgService.properties.warnings.splice(i, 1);
            }
        }
        return result.zamgService as unknown as DataImportType;
    }
    return null;
}
