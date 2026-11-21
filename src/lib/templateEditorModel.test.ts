import { expect } from 'chai';
import {
    findTemplateUsages,
    groupTokens,
    parseTemplateHelp,
    renameTemplate,
    uniqueTemplateKey,
    validateTemplateKey,
} from './templateEditorModel';
import { finalizeTemplateText, renderTemplate } from './templateRenderer';

const noopLog = { error: (): void => {} };

describe('templateRenderer', () => {
    const table = [
        { templateKey: 'Head', template: '${warnlevelname}: ${headline}' },
        { templateKey: 'Main', template: '${Head}\\n${[null,eins,zwei,drei]warnlevelnumber}' },
    ];
    const data = { headline: 'Sturm', warnlevelname: 'markant', warnlevelnumber: 2, provider: 'DWD' };

    it('replaces tokens and capitalises ${Token}', () => {
        expect(renderTemplate('${provider} ${Headline}', 'x', data, table, noopLog)).to.equal('DWD Sturm');
    });

    it('resolves nested templates and lists', () => {
        const text = finalizeTemplateText(renderTemplate(table[1].template, 'Main', data, table, noopLog));
        expect(text).to.equal('markant: Sturm\nzwei');
    });

    it('evaluates conditions', () => {
        expect(renderTemplate('${(1<warnlevelnumber)hoch#niedrig}', 'x', data, table, noopLog)).to.equal('hoch');
        expect(renderTemplate('${(3<warnlevelnumber)hoch#niedrig}', 'x', data, table, noopLog)).to.equal('niedrig');
    });

    it('reports unknown keys in conditions through the logger', () => {
        const errors: string[] = [];
        renderTemplate('${(1<nope)a#b}', 'x', data, table, { error: (...m: string[]) => errors.push(m.join(' ')) });
        expect(errors).to.have.length(1);
    });
});

describe('templateEditorModel', () => {
    const data: Record<string, any> = {
        templateTable: [
            { templateKey: 'NewMessage', template: '${headline}' },
            { templateKey: 'Wrapper', template: '>> ${NewMessage} <<' },
            { templateKey: 'Other', template: 'x' },
        ],
        telegram_MessageNew: 'NewMessage',
        notificationServices: {
            telegram: {
                adapter: 'telegram.0',
                providers: { dwd: true, uwz: false, zamg: false },
                filter: { auto: { type: [], level: 0 } },
                messages: { new: 'NewMessage', remove: 'Other' },
                extras: {},
            },
        },
    };

    it('finds service and nested usages', () => {
        const usages = findTemplateUsages(data, 'NewMessage');
        expect(usages).to.deep.include({ service: 'telegram', slot: 'new' });
        expect(usages).to.deep.include({ service: 'template', slot: 'Wrapper' });
    });

    it('renames a template including all references without touching the input', () => {
        const out = renameTemplate(data, 'NewMessage', 'Neu');
        expect(out.templateTable[0].templateKey).to.equal('Neu');
        expect(out.templateTable[1].template).to.equal('>> ${Neu} <<');
        expect(out.notificationServices.telegram.messages.new).to.equal('Neu');
        expect(out.notificationServices.telegram.messages.remove).to.equal('Other');
        expect(out.telegram_MessageNew).to.equal('Neu');
        expect(data.templateTable[0].templateKey).to.equal('NewMessage');
    });

    it('validates keys', () => {
        const table = [
            { templateKey: 'a', template: '' },
            { templateKey: 'a', template: '' },
            { templateKey: ' ', template: '' },
        ];
        expect(validateTemplateKey(table, 0)).to.equal('tpl_key_duplicate');
        expect(validateTemplateKey(table, 2)).to.equal('tpl_key_empty');
        expect(validateTemplateKey([{ templateKey: 'b', template: '' }], 0)).to.equal(undefined);
    });

    it('creates unique keys', () => {
        expect(uniqueTemplateKey(data.templateTable, 'Other')).to.equal('Other_2');
        expect(uniqueTemplateKey(data.templateTable, 'Fresh')).to.equal('Fresh');
    });

    it('parses the templateHelp text and groups tokens', () => {
        const help = parseTemplateHelp('Tokens:\n${headline}: Schlagzeile\n${starttime}: Startzeit');
        expect(help).to.deep.equal({ headline: 'Schlagzeile', starttime: 'Startzeit' });
        const groups = groupTokens(['headline', 'starttime', 'mystery']);
        expect(groups.map(g => g.id)).to.deep.equal(['warning', 'time', 'other']);
    });
});
