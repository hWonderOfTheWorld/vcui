import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
export declare type FacebookDebugResponse = {
    app_id?: string;
    type?: string;
    application?: string;
    data_access_expires_at?: number;
    expires_at?: number;
    is_valid?: boolean;
    scopes?: string[];
    user_id?: string;
};
declare type Response = {
    data?: {
        data: FacebookDebugResponse;
    };
    status?: number;
    statusText?: string;
    headers?: {
        [key: string]: string;
    };
};
export declare class FacebookProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare function verifyFacebook(userAccessToken: string): Promise<Response>;
export {};
