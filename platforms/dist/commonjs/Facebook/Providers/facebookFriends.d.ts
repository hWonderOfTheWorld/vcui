import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
export declare type FacebookFriendsResponse = {
    data?: [];
    paging?: {
        before: string;
        after: string;
    };
    summary?: {
        total_count?: number;
    };
};
export declare class FacebookFriendsProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
