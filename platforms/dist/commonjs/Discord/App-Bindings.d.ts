import { PlatformOptions } from "../types";
import { Platform } from "../utils/platform";
export declare class DiscordPlatform extends Platform {
    path: string;
    platformId: string;
    clientId: string;
    redirectUri: string;
    constructor(options?: PlatformOptions);
    getOAuthUrl(state: string): Promise<string>;
}
