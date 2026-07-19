// Type-only declaration of the main adapter class for the lib files.
//
// main.ts stays a pure CommonJS module (its only export is `module.exports = factory`
// for the compact-mode loader, see #317), so it must NOT carry any ES `export`
// statement — otherwise esbuild treats it as an ES module and the required
// `module.exports = …` triggers a "commonjs-variable-in-esm" warning. This file
// mirrors the public surface of the `WeatherWarnings` class that the lib modules
// actually touch; everything else is inherited from utils.Adapter.
import * as utils from '@iobroker/adapter-core';
import type { Library } from './library';
import type { ProviderController } from './provider';

export declare class WeatherWarnings extends utils.Adapter {
    library: Library;
    providerController: ProviderController | null;
    fetch(url: string, init?: RequestInit, timeout?: number): Promise<unknown>;
    handleFetchError(error: any): void;
}
