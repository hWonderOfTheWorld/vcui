import { Platform } from "../utils/platform";
export declare class TwitterPlatform extends Platform {
    platformId: string;
    path: string;
    getOAuthUrl(): Promise<string>;
}
