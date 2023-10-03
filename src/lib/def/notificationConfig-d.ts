import { NotificationClass, AllNotificationClass } from '../messages';

import { notificationServiceType, notificationServiceBaseType } from './notificationService-def';

export const notificationServiceDefaults: Record<notificationServiceType, Partial<notificationServiceBaseType>> = {
    telegram: {
        class: NotificationClass,
        useadapter: true,
    },
    pushover: {
        class: NotificationClass,
        useadapter: true,
    },
    whatsapp: {
        class: NotificationClass,
        useadapter: true,
    },
    json: {
        class: AllNotificationClass,
        useadapter: false,
    },
    history: {
        class: AllNotificationClass,
        useadapter: false,
    },
    email: {
        class: AllNotificationClass,
        useadapter: true,
    },
};
