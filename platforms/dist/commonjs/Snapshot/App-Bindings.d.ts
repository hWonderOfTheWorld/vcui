import { AppContext, Platform, ProviderPayload } from "../types";
export declare class SnapshotPlatform implements Platform {
    platformId: string;
    path: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
}
