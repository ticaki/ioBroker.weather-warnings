// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            expandArray: boolean;
            allowedDirs: Array<{
                providerService: string;
                dpWarning: boolean;
                dpMessage: boolean;
                dpFormated: boolean;
                dpAlerts: boolean;
            }>;
            useJsonHistory: boolean;
            useTestWarnings: boolean;
            useTestCase: boolean;
            icon_color: string;
            imExpert: boolean;
            notPushAtStart: boolean;
            alexa2_sounds: { warntype: string; sound: string; warntypenumber: number }[];
            alexa2_sounds_enabled: boolean;

            dwdwarncellTable: { dwdSelectId: number; dwdCityname: string }[];
            uwzwarncellTable: { uwzSelectId: string; uwzCityname: string }[];
            zamgwarncellTable: { zamgSelectId: string; zamgCityname: string }[];

            dwdEnabled: boolean;
            zamgEnabled: boolean;
            uwzEnabled: boolean;
            refreshTime: number;
            templateTable: {
                templateKey: string;
                template: string;
            }[];
            dwdLanguage: string;
            uwzLanguage: string;
            zamgLanguage: string;

            dwdHourFilter: number;
            uwzHourFilter: number;
            zamgHourFilter: number;

            dwdTypeFilter: string[];
            zamgTypeFilter: string[];
            uwzTypeFilter: string[];

            dwdLevelFilter: number;
            uwzLevelFilter: number;
            zamgLevelFilter: number;

            telegram_DwdEnabled: boolean;
            telegram_UwzEnabled: boolean;
            telegram_ZamgEnabled: boolean;
            telegram_TypeFilter: number[];
            telegram_LevelFilter: number;
            telegram_Enabled: boolean;
            telegram_Adapter: string;
            telegram_MessageNew: string;
            telegram_MessageRemove: string;
            telegram_MessageAllRemove: string;
            telegram_withNoSound: boolean;
            telegram_UserId: string;
            telegram_ChatID: string;

            whatsapp_DwdEnabled: boolean;
            whatsapp_UwzEnabled: boolean;
            whatsapp_ZamgEnabled: boolean;
            whatsapp_TypeFilter: number[];
            whatsapp_LevelFilter: number;
            whatsapp_Enabled: boolean;
            whatsapp_Adapter: string;
            whatsapp_MessageNew: string;
            whatsapp_MessageRemove: string;
            whatsapp_MessageAllRemove: string;

            pushover_DwdEnabled: boolean;
            pushover_UwzEnabled: boolean;
            pushover_ZamgEnabled: boolean;
            pushover_TypeFilter: number[];
            pushover_LevelFilter: number;
            pushover_Enabled: boolean;
            pushover_Adapter: string;
            pushover_MessageNew: string;
            pushover_MessageRemove: string;
            pushover_MessageAllRemove: string;
            pushover_Sound: string;
            pushover_Priority: boolean;
            pushover_Device: string;

            json_DwdEnabled: boolean;
            json_UwzEnabled: boolean;
            json_ZamgEnabled: boolean;
            json_TypeFilter: number[];
            json_LevelFilter: number;
            json_Enabled: boolean;
            json_MessageAll: string;
            json_MessageAllRemove: string;
            json_parse: boolean;

            history_DwdEnabled: boolean;
            history_UwzEnabled: boolean;
            history_ZamgEnabled: boolean;
            history_TypeFilter: number[];
            history_LevelFilter: number;
            history_Enabled: boolean;
            history_MessageNew: string;
            history_MessageRemove: string;
            history_allinOne: boolean;

            email_Adapter: string;
            email_line_break: string;
            email_DwdEnabled: boolean;
            email_UwzEnabled: boolean;
            email_ZamgEnabled: boolean;
            email_TypeFilter: number[];
            email_LevelFilter: number;
            email_Enabled: boolean;
            email_MessageNew: string;
            email_MessageRemove: string;
            email_Header: string;
            email_Footer: string;

            alexa2_Adapter: string;
            alexa2_DwdEnabled: boolean;
            alexa2_UwzEnabled: boolean;
            alexa2_ZamgEnabled: boolean;
            alexa2_TypeFilter: number[];
            alexa2_LevelFilter: number;
            alexa2_Enabled: boolean;
            alexa2_MessageNew: string;
            alexa2_MessageRemove: string;
            alexa2_MessageAllRemove: string;
            alexa2_device_ids: string[];
            alexa2_volumen: number;
            alexa2_Audio: string;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
