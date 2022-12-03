import { Passport, Stamp, DID } from "@gitcoin/passport-types";
export declare abstract class DataStorageBase {
    abstract createPassport(): Promise<DID>;
    abstract getPassport(): Promise<Passport | undefined | false>;
    abstract addStamp(stamp: Stamp): Promise<void>;
}
