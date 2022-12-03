import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
export declare const RPC_URL: string;
export declare function getTokenBalance(address: string, tokenContractAddress: string, decimalNumber: number): Promise<number>;
export declare function getEthBalance(address: string): Promise<number>;
export declare type ethErc20PossessionProviderOptions = {
    threshold: number;
    recordAttribute: string;
    contractAddress: string;
    decimalNumber: number;
    error: string;
};
export declare class EthErc20PossessionProvider implements Provider {
    type: string;
    _options: ethErc20PossessionProviderOptions;
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
