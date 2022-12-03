import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
export declare type FacebookProfileResponse = {
    id: string;
    picture: {
        data: {
            is_silhouette: boolean;
        };
    };
};
export declare class FacebookProfilePictureProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
