import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";
export declare const stakingSubgraph = "https://api.thegraph.com/subgraphs/name/moonshotcollective/id-staking";
interface Round {
    id: string;
}
interface XStake {
    round: Round;
    total: string;
}
interface XStakeArray {
    xstakeAggregates: Array<XStake>;
}
interface UsersArray {
    address: string;
    users: Array<XStakeArray>;
}
interface StakeData {
    data: UsersArray;
}
export interface DataResult {
    data: StakeData;
}
export declare class CommunityStakingBronzeProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare class CommunityStakingSilverProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export declare class CommunityStakingGoldProvider implements Provider {
    type: string;
    _options: {};
    constructor(options?: ProviderOptions);
    verify(payload: RequestPayload): Promise<VerifiedPayload>;
}
export {};
