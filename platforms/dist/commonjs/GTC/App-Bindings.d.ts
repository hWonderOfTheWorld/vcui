import { AppContext, ProviderPayload } from "../types";
import { Platform } from "../utils/platform";
export declare class GTCPlatform extends Platform {
    platformId: string;
    path: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
}
