import type { ProviderContext, RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export declare type GithubTokenResponse = {
    access_token: string;
};
export declare class ForkedGithubRepoProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload, context: ProviderContext): Promise<VerifiedPayload>;
}
