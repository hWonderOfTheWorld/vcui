import { AppContext, Platform, ProviderPayload } from "../types";
export declare class GTCStakingPlatform implements Platform {
    platformId: string;
    path: string;
    clientId: string;
    redirectUri: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
    getOAuthUrl(state: string): Promise<string>;
}
