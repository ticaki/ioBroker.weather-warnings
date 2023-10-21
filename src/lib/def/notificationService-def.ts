import { MessagesClass } from '../messages';
import * as NotificationType from './notificationService-def';
import { ProviderClassType, messageFilterType, providerServices } from './provider-def';

export type Type = Required<keyof OptionsType>;
export type OptionsType = {
    telegram?: {
        name: 'telegram';
    } & BaseType;
    pushover?: {
        name: 'pushover';
    } & BaseType;
    whatsapp?: {
        name: 'whatsapp';
    } & BaseType;
    json?: {
        name: 'json';
    } & BaseType;
    history?: {
        name: 'history';
    } & BaseType;
    email?: {
        name: 'email';
    } & BaseType;
    alexa2?: {
        name: 'alexa2';
    } & BaseType;
};

export type BaseType =
    | ({
          name: 'telegram';
          userid: string;
          chatid: string;
          withNoSound: boolean;
          parse_mode: string;
      } & bBaseType)
    | ({
          name: 'pushover';
          headline: string;
          sound: string;
          priority: boolean;
          device: string;
      } & bBaseType)
    | ({
          name: 'whatsapp';
          phonenumber: string;
      } & bBaseType)
    | ({
          name: 'json';
      } & bBaseType)
    | ({
          name: 'history';
      } & bBaseType)
    | ({
          name: 'email';
      } & bBaseType)
    | ({
          name: 'alexa2';
          volumen: string;
          audio: string;
          sounds: { warntype: string; sound: string; warntypenumber: number }[];
          sounds_enabled: boolean;
      } & bBaseType);

type bBaseType = {
    service: providerServices[];
    filter: {
        auto: messageFilterType;
        manual?: messageFilterType;
    };
    adapter: string;
    name: Type;
    actions: ActionsType;
    useadapter: boolean;
    notifications: ActionsUnionType[];
};

export type ActionsUnionType = keyof ActionsType;

export type ActionsType = {
    new: string;
    remove: string;
    removeAll: string;
    all: string;
    header?: string;
    footer?: string;
    manualAll?: string;
};

export type ConfigType = {
    notifications: ActionsUnionType[];
};

/**
 * new: send new messages for new Warnings
 * all: send all messages always (with new, only if a new warning comes up)
 * removeAll: send remove all messages
 * remove: send a remove message for a removed warning
 */
export const manual: ActionsUnionType[] = ['manualAll'];

const push: ActionsUnionType[] = [...manual, 'new', 'remove', 'removeAll'];
const history: ActionsUnionType[] = ['new', 'remove'];
const json: ActionsUnionType[] = ['all', 'removeAll'];
const email: ActionsUnionType[] = [...manual, 'new', 'all', 'removeAll', 'remove'];

//const speak: ActionsUnionType[] = ['new', 'remove', 'removeAll'];
export const serciceCapabilities: Record<Type, ConfigType> = {
    telegram: { notifications: push },
    email: { notifications: email },
    json: { notifications: json },
    whatsapp: { notifications: push },
    pushover: { notifications: push },
    history: { notifications: history },
    alexa2: { notifications: push },
};

export const Array: Type[] = ['telegram', 'pushover', 'whatsapp', 'json', 'history', 'email', 'alexa2'];

export type MessageType = {
    text: string;
    startts: number;
    template: string;
    action?: keyof ActionsType;
    provider?: ProviderClassType;
    message?: MessagesClass;
};

export type pushover_options = {
    message: string;
    title?: string;
    device?: string;
    sound?: string;
    priority?: number;
};
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
    alexa2: {
        useadapter: true,
    },
};
