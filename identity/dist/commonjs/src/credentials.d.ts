import { DIDKitLib, ProofRecord, RequestPayload, VerifiableCredential, IssuedCredential, IssuedChallenge, VerifiableCredentialRecord } from "@gitcoin/passport-types";
export declare const VERSION = "v0.0.0";
export declare const CHALLENGE_EXPIRES_AFTER_SECONDS = 60;
export declare const CREDENTIAL_EXPIRES_AFTER_SECONDS: number;
export declare const objToSortedArray: (obj: {
    [k: string]: string;
}) => string[][];
export declare const issueChallengeCredential: (DIDKit: DIDKitLib, key: string, record: RequestPayload) => Promise<IssuedCredential>;
export declare const issueHashedCredential: (DIDKit: DIDKitLib, key: string, address: string, record: ProofRecord) => Promise<IssuedCredential>;
export declare const verifyCredential: (DIDKit: DIDKitLib, credential: VerifiableCredential) => Promise<boolean>;
export declare const fetchChallengeCredential: (iamUrl: string, payload: RequestPayload) => Promise<IssuedChallenge>;
export declare const fetchVerifiableCredential: (iamUrl: string, payload: RequestPayload, signer: {
    signMessage: (message: string) => Promise<string>;
}) => Promise<VerifiableCredentialRecord>;
