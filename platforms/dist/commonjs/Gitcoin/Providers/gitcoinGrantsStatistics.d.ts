import type { ProviderContext, RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export declare type GitcoinGrantStatistics = {
    errors?: string[] | undefined;
    record?: {
        [k: string]: number;
    };
};
export declare type GitcoinGrantProviderOptions = {
    threshold: number;
    receivingAttribute: string;
    recordAttribute: string;
};
export declare class GitcoinGrantStatisticsProvider implements Provider {
    type: string;
    dataUrl: string;
    _options: GitcoinGrantProviderOptions;
    constructor(providerTypePrefix: string, options?: ProviderOptions);
    verify(payload: RequestPayload, context: ProviderContext): Promise<VerifiedPayload>;
}
