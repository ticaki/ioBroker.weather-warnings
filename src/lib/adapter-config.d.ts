// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            expandArray: boolean;

            dwdSelectId: number;
            zamgSelectID: string;
            useTestWarnings: boolean;
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

            dwdTypeFilter: string[];
            zamgTypeFilter: string[];
            uwzTypeFilter: string[];

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

            json_DwdEnabled: boolean;
            json_UwzEnabled: boolean;
            json_ZamgEnabled: boolean;
            json_TypeFilter: number[];
            json_LevelFilter: number;
            json_Enabled: boolean;
            json_MessageNew: string;
            json_MessageRemove: string;
            json_MessageAllRemove: string;
            json_parse: boolean;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
