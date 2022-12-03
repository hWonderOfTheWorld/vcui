import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
export declare class SnapshotVotesProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
