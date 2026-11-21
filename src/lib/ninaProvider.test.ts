import { expect } from 'chai';
import { NINAProvider } from './provider';
import { genericWarntyp } from './def/messages-def';

describe('NINA provider helpers', () => {
    it('reduces an ARS/AGS to the district ARS', () => {
        expect(NINAProvider.toDistrictArs('100440115115')).to.equal('100440000000');
        expect(NINAProvider.toDistrictArs('10044')).to.equal('100440000000');
        expect(NINAProvider.toDistrictArs('110000000000')).to.equal('110000000000');
        expect(NINAProvider.toDistrictArs('123')).to.equal('');
        expect(NINAProvider.toDistrictArs('')).to.equal('');
    });

    it('converts CAP html to plain text', () => {
        expect(NINAProvider.cleanText('a<br/>b<br>c &amp; d &lt;x&gt; &#252; <a href="x">link</a>')).to.equal(
            'a\nb\nc & d <x> ü link',
        );
        expect(NINAProvider.cleanText('a<br/><br/><br/><br/>b')).to.equal('a\n\nb');
        expect(NINAProvider.cleanText(undefined)).to.equal('');
    });

    it('keeps comparisons, strips comments and decodes named entities', () => {
        expect(NINAProvider.cleanText('Wert < 5 und > 3')).to.equal('Wert < 5 und > 3');
        expect(NINAProvider.cleanText('<!-- a > b -->Text')).to.equal('Text');
        expect(NINAProvider.cleanText('&auml;&ouml;&uuml;&szlig; &euro; &unknown;')).to.equal('äöüß € &unknown;');
        expect(NINAProvider.cleanText('x &#99999999; y')).to.equal('x &#99999999; y');
        expect(NINAProvider.cleanText(42)).to.equal('42');
        expect(NINAProvider.cleanText({ a: 1 })).to.equal('');
    });

    it('builds a short, unique area text', () => {
        expect(NINAProvider.areaText(['A', 'B', 'A', ' ', 'B'])).to.equal('A, B');
        const long = NINAProvider.areaText(Array.from({ length: 200 }, (_v, i) => `Gemeinde ${i}`));
        expect(long.length).to.be.at.most(302);
        expect(long.endsWith(' …')).to.equal(true);
    });

    it('compares ids without the source prefix', () => {
        expect(NINAProvider.bareId('dwd.2.49.0.0.276.0.DWD.PVW.1')).to.equal('2.49.0.0.276.0.DWD.PVW.1');
        expect(NINAProvider.bareId('dwdmap.2.49.0.0.276.0.DWD.PVW.1')).to.equal('2.49.0.0.276.0.DWD.PVW.1');
        expect(NINAProvider.bareId('mow.DE-SL-1')).to.equal('DE-SL-1');
    });

    it('maps CAP severity to the generic level', () => {
        expect(NINAProvider.severityToLevel('Minor')).to.equal(1);
        expect(NINAProvider.severityToLevel('Moderate')).to.equal(2);
        expect(NINAProvider.severityToLevel('Severe')).to.equal(3);
        expect(NINAProvider.severityToLevel('Extreme')).to.equal(4);
        expect(NINAProvider.severityToLevel('Unknown')).to.equal(1);
        expect(NINAProvider.severityToLevel(undefined)).to.equal(1);
    });

    it('maps DWD warning types to an event code of the same generic type', () => {
        expect(NINAProvider.dwdTypeToEventCode(66)).to.equal(21); // ergiebiger Dauerregen -> rain
        expect(NINAProvider.dwdTypeToEventCode(59)).to.equal(49); // Nebel -> fog
        expect(NINAProvider.dwdTypeToEventCode(1234)).to.equal(999);
    });

    it('maps every BBK event code to exactly one generic type (combined thunderstorm codes excepted)', () => {
        const combined = [82, 85, 86];
        for (let evc = 1; evc <= 99; evc++) {
            const hits = Object.values(genericWarntyp).filter(w => (w.ninaService ?? []).includes(evc));
            expect(hits.length, `BBK-EVC-${evc}`).to.be.greaterThan(0);
            if (!combined.includes(evc)) {
                expect(hits.length, `BBK-EVC-${evc}`).to.equal(1);
            }
        }
    });

    it('accepts only event codes with a generic warn type', () => {
        expect(NINAProvider.isKnownEventCode(69)).to.equal(true);
        expect(NINAProvider.isKnownEventCode(999)).to.equal(true);
        expect(NINAProvider.isKnownEventCode(150)).to.equal(false);
    });

    /**
     * calls the private normalize() with a minimal provider
     *
     * @param item dashboard entry
     * @param detail CAP detail warning
     */
    function normalize(item: any, detail: any): any {
        const fake: any = Object.create(NINAProvider.prototype);
        Object.assign(fake, { languages: ['de'], library: { getTranslation: (k: string) => k } });
        return fake.normalize(item, detail, { 'BBK-EVC-069': 'Trinkwasserverschmutzung' });
    }
    const item = {
        id: 'mow.DE-XX-1-20260904-000',
        payload: {
            version: 2,
            hash: 'h',
            data: { provider: 'MOWAS', severity: 'Minor', msgType: 'Update', headline: 'x' },
        },
        sent: '2026-09-04T13:05:28+02:00',
    };
    const detail = {
        identifier: 'mow.DE-XX-1-20260904-000',
        sent: '2026-09-04T13:05:28+02:00',
        status: 'Actual',
        msgType: 'Update',
        references:
            'DE-XX-1,mow.DE-XX-1-20260901-000,2026-09-01T14:57:23-00:00 DE-XX-1,mow.DE-XX-1-20260902-000,2026-09-02T10:00:00-00:00',
        info: [
            {
                language: 'en',
                headline: 'english',
                eventCode: [{ valueName: 'profile:DE-BBK-EVENTCODE', value: 'BBK-EVC-069' }],
            },
            {
                language: 'de',
                severity: 'Minor',
                headline: 'Trinkwasser<br/>verunreinigt',
                description: 'a &amp; b',
                eventCode: [{ valueName: 'profile:DE-BBK-EVENTCODE', value: 'BBK-EVC-069' }],
                parameter: [{ valueName: 'sender_langname', value: 'Kreis X' }],
            },
        ],
    };

    it('builds the flat warning: language, html, references, no end', () => {
        const w = normalize(item, detail);
        expect(w.HEADLINE).to.equal('Trinkwasser\nverunreinigt');
        expect(w.DESCRIPTION).to.equal('a & b');
        expect(w.EVENT).to.equal('Trinkwasserverschmutzung');
        expect(w.TYPE).to.equal(69);
        expect(w.SENDERNAME).to.equal('Kreis X');
        expect(w.EXPIRES).to.equal(0);
        expect(w.ONSET).to.equal(new Date('2026-09-04T13:05:28+02:00').getTime());
        expect(w.REFERENCES).to.equal('mow.DE-XX-1-20260901-000 mow.DE-XX-1-20260902-000');
    });

    it('skips all clear, cancel and exercises', () => {
        expect(normalize(item, { ...detail, msgType: 'Cancel' })).to.equal(null);
        expect(normalize(item, { ...detail, status: 'Exercise' })).to.equal(null);
        expect(normalize(item, { ...detail, info: [{ ...detail.info[1], responseType: ['AllClear'] }] })).to.equal(
            null,
        );
    });
});
