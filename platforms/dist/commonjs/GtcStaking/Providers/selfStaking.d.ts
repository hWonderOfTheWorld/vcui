import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
export declare const stakingSubgraph = "https://api.thegraph.com/subgraphs/name/moonshotcollective/id-staking";
interface Round {
    id: string;
}
interface Stake {
    round: Round;
    stake: string;
}
interface StakeArray {
    stakes: Array<Stake>;
}
interface UsersArray {
    address: string;
    users: Array<StakeArray>;
}
interface StakeData {
    data: UsersArray;
}
export interface DataResult {
    data: StakeData;
}
export declare class SelfStakingBronzeProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare class SelfStakingSilverProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare class SelfStakingGoldProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export {};
