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
exports.fetchVerifiableCredential = exports.fetchChallengeCredential = exports.verifyCredential = exports.issueHashedCredential = exports.issueChallengeCredential = exports.objToSortedArray = exports.CREDENTIAL_EXPIRES_AFTER_SECONDS = exports.CHALLENGE_EXPIRES_AFTER_SECONDS = exports.VERSION = void 0;
const axios_1 = __importDefault(require("axios"));
const base64 = __importStar(require("@ethersproject/base64"));
const crypto_1 = require("crypto");
exports.VERSION = "v0.0.0";
exports.CHALLENGE_EXPIRES_AFTER_SECONDS = 60;
exports.CREDENTIAL_EXPIRES_AFTER_SECONDS = 90 * 86400;
const addSeconds = (date, seconds) => {
    const result = new Date(date);
    result.setSeconds(result.getSeconds() + seconds);
    return result;
};
const objToSortedArray = (obj) => {
    const keys = Object.keys(obj).sort();
    return keys.reduce((out, key) => {
        out.push([key, obj[key]]);
        return out;
    }, []);
};
exports.objToSortedArray = objToSortedArray;
const _issueCredential = (DIDKit, key, expiresInSeconds, fields) => __awaiter(void 0, void 0, void 0, function* () {
    const issuer = DIDKit.keyToDID("key", key);
    const verificationMethod = yield DIDKit.keyToVerificationMethod("key", key);
    const verifyWithMethod = JSON.stringify({
        proofPurpose: "assertionMethod",
        verificationMethod,
    });
    const credential = yield DIDKit.issueCredential(JSON.stringify(Object.assign({ "@context": ["https://www.w3.org/2018/credentials/v1"], type: ["VerifiableCredential"], issuer, issuanceDate: new Date().toISOString(), expirationDate: addSeconds(new Date(), expiresInSeconds).toISOString() }, fields)), verifyWithMethod, key);
    return JSON.parse(credential);
});
const issueChallengeCredential = (DIDKit, key, record) => __awaiter(void 0, void 0, void 0, function* () {
    const credential = yield _issueCredential(DIDKit, key, exports.CHALLENGE_EXPIRES_AFTER_SECONDS, {
        credentialSubject: {
            "@context": [
                {
                    provider: "https://schema.org/Text",
                    challenge: "https://schema.org/Text",
                    address: "https://schema.org/Text",
                },
            ],
            id: `did:pkh:eip155:1:${record.address}`,
            provider: `challenge-${record.type}`,
            challenge: record.challenge,
            address: record.address,
        },
    });
    return {
        credential,
    };
});
exports.issueChallengeCredential = issueChallengeCredential;
const issueHashedCredential = (DIDKit, key, address, record) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = base64.encode((0, crypto_1.createHash)("sha256")
        .update(key, "utf-8")
        .update(JSON.stringify((0, exports.objToSortedArray)(record)))
        .digest());
    const credential = yield _issueCredential(DIDKit, key, exports.CREDENTIAL_EXPIRES_AFTER_SECONDS, {
        credentialSubject: {
            "@context": [
                {
                    hash: "https://schema.org/Text",
                    provider: "https://schema.org/Text",
                },
            ],
            id: `did:pkh:eip155:1:${address}`,
            provider: record.type,
            hash: `${exports.VERSION}:${hash}`,
        },
    });
    return {
        credential,
    };
});
exports.issueHashedCredential = issueHashedCredential;
const verifyCredential = (DIDKit, credential) => __awaiter(void 0, void 0, void 0, function* () {
    const { expirationDate, proof } = credential;
    if (new Date(expirationDate) > new Date()) {
        try {
            const verify = JSON.parse(yield DIDKit.verifyCredential(JSON.stringify(credential), `{"proofPurpose":"${proof.proofPurpose}"}`));
            return verify.errors.length === 0;
        }
        catch (e) {
            return false;
        }
    }
    else {
        return false;
    }
});
exports.verifyCredential = verifyCredential;
const fetchChallengeCredential = (iamUrl, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`${iamUrl.replace(/\/*?$/, "")}/v${payload.version}/challenge`, {
        payload: {
            address: payload.address,
            type: payload.type,
            signer: payload.signer,
        },
    });
    return {
        challenge: response.data.credential,
    };
});
exports.fetchChallengeCredential = fetchChallengeCredential;
const fetchVerifiableCredential = (iamUrl, payload, signer) => __awaiter(void 0, void 0, void 0, function* () {
    if (!signer) {
        throw new Error("Unable to sign message without a signer");
    }
    const { challenge } = yield (0, exports.fetchChallengeCredential)(iamUrl, payload);
    const signature = challenge.credentialSubject.challenge
        ? (yield signer.signMessage(challenge.credentialSubject.challenge)).toString()
        : "";
    if (!signature) {
        throw new Error("Unable to sign message");
    }
    payload.proofs = Object.assign(Object.assign({}, payload.proofs), { signature: signature });
    const response = yield axios_1.default.post(`${iamUrl.replace(/\/*?$/, "")}/v${payload.version}/verify`, {
        payload,
        challenge,
    });
    return {
        signature,
        challenge,
        error: Array.isArray(response.data) ? null : response.data.error,
        record: Array.isArray(response.data) ? null : response.data.record,
        credential: Array.isArray(response.data) ? null : response.data.credential,
        credentials: Array.isArray(response.data) ? response.data : null,
    };
});
exports.fetchVerifiableCredential = fetchVerifiableCredential;
//# sourceMappingURL=credentials.js.map