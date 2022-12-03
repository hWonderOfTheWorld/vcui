import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
export declare type GitPOAP = {
    gitPoapId: number;
    name: string;
    year: number;
    description: string;
    repositories: string[];
    earnedAt: string;
    mintedAt: string;
};
export declare class GitPOAPProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
