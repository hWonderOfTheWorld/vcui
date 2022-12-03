import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export declare type GithubTokenResponse = {
    access_token: string;
};
export declare type GithubFindMyUserResponse = {
    id?: string;
    login?: string;
    type?: string;
};
export declare enum ClientType {
    GrantHub = 0
}
export declare type GHUserRequestPayload = RequestPayload & {
    requestedClient: ClientType;
    org?: string;
};
export declare class ClearTextGithubOrgProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: GHUserRequestPayload): Promise<VerifiedPayload>;
}
