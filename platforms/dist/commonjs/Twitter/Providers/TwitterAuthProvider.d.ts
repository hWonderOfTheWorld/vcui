import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
import type { Provider, ProviderOptions } from "../../types";
export default class TwitterProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
