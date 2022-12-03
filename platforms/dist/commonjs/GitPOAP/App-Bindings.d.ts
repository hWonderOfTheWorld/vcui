import { AppContext, Platform, ProviderPayload } from "../types";
export declare class GitPOAPPlatform implements Platform {
    platformId: string;
    path: string;
    clientId: string;
    redirectUri: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
}
