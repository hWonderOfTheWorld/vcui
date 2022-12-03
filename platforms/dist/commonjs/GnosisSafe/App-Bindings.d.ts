import { AppContext, ProviderPayload } from "../types";
import { Platform } from "../utils/platform";
export declare class GnosisSafePlatform extends Platform {
    platformId: string;
    path: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
}
