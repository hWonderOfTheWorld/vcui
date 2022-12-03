import type { RequestPayload } from "@gitcoin/passport-types";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
export declare const getRPCProvider: (payload: RequestPayload) => JsonRpcSigner | JsonRpcProvider;
export declare const getAddress: ({ address, signer, issuer }: RequestPayload) => Promise<string>;
