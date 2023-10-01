import { messageFilterType, providerServices } from './provider-def';

export type notificationServiceType = 'telegram' | 'pushover' | 'whatsapp' | 'json' | 'history';
export const notificationServiceArray: notificationServiceType[] = [
    'telegram',
    'pushover',
    'whatsapp',
    'json',
    'history',
];

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
    history?: {
        name: 'history';
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
