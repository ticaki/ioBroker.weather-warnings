import { messageFilterType } from './provider-def';

export type notificationServiceType = 'telegram' | 'pushover' | 'whatsapp';
export const notificationServiceValue: notificationServiceType[] = ['telegram', 'pushover', 'whatsapp'];

export type notificationServiceOptionsType = {
    telegram?: {
        name: 'telegram';
    } & notificationServiceBaseType;
    pushover?: {
        name: 'pushover';
    } & notificationServiceBaseType;
    whatsapp?: {
        name: 'whatsapp';
    } & notificationServiceBaseType;
};
export type notificationServiceBaseType = {
    dwdService: boolean;
    uwzService: boolean;
    zamgService: boolean;
    filter: messageFilterType;
    adapter: string;
    name: notificationServiceType;
};
