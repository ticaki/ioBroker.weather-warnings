/// <reference types="vite/client" />

declare global {
    interface Window {
        adapterName: string;
        socketLoadedHandler?: () => void;
        registerSocketOnLoad: (cb: () => void) => void;
    }
}

export {};
