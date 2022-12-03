import { PlatformOptions } from "../types";
import { Platform } from "../utils/platform";
export declare class LinkedinPlatform extends Platform {
    platformId: string;
    path: string;
    constructor(options?: PlatformOptions);
    getOAuthUrl(state: string): Promise<string>;
}
