import type { ProviderContext, RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export declare type GithubTokenResponse = {
    access_token: string;
};
export declare type GithubFindMyUserResponse = {
    id?: string;
    login?: string;
    followers?: number;
    type?: string;
};
export declare class TenOrMoreGithubFollowers implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload, context: ProviderContext): Promise<VerifiedPayload>;
}
export declare class FiftyOrMoreGithubFollowers implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload, context: ProviderContext): Promise<VerifiedPayload>;
}
