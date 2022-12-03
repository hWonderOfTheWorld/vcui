import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
interface EtherscanRequestResponse {
    status?: number;
    data?: {
        result?: [
            {
                from?: string;
                gasUsed?: string;
                isError?: string;
                timeStamp?: string;
            }
        ];
    };
}
export declare class EthGasProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare class FirstEthTxnProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare class EthGTEOneTxnProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare const requestEthData: (address: string, offsetCount: number) => Promise<EtherscanRequestResponse["data"]>;
export {};
