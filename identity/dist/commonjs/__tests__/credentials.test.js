"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const credentials_1 = require("../src/credentials");
const base64 = __importStar(require("@ethersproject/base64"));
const crypto_1 = require("crypto");
const axios_1 = require("../__mocks__/axios");
const mockDIDKit = __importStar(require("../__mocks__/didkit"));
const axios_2 = __importDefault(require("axios"));
const DIDKit = mockDIDKit;
const key = "SAMPLE_KEY";
describe("Fetch Credentials", function () {
    const IAM_URL = "iam.example";
    const payload = {
        address: "0x0",
        type: "Simple",
        version: "Test-Case-1",
    };
    const MOCK_SIGNATURE = "Signed Message";
    const MOCK_SIGNER = { signMessage: jest.fn().mockImplementation(() => Promise.resolve(MOCK_SIGNATURE)) };
    const IAM_CHALLENGE_ENDPOINT = `${IAM_URL}/v${payload.version}/challenge`;
    const expectedChallengeRequestBody = { payload: { address: payload.address, type: payload.type } };
    const IAM_VERIFY_ENDPOINT = `${IAM_URL}/v${payload.version}/verify`;
    const expectedVerifyRequestBody = {
        payload: Object.assign(Object.assign({}, payload), { proofs: { signature: MOCK_SIGNATURE } }),
        challenge: axios_1.MOCK_CHALLENGE_CREDENTIAL,
    };
    beforeEach(() => {
        MOCK_SIGNER.signMessage.mockClear();
        (0, axios_1.clearAxiosMocks)();
    });
    it("can fetch a challenge credential", () => __awaiter(this, void 0, void 0, function* () {
        const { challenge: actualChallenge } = yield (0, credentials_1.fetchChallengeCredential)(IAM_URL, payload);
        expect(axios_2.default.post).toHaveBeenCalled();
        expect(axios_2.default.post).toHaveBeenCalledWith(IAM_CHALLENGE_ENDPOINT, expectedChallengeRequestBody);
        expect(actualChallenge).toEqual(axios_1.MOCK_CHALLENGE_CREDENTIAL);
    }));
    it("can fetch a verifiable credential", () => __awaiter(this, void 0, void 0, function* () {
        const { credential, record, signature, challenge } = yield (0, credentials_1.fetchVerifiableCredential)(IAM_URL, payload, MOCK_SIGNER);
        expect(axios_2.default.post).toHaveBeenCalledTimes(2);
        expect(axios_2.default.post).toHaveBeenNthCalledWith(1, IAM_CHALLENGE_ENDPOINT, expectedChallengeRequestBody);
        expect(axios_2.default.post).toHaveBeenNthCalledWith(2, IAM_VERIFY_ENDPOINT, expectedVerifyRequestBody);
        expect(MOCK_SIGNER.signMessage).toHaveBeenCalled();
        expect(MOCK_SIGNER.signMessage).toHaveBeenCalledWith(axios_1.MOCK_CHALLENGE_VALUE);
        expect(signature).toEqual(MOCK_SIGNATURE);
        expect(challenge).toEqual(axios_1.MOCK_CHALLENGE_CREDENTIAL);
        expect(credential).toEqual(axios_1.MOCK_VERIFY_RESPONSE_BODY.credential);
        expect(record).toEqual(axios_1.MOCK_VERIFY_RESPONSE_BODY.record);
    }));
    it("will fail if not provided a signer to sign the message", () => __awaiter(this, void 0, void 0, function* () {
        yield expect((0, credentials_1.fetchVerifiableCredential)(IAM_URL, payload, undefined)).rejects.toThrow("Unable to sign message without a signer");
        expect(axios_2.default.post).not.toBeCalled();
    }));
    it("will throw if signer rejects request for signature", () => __awaiter(this, void 0, void 0, function* () {
        MOCK_SIGNER.signMessage.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            throw new Error("Unable to sign");
        }));
        yield expect((0, credentials_1.fetchVerifiableCredential)(IAM_URL, payload, MOCK_SIGNER)).rejects.toThrow("Unable to sign");
        expect(MOCK_SIGNER.signMessage).toHaveBeenCalled();
    }));
    it("will not attempt to sign if not provided a challenge in the challenge credential", () => __awaiter(this, void 0, void 0, function* () {
        jest.spyOn(axios_2.default, "post").mockResolvedValueOnce({
            data: {
                credential: {
                    credentialSubject: {
                        challenge: null,
                    },
                },
            },
        });
        yield expect((0, credentials_1.fetchVerifiableCredential)(IAM_URL, payload, MOCK_SIGNER)).rejects.toThrow("Unable to sign message");
        expect(axios_2.default.post).toHaveBeenNthCalledWith(1, IAM_CHALLENGE_ENDPOINT, expectedChallengeRequestBody);
        expect(MOCK_SIGNER.signMessage).not.toBeCalled();
    }));
});
describe("Generate Credentials", function () {
    beforeEach(() => {
        mockDIDKit.clearDidkitMocks();
    });
    it("can generate a challenge credential", () => __awaiter(this, void 0, void 0, function* () {
        const record = {
            type: "Simple",
            address: "0x0",
            version: "Test-Case-1",
            challenge: "randomChallengeString",
        };
        const { credential } = yield (0, credentials_1.issueChallengeCredential)(DIDKit, key, record);
        expect(DIDKit.issueCredential).toHaveBeenCalled();
        expect(credential.credentialSubject.id).toEqual(`did:pkh:eip155:1:${record.address}`);
        expect(credential.credentialSubject.provider).toEqual(`challenge-${record.type}`);
        expect(credential.credentialSubject.challenge).toEqual(record.challenge);
        expect(credential.credentialSubject.address).toEqual(record.address);
        expect(typeof credential.proof).toEqual("object");
    }));
    it("can convert an object to an sorted array for deterministic hashing", () => __awaiter(this, void 0, void 0, function* () {
        const record = {
            type: "Simple",
            address: "0x0",
            version: "Test-Case-1",
            email: "my_own@email.com",
        };
        expect((0, credentials_1.objToSortedArray)(record)).toEqual([
            ["address", "0x0"],
            ["email", "my_own@email.com"],
            ["type", "Simple"],
            ["version", "Test-Case-1"],
        ]);
    })),
        it("can generate a credential containing hash", () => __awaiter(this, void 0, void 0, function* () {
            const record = {
                type: "Simple",
                version: "Test-Case-1",
                address: "0x0",
            };
            const expectedHash = "v0.0.0:" + base64.encode((0, crypto_1.createHash)("sha256").update(key).update(JSON.stringify((0, credentials_1.objToSortedArray)(record))).digest());
            const { credential } = yield (0, credentials_1.issueHashedCredential)(DIDKit, key, "0x0", record);
            expect(DIDKit.issueCredential).toHaveBeenCalled();
            expect(credential.credentialSubject.id).toEqual(`did:pkh:eip155:1:${record.address}`);
            expect(credential.credentialSubject.provider).toEqual(`${record.type}`);
            expect(typeof credential.credentialSubject.hash).toEqual("string");
            expect(credential.credentialSubject.hash).toEqual(expectedHash);
            expect(typeof credential.proof).toEqual("object");
        }));
});
describe("Verify Credentials", function () {
    beforeEach(() => {
        mockDIDKit.clearDidkitMocks();
    });
    it("can verify a credential", () => __awaiter(this, void 0, void 0, function* () {
        const record = {
            type: "Simple",
            version: "Test-Case-1",
            address: "0x0",
        };
        const { credential: credentialToVerify } = yield (0, credentials_1.issueHashedCredential)(DIDKit, key, "0x0", record);
        expect(yield (0, credentials_1.verifyCredential)(DIDKit, credentialToVerify)).toEqual(true);
        expect(DIDKit.verifyCredential).toHaveBeenCalled();
        expect(DIDKit.verifyCredential).toHaveBeenCalledWith(JSON.stringify(credentialToVerify), expect.anything());
    }));
    it("cannot verify a valid but expired credential", () => __awaiter(this, void 0, void 0, function* () {
        const expired = new Date();
        expired.setSeconds(expired.getSeconds() - 1);
        const credential = {
            expirationDate: expired.toISOString(),
        };
        expect(yield (0, credentials_1.verifyCredential)(DIDKit, credential)).toEqual(false);
        expect(DIDKit.verifyCredential).not.toBeCalled();
    }));
    it("returns false when DIDKit.verifyCredential returns with errors", () => __awaiter(this, void 0, void 0, function* () {
        const futureExpirationDate = new Date();
        futureExpirationDate.setFullYear(futureExpirationDate.getFullYear() + 1);
        const credentialToVerify = {
            expirationDate: futureExpirationDate.toISOString(),
            proof: {
                proofPurpose: "myProof",
            },
        };
        mockDIDKit.verifyCredential.mockResolvedValue(JSON.stringify({ checks: ["proof"], warnings: [], errors: ["signature error"] }));
        expect(yield (0, credentials_1.verifyCredential)(DIDKit, credentialToVerify)).toEqual(false);
        expect(DIDKit.verifyCredential).toHaveBeenCalled();
    }));
    it("returns false when DIDKit.verifyCredential rejects with an exception", () => __awaiter(this, void 0, void 0, function* () {
        const futureExpirationDate = new Date();
        futureExpirationDate.setFullYear(futureExpirationDate.getFullYear() + 1);
        const credentialToVerify = {
            expirationDate: futureExpirationDate.toISOString(),
            proof: {
                proofPurpose: "myProof",
            },
        };
        mockDIDKit.verifyCredential.mockRejectedValue(new Error("something went wrong :("));
        expect(yield (0, credentials_1.verifyCredential)(DIDKit, credentialToVerify)).toEqual(false);
        expect(DIDKit.verifyCredential).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=credentials.test.js.map