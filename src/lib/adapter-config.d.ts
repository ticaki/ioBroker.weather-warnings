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
            iobrokerUrl: string;

            numOfRawWarnings: number;

            imExpert: boolean;
            notPushAtStart: boolean;

            alexa2_sounds: { warntype: string; sound: string; warntypenumber: number }[];
            alexa2_sounds_enabled: boolean;

            silentTime: Array<{
                profil?: string;
                speakProfile: string;
                silentTime: Array<{
                    day: Array<string>;
                    start: string;
                    end: string;
                }>;
            }>;

            icons_prefix: string;
            icons_suffix: string;
            icons_description: string;

            dwdwarncellTable: { dwdSelectId: number; dwdCityname: string }[];
            uwzwarncellTable: { uwzSelectId: string; uwzCityname: string; realWarncell: string }[];
            zamgwarncellTable: { zamgSelectId: string; zamgCityname: string }[];

            dwdEnabled: boolean;
            zamgEnabled: boolean;
            uwzEnabled: boolean;
            refreshTime: number;
            templateTable: {
                templateKey: string;
                template: string;
            }[];
            templateHelp: string;

            dwdLanguage: string;
            uwzLanguage: string;
            zamgLanguage: string;

            dwdHourFilter: number;
            uwzHourFilter: number;
            zamgHourFilter: number;

            dwdTypeFilter: number[];
            zamgTypeFilter: number[];
            uwzTypeFilter: number[];

            dwdLevelFilter: number;
            uwzLevelFilter: number;
            zamgLevelFilter: number;

            zamgEveryChange: boolean;

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
            telegram_parse_mode: string;

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
            whatsapp_Phonenumber: string;

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
            pushover_Title: string;
            
            gotify_DwdEnabled: boolean;
            gotify_UwzEnabled: boolean;
            gotify_ZamgEnabled: boolean;
            gotify_TypeFilter: number[];
            gotify_LevelFilter: number;
            gotify_Enabled: boolean;
            gotify_Adapter: string;
            gotify_MessageNew: string;
            gotify_MessageRemove: string;
            gotify_MessageAllRemove: string;
            gotify_contentType: "text/plain" | "text/markdown" | undefined;
            gotify_Priority: string;
            gotify_Title: string;

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
            email_Title: string;

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

            sayit_Adapter_Array: { sayit_Adapter: string }[];
            sayit_DwdEnabled: boolean;
            sayit_UwzEnabled: boolean;
            sayit_ZamgEnabled: boolean;
            sayit_TypeFilter: number[];
            sayit_LevelFilter: number;
            sayit_Enabled: boolean;
            sayit_MessageNew: string;
            sayit_MessageRemove: string;
            sayit_MessageAllRemove: string;
            sayit_volumen: number;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
