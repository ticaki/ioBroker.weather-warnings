import { expect } from 'chai';
import {
    SERVICE_TYPES,
    flatEntryToModel,
    modelEntryToFlat,
    flatConfigToModel,
    modelToFlatConfig,
} from './notificationServicesModel';
import { resolveNotificationServices } from './notificationServiceConfig';

/** Minimal flat config snippet for the telegram service. */
const telegramFlat = {
    telegram_Enabled: true,
    telegram_Adapter: 'telegram.0',
    telegram_DwdEnabled: true,
    telegram_UwzEnabled: false,
    telegram_ZamgEnabled: true,
    telegram_TypeFilter: [1, 2],
    telegram_LevelFilter: 3,
    telegram_ManualTypeFilter: [4],
    telegram_ManualLevelFilter: 2,
    telegram_MessageNew: 'NewMessage',
    telegram_MessageRemove: 'RemoveMessage',
    telegram_MessageAllRemove: 'RemoveAllMessage',
    telegram_manualAll: 'NewMessage',
    telegram_removeManualAll: 'RemoveAllMessage',
    telegram_UserId: 'u1',
    telegram_withNoSound: false,
    telegram_parse_mode: 'HTML',
    telegram_ChatID: 'c1',
};

describe('notificationServicesModel', () => {
    it('exposes all ten output services', () => {
        expect(SERVICE_TYPES).to.have.lengthOf(10);
        expect(SERVICE_TYPES).to.include.members(['telegram', 'sayit', 'json', 'history', 'email']);
    });

    it('round-trips a telegram entry flat -> model -> flat', () => {
        const entry = flatEntryToModel('telegram', telegramFlat);
        expect(entry.adapter).to.equal('telegram.0');
        expect(entry.providers).to.deep.equal({ dwd: true, uwz: false, zamg: true });
        expect(entry.filter.auto).to.deep.equal({ type: [1, 2], level: 3 });
        expect(entry.filter.manual).to.deep.equal({ type: [4], level: 2 });
        expect(entry.messages.new).to.equal('NewMessage');
        expect(entry.messages.removeAll).to.equal('RemoveAllMessage');
        expect(entry.extras.ChatID).to.equal('c1');
        expect(entry.extras.parse_mode).to.equal('HTML');

        const flat = modelEntryToFlat('telegram', entry);
        for (const key of Object.keys(telegramFlat)) {
            if (key === 'telegram_Enabled') {
                continue; // the master toggle is intentionally not part of the model
            }
            expect(flat[key], key).to.deep.equal((telegramFlat as Record<string, any>)[key]);
        }
    });

    it('builds a model for every service and projects it back to flat keys', () => {
        const model = flatConfigToModel(telegramFlat);
        expect(Object.keys(model)).to.have.lengthOf(SERVICE_TYPES.length);
        const flat = modelToFlatConfig(model);
        expect(flat.telegram_Adapter).to.equal('telegram.0');
        // master toggle must not be produced
        expect(flat).to.not.have.property('telegram_Enabled');
    });

    it('handles the sayit adapter array', () => {
        const flat = {
            sayit_Adapter_Array: [{ sayit_Adapter: 'sayit.0' }],
            sayit_DwdEnabled: true,
            sayit_UwzEnabled: true,
            sayit_ZamgEnabled: false,
            sayit_volumen: 30,
        };
        const entry = flatEntryToModel('sayit', flat);
        expect(entry.adapters).to.deep.equal([{ sayit_Adapter: 'sayit.0' }]);
        expect(entry.extras.volumen).to.equal(30);
        const back = modelEntryToFlat('sayit', entry);
        expect(back.sayit_Adapter_Array).to.deep.equal([{ sayit_Adapter: 'sayit.0' }]);
    });
});

describe('resolveNotificationServices', () => {
    const noopLog = { error: () => {}, warn: () => {} };

    it('resolves a structured telegram configuration', () => {
        const config: any = {
            telegram_Enabled: true,
            notificationServices: flatConfigToModel(telegramFlat),
        };
        const { options } = resolveNotificationServices(config, noopLog);
        expect(options.telegram).to.not.equal(undefined);
        expect(options.telegram!.adapter).to.equal('telegram.0');
        expect(options.telegram!.service).to.deep.equal(['dwdService', 'zamgService']);
        expect(options.telegram!.chatid).to.equal('c1');
        expect(options.telegram!.userid).to.equal('u1');
        expect(options.telegram!.actions.new).to.equal('NewMessage');
    });

    it('still understands the legacy flat keys (no structured object yet)', () => {
        const config: any = { ...telegramFlat };
        const { options } = resolveNotificationServices(config, noopLog);
        expect(options.telegram).to.not.equal(undefined);
        expect(options.telegram!.adapter).to.equal('telegram.0');
    });

    it('disables alexa2 when no devices are selected', () => {
        const config: any = {
            alexa2_Enabled: true,
            alexa2_Adapter: 'alexa2.0',
            alexa2_device_ids: [],
        };
        const { options, disabledServices } = resolveNotificationServices(config, noopLog);
        expect(options.alexa2).to.equal(undefined);
        expect(disabledServices).to.include('alexa2');
    });
});
