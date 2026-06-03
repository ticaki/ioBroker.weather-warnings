/**
 * Builds the runtime notification-service options from the adapter config.
 *
 * This used to be an inline ~180 line loop in `main.ts` that read ~20
 * string-concatenated flat config keys per service. It now reads the structured
 * `config.notificationServices` object (see {@link notificationServicesModel})
 * while staying byte-for-byte compatible with the legacy flat keys: the
 * structured values are projected back onto a flat overlay so the exact same
 * mapping logic as before is applied.
 */
import * as NotificationType from './def/notificationService-def';
import { notificationServiceDefaults } from './def/notificationService-def';
import type * as providerDef from './def/provider-def';
import { modelToFlatConfig, type NotificationServicesConfig } from './notificationServicesModel';

export interface ResolveLogger {
    error: (message: string) => void;
    warn: (message: string) => void;
}

/**
 * Resolves the configured notification services into runtime options.
 *
 * @param config the adapter configuration
 * @param log a minimal logger used for the alexa2/sayit deactivation messages
 * @returns the runtime options and the list of services that had to be disabled
 */
export function resolveNotificationServices(
    config: ioBroker.AdapterConfig,
    log: ResolveLogger,
): { options: NotificationType.OptionsType; disabledServices: NotificationType.Type[] } {
    // overlay the structured model (if present) onto the flat config so the
    // legacy mapping logic below can stay unchanged
    const cfg: Record<string, any> = {
        ...config,
        ...modelToFlatConfig(
            (config as unknown as { notificationServices?: NotificationServicesConfig }).notificationServices,
        ),
    };

    const notificationServiceOpt: NotificationType.OptionsType = {};
    const disabledServices: NotificationType.Type[] = [];

    for (const n of NotificationType.Array) {
        const notificationService = n;
        if (!cfg[`${notificationService}_Enabled`]) {
            continue;
        }
        const service: providerDef.providerServices[] = [];
        if (cfg[`${notificationService}_DwdEnabled`]) {
            service.push('dwdService');
        }
        if (cfg[`${notificationService}_UwzEnabled`]) {
            service.push('uwzService');
        }
        if (cfg[`${notificationService}_ZamgEnabled`]) {
            service.push('zamgService');
        }
        const template: NotificationType.ActionsType = {
            new:
                cfg[`${notificationService}_MessageNew`] !== undefined
                    ? cfg[`${notificationService}_MessageNew`]
                    : 'none',
            remove: cfg[`${notificationService}_MessageRemove`],
            removeAll: cfg[`${notificationService}_MessageAllRemove`],
            all:
                cfg[`${notificationService}_MessageAll`] !== undefined
                    ? cfg[`${notificationService}_MessageAll`]
                    : cfg[`${notificationService}_MessageNew`] !== undefined
                      ? cfg[`${notificationService}_MessageNew`]
                      : 'none',
            manualAll:
                cfg[`${notificationService}_manualAll`] !== undefined
                    ? cfg[`${notificationService}_manualAll`]
                    : 'none',
            removeManualAll:
                cfg[`${notificationService}_removeManualAll`] !== undefined
                    ? cfg[`${notificationService}_removeManualAll`]
                    : 'none',
            title: cfg[`${notificationService}_Title`] !== undefined ? cfg[`${notificationService}_Title`] : 'none',
        };
        for (const a in template) {
            const b = a as keyof NotificationType.ActionsType;
            if (template[b] == undefined) {
                continue;
            }
            template[b] = template[b] ? template[b] : 'none';
        }

        (notificationServiceOpt as Record<string, any>)[notificationService] = {
            ...notificationServiceDefaults[notificationService],
            service,
            filter: {
                auto: {
                    level: cfg[`${notificationService}_LevelFilter`] || -1,
                    type: (cfg[`${notificationService}_TypeFilter`] || []).map((a: any) => String(a)),
                },
                manual: {
                    level: cfg[`${notificationService}_ManualLevelFilter`]
                        ? cfg[`${notificationService}_ManualLevelFilter`]
                        : -1,
                    type: (cfg[`${notificationService}_ManualTypeFilter`]
                        ? cfg[`${notificationService}_ManualTypeFilter`]
                        : []
                    ).map((a: any) => String(a)),
                },
            },
            adapter: cfg[`${notificationService}_Adapter`],
            name: notificationService,
            actions: template,
            useadapter: true,
        };
        Object.assign(
            (notificationServiceOpt as Record<string, any>)[notificationService],
            notificationServiceDefaults[notificationService],
        );
    }

    // hold this for some special cases
    if (cfg.telegram_Enabled && notificationServiceOpt.telegram != undefined) {
        notificationServiceOpt.telegram.withNoSound = cfg.telegram_withNoSound || false;
        notificationServiceOpt.telegram.userid = cfg.telegram_UserId || '';
        notificationServiceOpt.telegram.chatid = cfg.telegram_ChatID || '';
        notificationServiceOpt.telegram.parse_mode = cfg.telegram_parse_mode || 'none';
    }
    if (cfg.whatsapp_Enabled && notificationServiceOpt.whatsapp != undefined) {
        if (cfg.whatsapp_Phonenumber) {
            notificationServiceOpt.whatsapp.phonenumber = cfg.whatsapp_Phonenumber;
        }
    }
    if (cfg.pushover_Enabled && notificationServiceOpt.pushover != undefined) {
        notificationServiceOpt.pushover.sound = cfg.pushover_Sound || 'none';
        notificationServiceOpt.pushover.priority = cfg.pushover_Priority || false;
        notificationServiceOpt.pushover.device = cfg.pushover_Device || '';
    }
    if (cfg.gotify_Enabled && notificationServiceOpt.gotify != undefined) {
        notificationServiceOpt.gotify.priority = cfg.gotify_Priority !== undefined ? parseInt(cfg.gotify_Priority) : 0;
        notificationServiceOpt.gotify.contentType = cfg.gotify_contentType || 'text/plain';
    }
    if (cfg.nspanel_Enabled && notificationServiceOpt.nspanel != undefined) {
        notificationServiceOpt.nspanel.priority =
            cfg.nspanel_Priority !== undefined && cfg.nspanel_Priority > 0 ? Math.ceil(cfg.nspanel_Priority) : 50;
        notificationServiceOpt.nspanel.alwaysOn = cfg.nspanel_alwaysOn ?? true;
    }
    if (cfg.email_Enabled && notificationServiceOpt.email != undefined) {
        notificationServiceOpt.email.actions.header = cfg.email_Header;
        notificationServiceOpt.email.actions.footer = cfg.email_Footer;
        notificationServiceOpt.email.recipients = cfg.email_Recipients;
    }
    if (cfg.alexa2_Enabled && notificationServiceOpt.alexa2 != undefined) {
        notificationServiceOpt.alexa2.volumen = cfg.alexa2_volumen > 0 ? String(cfg.alexa2_volumen) : '';
        notificationServiceOpt.alexa2.audio = cfg.alexa2_Audio || '';
        notificationServiceOpt.alexa2.sounds = cfg.alexa2_sounds || [];
        notificationServiceOpt.alexa2.sounds_enabled = cfg.alexa2_sounds_enabled || false;
        if (!cfg.alexa2_device_ids || cfg.alexa2_device_ids.length == 0 || !cfg.alexa2_device_ids[0]) {
            log.error(`Missing devices for alexa - deactivated`);
            delete notificationServiceOpt.alexa2;
            disabledServices.push('alexa2');
        } else if (cfg.alexa2_Adapter == 'none') {
            log.error(`Missing adapter for alexa - deactivated`);
            delete notificationServiceOpt.alexa2;
            disabledServices.push('alexa2');
        }
    }
    if (cfg.sayit_Enabled && notificationServiceOpt.sayit != undefined) {
        notificationServiceOpt.sayit.volumen = cfg.sayit_volumen > 0 ? String(cfg.sayit_volumen) : '';
        if (
            !cfg.sayit_Adapter_Array ||
            cfg.sayit_Adapter_Array.length == 0 ||
            cfg.sayit_Adapter_Array[0].sayit_Adapter == 'none'
        ) {
            log.warn(`Missing adapter for sayit - deactivated`);
            delete notificationServiceOpt.sayit;
            disabledServices.push('sayit');
        } else {
            notificationServiceOpt.sayit.adapters = cfg.sayit_Adapter_Array.map((a: any) => a.sayit_Adapter);
        }
    }

    return { options: notificationServiceOpt, disabledServices };
}
