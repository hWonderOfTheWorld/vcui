import { PlatformOptions } from "../types";
import { Platform } from "../utils/platform";
export declare class GitcoinPlatform extends Platform {
    platformId: string;
    path: string;
    clientId: string;
    redirectUri: string;
    constructor(options?: PlatformOptions);
    getOAuthUrl(state: string): Promise<string>;
}
