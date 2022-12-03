import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export declare type LinkedinTokenResponse = {
    access_token: string;
};
export declare type LinkedinFindMyUserResponse = {
    id?: string;
    firstName?: string;
    lastName?: string;
};
export declare class LinkedinProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
