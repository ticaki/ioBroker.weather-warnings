import { AllNotificationClass, NotificationClass } from '../messages';
import { messageFilterType, providerServices } from './provider-def';

export type notificationServiceType = Required<keyof notificationServiceOptionsType>;

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
    email?: {
        name: 'email';
    } & notificationServiceBaseType;
};
export type notificationServiceBaseType = {
    service: providerServices[];
    filter: messageFilterType;
    adapter: string;
    name: notificationServiceType;
    template: notificationTemplateType;
    class: any;
};

export type notificationTemplateUnionType = keyof notificationTemplateType;

export type notificationTemplateType = {
    new: string;
    remove: string;
    removeAll: string;
    all: string;
};

export type notificationServiceConfigType = {
    notifications: notificationTemplateUnionType[];
};
const push: notificationTemplateUnionType[] = ['new', 'remove', 'removeAll'];
const history: notificationTemplateUnionType[] = ['new', 'remove'];
const json: notificationTemplateUnionType[] = ['new', 'all', 'removeAll'];
const email: notificationTemplateUnionType[] = ['new', 'all', 'removeAll', 'remove'];

//const speak: notificationTemplateUnionType[] = ['new', 'remove', 'removeAll'];
export const serciceCapabilities: Record<notificationServiceType, notificationServiceConfigType> = {
    telegram: { notifications: push },
    email: { notifications: email },
    json: { notifications: json },
    whatsapp: { notifications: push },
    pushover: { notifications: push },
    history: { notifications: history },
};
export const notificationServiceDefaults: Record<notificationServiceType, Partial<notificationServiceBaseType>> = {
    telegram: {
        class: NotificationClass,
    },
    pushover: {
        class: NotificationClass,
    },
    whatsapp: {
        class: NotificationClass,
    },
    json: {
        class: AllNotificationClass,
    },
    history: {
        class: AllNotificationClass,
    },
    email: {
        class: AllNotificationClass,
    },
};

export const notificationServiceArray: notificationServiceType[] = [
    'telegram',
    'pushover',
    'whatsapp',
    'json',
    'history',
    'email',
];
