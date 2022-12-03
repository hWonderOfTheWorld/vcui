import type { ProviderContext, RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export declare type GithubTokenResponse = {
    access_token: string;
};
export declare type GithubFindMyUserResponse = {
    errors?: string[] | undefined;
    id?: string;
    login?: string;
    type?: string;
};
export declare class GithubProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload, context: ProviderContext): Promise<VerifiedPayload>;
}
export declare const requestAccessToken: (code: string, context: ProviderContext) => Promise<string>;
export declare const verifyGithub: (code: string, context: ProviderContext) => Promise<GithubFindMyUserResponse>;
