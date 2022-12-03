import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export declare type UserInfo = {
    errors?: string[] | undefined;
    email?: string;
    emailVerified?: boolean;
};
export declare type OAuthToken = {
    errors?: string[] | undefined;
    email?: string;
    emailVerified?: boolean;
};
export declare type GoogleTokenResponse = {
    access_token: string;
};
export declare type GoogleUserInfo = {
    email?: string;
    verified_email?: boolean;
};
export declare class GoogleProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare const requestAccessToken: (code: string) => Promise<string>;
export declare const verifyGoogle: (code: string) => Promise<UserInfo>;
