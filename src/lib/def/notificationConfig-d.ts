import * as NotificationType from './notificationService-def';

export const notificationServiceDefaults: Record<NotificationType.Type, Partial<NotificationType.BaseType>> = {
    telegram: {
        useadapter: true,
    },
    pushover: {
        useadapter: true,
    },
    whatsapp: {
        useadapter: true,
    },
    json: {
        useadapter: false,
    },
    history: {
        useadapter: false,
    },
    email: {
        useadapter: true,
    },
};
