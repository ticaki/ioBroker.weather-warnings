import { messageFilterType, providerServices } from './provider-def';

export type notificationServiceType = 'telegram' | 'pushover' | 'whatsapp' | 'json';
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
    json?: {
        name: 'json';
    } & notificationServiceBaseType;
};
export type notificationServiceBaseType = {
    service: providerServices[];
    filter: messageFilterType;
    adapter: string;
    name: notificationServiceType;
    template: notificationTemplateType;
};

export type notificationTemplateUnionType = keyof notificationTemplateType;

export type notificationTemplateType = {
    new: string;
    remove: string;
    removeAll: string;
    all: string;
};
