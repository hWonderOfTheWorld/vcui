import { AppContext, ProviderPayload } from "../types";
import { Platform } from "../utils/platform";
export declare class ETHPlatform extends Platform {
    platformId: string;
    path: string;
    clientId: string;
    redirectUri: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
}
