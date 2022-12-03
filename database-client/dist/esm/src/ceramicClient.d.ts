import { DID, Passport, PROVIDER_ID, Stamp, VerifiableCredential } from "@gitcoin/passport-types";
import type { CeramicApi } from "@ceramicnetwork/common";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { TileLoader } from "@glazed/tile-loader";
import type { DID as CeramicDID } from "dids";
import { DataStorageBase } from "./types";
declare type CeramicStamp = {
    provider: string;
    credential: string;
};
declare type CeramicPassport = {
    issuanceDate: string;
    expiryDate: string;
    stamps: CeramicStamp[];
};
export declare type ModelTypes = {
    schemas: {
        Passport: CeramicPassport;
        VerifiableCredential: VerifiableCredential;
    };
    definitions: {
        Passport: "Passport";
        VerifiableCredential: "VerifiableCredential";
    };
    tiles: {};
};
export declare type Logger = {
    error: (msg: string, context?: object) => void;
    log: (msg: string, context?: object) => void;
    warn: (msg: string, context?: object) => void;
    debug: (msg: string, context?: object) => void;
    info: (msg: string, context?: object) => void;
};
export declare class CeramicDatabase implements DataStorageBase {
    did: string;
    loader: TileLoader;
    ceramicClient: CeramicApi;
    model: DataModel<ModelTypes>;
    store: DIDDataStore<ModelTypes>;
    logger: Logger;
    apiHost: string;
    constructor(did?: CeramicDID, ceramicHost?: string, aliases?: any, logger?: Logger);
    createPassport(): Promise<DID>;
    getPassport(): Promise<Passport | undefined | false>;
    addStamp(stamp: Stamp): Promise<void>;
    addStamps(stamps: Stamp[]): Promise<void>;
    deleteStamps(providerIds: PROVIDER_ID[]): Promise<void>;
    deleteStamp(streamId: string): Promise<void>;
    deletePassport(): Promise<void>;
}
export {};
