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
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
