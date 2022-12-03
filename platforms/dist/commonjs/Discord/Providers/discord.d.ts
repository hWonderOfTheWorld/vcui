import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export declare type DiscordTokenResponse = {
    access_token: string;
};
export declare type DiscordFindMyUserResponse = {
    user?: {
        id?: string;
        username?: string;
    };
};
export declare class DiscordProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
