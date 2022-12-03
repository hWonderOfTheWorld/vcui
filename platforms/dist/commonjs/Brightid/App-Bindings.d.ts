import { AppContext, Platform, ProviderPayload } from "../types";
export declare class BrightidPlatform implements Platform {
    platformId: string;
    path: string;
    clientId: string;
    redirectUri: string;
    handleVerifyContextId(userDid: string): Promise<boolean>;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
}
