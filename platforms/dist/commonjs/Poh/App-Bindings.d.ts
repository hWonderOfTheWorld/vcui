import { AppContext, Platform, ProviderPayload } from "../types";
export declare class PohPlatform implements Platform {
    platformId: string;
    path: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
}
