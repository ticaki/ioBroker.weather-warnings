import { expect } from 'chai';
import { MessagesClass } from './messages';

describe('MessagesClass time helpers', () => {
    it('uses the time zone offset of the given moment', () => {
        const summer = Date.UTC(2026, 6, 1, 12);
        const winter = Date.UTC(2026, 0, 15, 12);
        for (const ms of [summer, winter]) {
            const m = -new Date(ms).getTimezoneOffset();
            const expected = `${m < 0 ? '-' : '+'}${String(Math.floor(Math.abs(m) / 60)).padStart(2, '0')}${String(Math.abs(m) % 60).padStart(2, '0')}`;
            expect(MessagesClass.timeOffsetAt(ms)).to.equal(expected);
        }
        expect(MessagesClass.timeOffsetAt(NaN)).to.match(/^[+-]\d{4}$/);
    });

    it('detects expressions on the end time', () => {
        expect(MessagesClass.END_TIME_FIELDS.test('$fromMillis($toMillis(EXPIRES),"[H#1]")')).to.equal(true);
        expect(MessagesClass.END_TIME_FIELDS.test('$fromMillis(dtgEnd * 1000,"[H#1]")')).to.equal(true);
        expect(MessagesClass.END_TIME_FIELDS.test('$number(rawinfo.end)*1000')).to.equal(true);
        expect(MessagesClass.END_TIME_FIELDS.test('$fromMillis($toMillis(ONSET),"[H#1]")')).to.equal(false);
    });

    it('counts days beyond one month in the countdown', () => {
        const countdown = (MessagesClass.prototype as any).getCountdown as (t: number, typ: string) => string;
        const past = Date.now() - (78 * 24 + 5) * 3_600_000 - 7 * 60_000;
        expect(countdown(past, 'full')).to.equal('-78:05:07');
        expect(Number(countdown(past, 'hours'))).to.equal(78 * 24 + 5);
        expect(countdown(past, 'future')).to.equal('-1');
        const soon = Date.now() + 2 * 3_600_000 + 30 * 60_000 + 30_000;
        expect(countdown(soon, 'full')).to.equal('2:30');
    });
});
