import { ProviderPayload } from "../types";
import { Platform } from "../utils/platform";
export declare class FacebookPlatform extends Platform {
    path: string;
    platformId: string;
    getProviderPayload(): Promise<ProviderPayload>;
}
