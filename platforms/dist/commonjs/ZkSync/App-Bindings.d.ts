import { AppContext, ProviderPayload } from "../types";
import { Platform } from "../utils/platform";
export declare class ZkSyncPlatform extends Platform {
    path: string;
    platformId: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
}
