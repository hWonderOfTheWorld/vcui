import { AppContext, ProviderPayload } from "../types";
export declare type PlatformOptions = {
    platformId: string;
    path: string;
    clientId?: string;
    redirectUri?: string;
    state?: string;
};
export declare class Platform {
    platformId: string;
    path: string;
    clientId?: string;
    redirectUri?: string;
    state?: string;
    getProviderPayload(appContext: AppContext): Promise<ProviderPayload>;
    getOAuthUrl(state?: string): Promise<string>;
}
