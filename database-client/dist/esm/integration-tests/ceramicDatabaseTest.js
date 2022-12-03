var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import testnetAliases from "./integration-test-model-aliases.json";
import { CeramicDatabase } from "../src";
var testDID;
var ceramicDatabase;
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var TEST_SEED;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                TEST_SEED = Uint8Array.from({ length: 32 }, function () { return Math.floor(Math.random() * 256); });
                testDID = new DID({
                    provider: new Ed25519Provider(TEST_SEED),
                    resolver: getResolver(),
                });
                return [4, testDID.authenticate()];
            case 1:
                _a.sent();
                ceramicDatabase = new CeramicDatabase(testDID, process.env.CERAMIC_CLIENT_URL, testnetAliases);
                return [2];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, ceramicDatabase.store.remove("Passport")];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); });
describe("when there is no passport for the given did", function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.store.remove("Passport")];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it("createPassport creates a passport in ceramic", function () { return __awaiter(void 0, void 0, void 0, function () {
        var actualPassportStreamID, storedPassport, formattedDate, todaysDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.createPassport()];
                case 1:
                    actualPassportStreamID = _a.sent();
                    expect(actualPassportStreamID).toBeDefined();
                    return [4, ceramicDatabase.loader.load(actualPassportStreamID)];
                case 2:
                    storedPassport = (_a.sent()).content;
                    formattedDate = new Date(storedPassport["issuanceDate"]);
                    todaysDate = new Date();
                    expect(formattedDate.getDay()).toEqual(todaysDate.getDay());
                    expect(formattedDate.getMonth()).toEqual(todaysDate.getMonth());
                    expect(formattedDate.getFullYear()).toEqual(todaysDate.getFullYear());
                    expect(storedPassport["stamps"]).toEqual([]);
                    return [2];
            }
        });
    }); });
    it("getPassport returns false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var actualPassport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.getPassport()];
                case 1:
                    actualPassport = _a.sent();
                    expect(actualPassport).toEqual(false);
                    return [2];
            }
        });
    }); });
});
describe("when there is an existing passport without stamps for the given did", function () {
    var existingPassport = {
        issuanceDate: new Date("2022-01-01"),
        expiryDate: new Date("2022-01-02"),
        stamps: [],
    };
    var existingPassportStreamID;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var ceramicPassport, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ceramicPassport = {
                        issuanceDate: existingPassport.issuanceDate,
                        expiryDate: existingPassport.expiryDate,
                        stamps: existingPassport.stamps,
                    };
                    return [4, ceramicDatabase.store.set("Passport", ceramicPassport)];
                case 1:
                    stream = _a.sent();
                    existingPassportStreamID = stream.toUrl();
                    return [2];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.store.remove("Passport")];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it("getPassport retrieves the passport from ceramic", function () { return __awaiter(void 0, void 0, void 0, function () {
        var actualPassport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.getPassport()];
                case 1:
                    actualPassport = (_a.sent());
                    expect(actualPassport).toBeDefined();
                    expect(actualPassport).toEqual(existingPassport);
                    expect(actualPassport.stamps).toEqual([]);
                    return [2];
            }
        });
    }); });
    it("addStamp adds a stamp to passport", function () { return __awaiter(void 0, void 0, void 0, function () {
        var credential, googleStampFixture, passport, retrievedStamp, loadedCred;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    credential = {
                        "@context": ["https://www.w3.org/2018/credentials/v1"],
                        type: ["VerifiableCredential"],
                        credentialSubject: {
                            id: "".concat(ceramicDatabase.did),
                            "@context": [
                                {
                                    hash: "https://schema.org/Text",
                                    provider: "https://schema.org/Text",
                                },
                            ],
                            hash: "randomValuesHash",
                            provider: "randomValuesProvider",
                        },
                        issuer: "did:key:randomValuesIssuer",
                        issuanceDate: "2022-04-15T21:04:01.708Z",
                        proof: {
                            type: "Ed25519Signature2018",
                            proofPurpose: "assertionMethod",
                            verificationMethod: "did:key:randomValues",
                            created: "2022-04-15T21:04:01.708Z",
                            jws: "randomValues",
                        },
                        expirationDate: "2022-05-15T21:04:01.708Z",
                    };
                    googleStampFixture = {
                        provider: "Google",
                        credential: credential,
                    };
                    return [4, ceramicDatabase.addStamp(googleStampFixture)];
                case 1:
                    _a.sent();
                    return [4, ceramicDatabase.store.get("Passport")];
                case 2:
                    passport = _a.sent();
                    retrievedStamp = passport === null || passport === void 0 ? void 0 : passport.stamps[0];
                    return [4, ceramicDatabase.loader.load(retrievedStamp.credential)];
                case 3:
                    loadedCred = _a.sent();
                    expect(passport.stamps.length).toEqual(1);
                    expect(loadedCred.content).toEqual(credential);
                    expect(retrievedStamp.provider).toEqual(googleStampFixture.provider);
                    return [2];
            }
        });
    }); });
});
describe("when there is an existing passport with stamps for the given did", function () {
    var existingPassport = {
        issuanceDate: new Date("2022-01-01"),
        expiryDate: new Date("2022-01-02"),
        stamps: [],
    };
    var credential;
    var ensStampFixture;
    var googleStampFixture;
    var existingPassportStreamID;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var ensStampTile, existingPassportWithStamps, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    credential = {
                        "@context": ["https://www.w3.org/2018/credentials/v1"],
                        type: ["VerifiableCredential"],
                        credentialSubject: {
                            id: "".concat(ceramicDatabase.did),
                            "@context": [
                                {
                                    hash: "https://schema.org/Text",
                                    provider: "https://schema.org/Text",
                                },
                            ],
                            hash: "randomValuesHash",
                            provider: "randomValuesProvider",
                        },
                        issuer: "did:key:randomValuesIssuer",
                        issuanceDate: "2022-04-15T21:04:01.708Z",
                        proof: {
                            type: "Ed25519Signature2018",
                            proofPurpose: "assertionMethod",
                            verificationMethod: "did:key:randomValues",
                            created: "2022-04-15T21:04:01.708Z",
                            jws: "randomValues",
                        },
                        expirationDate: "2022-05-15T21:04:01.708Z",
                    };
                    return [4, ceramicDatabase.model.createTile("VerifiableCredential", credential)];
                case 1:
                    ensStampTile = _a.sent();
                    ensStampFixture = {
                        provider: "Ens",
                        credential: credential,
                        streamId: ensStampTile.id.toUrl(),
                    };
                    googleStampFixture = {
                        provider: "Google",
                        credential: credential,
                    };
                    existingPassportWithStamps = {
                        issuanceDate: new Date("2022-01-01"),
                        expiryDate: new Date("2022-01-02"),
                        stamps: [
                            {
                                provider: ensStampFixture.provider,
                                credential: ensStampTile.id.toUrl(),
                            },
                        ],
                    };
                    return [4, ceramicDatabase.store.set("Passport", existingPassportWithStamps)];
                case 2:
                    stream = _a.sent();
                    existingPassportStreamID = stream.toUrl();
                    return [2];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.store.remove("Passport")];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it("getPassport retrieves the passport and stamps from ceramic", function () { return __awaiter(void 0, void 0, void 0, function () {
        var actualPassport, formattedDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.getPassport()];
                case 1:
                    actualPassport = (_a.sent());
                    formattedDate = new Date(actualPassport["issuanceDate"]);
                    expect(actualPassport).toBeDefined();
                    expect(formattedDate.getDay()).toEqual(existingPassport.issuanceDate.getDay());
                    expect(formattedDate.getMonth()).toEqual(existingPassport.issuanceDate.getMonth());
                    expect(formattedDate.getFullYear()).toEqual(existingPassport.issuanceDate.getFullYear());
                    expect(actualPassport.stamps[0]).toEqual(ensStampFixture);
                    return [2];
            }
        });
    }); });
    it("addStamp adds a stamp to passport", function () { return __awaiter(void 0, void 0, void 0, function () {
        var passport, retrievedStamp, loadedCred;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.addStamp(googleStampFixture)];
                case 1:
                    _a.sent();
                    return [4, ceramicDatabase.store.get("Passport")];
                case 2:
                    passport = _a.sent();
                    retrievedStamp = passport === null || passport === void 0 ? void 0 : passport.stamps[1];
                    return [4, ceramicDatabase.loader.load(retrievedStamp.credential)];
                case 3:
                    loadedCred = _a.sent();
                    expect(passport.stamps.length).toEqual(2);
                    expect(loadedCred.content).toEqual(credential);
                    expect(retrievedStamp.provider).toEqual(googleStampFixture.provider);
                    return [2];
            }
        });
    }); });
});
describe("when there is an existing passport with stamps for the given did", function () {
    var existingPassport = {
        issuanceDate: new Date("2022-01-01"),
        expiryDate: new Date("2022-01-02"),
        stamps: [],
    };
    var credential;
    var ensStampFixture;
    var googleStampFixture;
    var poapStampFixture;
    var existingPassportStreamID;
    var existingEnsStampTileStreamID;
    var existingGoogleStampTileStreamID;
    var existingPoapStampTileStreamID;
    var providerIds;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var ensStampTile, googleStampTile, poapStampTile, existingPassportWithStamps, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    credential = {
                        "@context": ["https://www.w3.org/2018/credentials/v1"],
                        type: ["VerifiableCredential"],
                        credentialSubject: {
                            id: "".concat(ceramicDatabase.did),
                            "@context": [
                                {
                                    hash: "https://schema.org/Text",
                                    provider: "https://schema.org/Text",
                                },
                            ],
                            hash: "randomValuesHash",
                            provider: "randomValuesProvider",
                        },
                        issuer: "did:key:randomValuesIssuer",
                        issuanceDate: "2022-04-15T21:04:01.708Z",
                        proof: {
                            type: "Ed25519Signature2018",
                            proofPurpose: "assertionMethod",
                            verificationMethod: "did:key:randomValues",
                            created: "2022-04-15T21:04:01.708Z",
                            jws: "randomValues",
                        },
                        expirationDate: "2022-05-15T21:04:01.708Z",
                    };
                    ensStampFixture = {
                        provider: "Ens",
                        credential: credential,
                    };
                    googleStampFixture = {
                        provider: "Google",
                        credential: credential,
                    };
                    poapStampFixture = {
                        provider: "POAP",
                        credential: credential,
                    };
                    return [4, ceramicDatabase.model.createTile("VerifiableCredential", credential)];
                case 1:
                    ensStampTile = _a.sent();
                    return [4, ceramicDatabase.model.createTile("VerifiableCredential", credential)];
                case 2:
                    googleStampTile = _a.sent();
                    return [4, ceramicDatabase.model.createTile("VerifiableCredential", credential)];
                case 3:
                    poapStampTile = _a.sent();
                    existingEnsStampTileStreamID = ensStampTile.id.toUrl();
                    existingGoogleStampTileStreamID = googleStampTile.id.toUrl();
                    existingPoapStampTileStreamID = poapStampTile.id.toUrl();
                    providerIds = ["Ens", "Google", "POAP"];
                    existingPassportWithStamps = {
                        issuanceDate: new Date("2022-01-01"),
                        expiryDate: new Date("2022-01-02"),
                        stamps: [
                            {
                                provider: ensStampFixture.provider,
                                credential: ensStampTile.id.toUrl(),
                            },
                            {
                                provider: googleStampFixture.provider,
                                credential: googleStampTile.id.toUrl(),
                            },
                            {
                                provider: poapStampFixture.provider,
                                credential: poapStampTile.id.toUrl(),
                            },
                        ],
                    };
                    return [4, ceramicDatabase.store.set("Passport", existingPassportWithStamps)];
                case 4:
                    stream = _a.sent();
                    existingPassportStreamID = stream.toUrl();
                    return [2];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.store.remove("Passport")];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it("deleteStamps deletes selected stamps from passport", function () { return __awaiter(void 0, void 0, void 0, function () {
        var passport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ceramicDatabase.deleteStamps(providerIds);
                    return [4, new Promise(function (r) { return setTimeout(r, 2000); })];
                case 1:
                    _a.sent();
                    return [4, ceramicDatabase.store.get("Passport")];
                case 2:
                    passport = _a.sent();
                    expect(passport.stamps.length).toEqual(0);
                    expect(passport.stamps.findIndex(function (stamp) {
                        return stamp.credential === existingEnsStampTileStreamID;
                    })).toEqual(-1);
                    expect(passport.stamps.findIndex(function (stamp) {
                        return stamp.credential === existingPoapStampTileStreamID;
                    })).toEqual(-1);
                    expect(passport.stamps.findIndex(function (stamp) {
                        return stamp.credential === existingGoogleStampTileStreamID;
                    })).toEqual(-1);
                    return [2];
            }
        });
    }); });
    it("deleteStamp deletes an existing stamp from passport", function () { return __awaiter(void 0, void 0, void 0, function () {
        var passport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ceramicDatabase.deleteStamp(existingGoogleStampTileStreamID);
                    return [4, new Promise(function (r) { return setTimeout(r, 2000); })];
                case 1:
                    _a.sent();
                    return [4, ceramicDatabase.store.get("Passport")];
                case 2:
                    passport = _a.sent();
                    expect(passport.stamps.length).toEqual(2);
                    expect(passport.stamps.findIndex(function (stamp) {
                        return stamp.credential === existingEnsStampTileStreamID;
                    })).toEqual(0);
                    expect(passport.stamps.findIndex(function (stamp) {
                        return stamp.credential === existingPoapStampTileStreamID;
                    })).toEqual(1);
                    expect(passport.stamps.findIndex(function (stamp) {
                        return stamp.credential === existingGoogleStampTileStreamID;
                    })).toEqual(-1);
                    return [2];
            }
        });
    }); });
});
describe("when loading a stamp from a passport fails", function () {
    var existingPassport = {
        issuanceDate: new Date("2022-01-01"),
        expiryDate: new Date("2022-01-02"),
        stamps: [],
    };
    var ensCredential;
    var poapCredential;
    var googleCredential;
    var ensStampFixture;
    var googleStampFixture;
    var poapStampFixture;
    var existingPassportStreamID;
    var existingEnsStampTileStreamID;
    var existingPoapStampTileStreamID;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var createVC, ensStampTile, poapStampTile, existingPassportWithStamps, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createVC = function (provider) {
                        return {
                            "@context": ["https://www.w3.org/2018/credentials/v1"],
                            type: ["VerifiableCredential"],
                            credentialSubject: {
                                id: "".concat(ceramicDatabase.did),
                                "@context": [
                                    {
                                        hash: "https://schema.org/Text",
                                        provider: "https://schema.org/Text",
                                    },
                                ],
                                hash: "randomValuesHash",
                                provider: provider,
                            },
                            issuer: "did:key:randomValuesIssuer",
                            issuanceDate: "2022-04-15T21:04:01.708Z",
                            proof: {
                                type: "Ed25519Signature2018",
                                proofPurpose: "assertionMethod",
                                verificationMethod: "did:key:randomValues",
                                created: "2022-04-15T21:04:01.708Z",
                                jws: "randomValues",
                            },
                            expirationDate: "2022-05-15T21:04:01.708Z",
                        };
                    };
                    ensCredential = createVC("Ens");
                    poapCredential = createVC("POAP");
                    googleCredential = createVC("Google");
                    ensStampFixture = {
                        provider: "Ens",
                        credential: ensCredential,
                    };
                    googleStampFixture = {
                        provider: "Google",
                        credential: googleCredential,
                    };
                    poapStampFixture = {
                        provider: "POAP",
                        credential: poapCredential,
                    };
                    return [4, ceramicDatabase.model.createTile("VerifiableCredential", ensCredential)];
                case 1:
                    ensStampTile = _a.sent();
                    return [4, ceramicDatabase.model.createTile("VerifiableCredential", googleCredential)];
                case 2:
                    poapStampTile = _a.sent();
                    existingEnsStampTileStreamID = ensStampTile.id.toUrl();
                    existingPoapStampTileStreamID = poapStampTile.id.toUrl();
                    existingPassportWithStamps = {
                        issuanceDate: new Date("2022-01-01"),
                        expiryDate: new Date("2022-01-02"),
                        stamps: [
                            {
                                provider: ensStampFixture.provider,
                                credential: ensStampTile.id.toUrl(),
                            },
                            {
                                provider: googleStampFixture.provider,
                                credential: "ceramic://SOME_BAD_ID_FOR_CERAMIC",
                            },
                            {
                                provider: poapStampFixture.provider,
                                credential: poapStampTile.id.toUrl(),
                            },
                        ],
                    };
                    return [4, ceramicDatabase.store.set("Passport", existingPassportWithStamps)];
                case 3:
                    stream = _a.sent();
                    existingPassportStreamID = stream.toUrl();
                    return [2];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.store.remove("Passport")];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it("ignores the failed stamp and only returns the successfully loaded stamps", function () { return __awaiter(void 0, void 0, void 0, function () {
        var passport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ceramicDatabase.getPassport()];
                case 1:
                    passport = (_a.sent());
                    expect(passport.stamps.length).toEqual(2);
                    expect(passport.stamps.findIndex(function (stamp) {
                        return stamp && stamp.credential.credentialSubject.provider === "Ens";
                    })).toEqual(0);
                    expect(passport.stamps.findIndex(function (stamp) {
                        return stamp && stamp.credential.credentialSubject.provider === "Google";
                    })).toEqual(1);
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=ceramicDatabaseTest.js.map