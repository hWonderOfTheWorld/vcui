var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
import { CeramicClient } from "@ceramicnetwork/http-client";
import publishedModel from "@gitcoin/passport-schemas/scripts/publish-model.json";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { TileLoader } from "@glazed/tile-loader";
import { StreamID } from "@ceramicnetwork/streamid";
import axios from "axios";
var COMMUNITY_TESTNET_CERAMIC_CLIENT_URL = "https://ceramic-clay.3boxlabs.com";
var CeramicDatabase = (function () {
    function CeramicDatabase(did, ceramicHost, aliases, logger) {
        if (logger) {
            this.logger = logger;
        }
        else {
            this.logger = console;
        }
        this.apiHost = ceramicHost !== null && ceramicHost !== void 0 ? ceramicHost : COMMUNITY_TESTNET_CERAMIC_CLIENT_URL;
        var ceramic = new CeramicClient(this.apiHost);
        ceramic.setDID(did);
        var loader = new TileLoader({ ceramic: ceramic });
        var model = new DataModel({ ceramic: ceramic, aliases: aliases !== null && aliases !== void 0 ? aliases : publishedModel });
        var store = new DIDDataStore({ loader: loader, ceramic: ceramic, model: model });
        this.did = (did.hasParent ? did.parent : did.id).toLowerCase();
        this.loader = loader;
        this.ceramicClient = ceramic;
        this.model = model;
        this.store = store;
    }
    CeramicDatabase.prototype.createPassport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var date, newPassport, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("create new passport for did ".concat(this.did));
                        date = new Date();
                        newPassport = {
                            issuanceDate: date.toISOString(),
                            expiryDate: date.toISOString(),
                            stamps: [],
                        };
                        return [4, this.store.set("Passport", __assign({}, newPassport))];
                    case 1:
                        stream = _a.sent();
                        return [2, stream.toUrl()];
                }
            });
        });
    };
    CeramicDatabase.prototype.getPassport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var passport, streamIDs_1, stampsToLoad, stampLoadingStatus, isFulfilled, filteredStamps, loadedStamps, parsePassport, passportDoc, e_1, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4, this.store.get("Passport")];
                    case 1:
                        passport = _a.sent();
                        this.logger.info("loaded passport for did ".concat(this.did, " => ").concat(JSON.stringify(passport)));
                        if (!passport)
                            return [2, false];
                        if (!passport.stamps)
                            return [2, false];
                        streamIDs_1 = passport === null || passport === void 0 ? void 0 : passport.stamps.map(function (ceramicStamp) {
                            return ceramicStamp.credential;
                        });
                        stampsToLoad = passport === null || passport === void 0 ? void 0 : passport.stamps.map(function (_stamp, idx) { return __awaiter(_this, void 0, void 0, function () {
                            var streamUrl, provider, credential, loadedCred, e_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        streamUrl = "".concat(this.apiHost, "/api/v0/streams/").concat(streamIDs_1[idx].substring(10));
                                        this.logger.log("get stamp from streamUrl: ".concat(streamUrl));
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        provider = _stamp.provider, credential = _stamp.credential;
                                        return [4, axios.get(streamUrl)];
                                    case 2:
                                        loadedCred = (_a.sent());
                                        return [2, {
                                                provider: provider,
                                                credential: loadedCred.data.state.content,
                                                streamId: streamIDs_1[idx],
                                            }];
                                    case 3:
                                        e_3 = _a.sent();
                                        this.logger.error("Error when loading stamp with streamId ".concat(streamIDs_1[idx], " for did  ").concat(this.did, ":") + e_3.toString());
                                        throw e_3;
                                    case 4: return [2];
                                }
                            });
                        }); });
                        return [4, Promise.allSettled(stampsToLoad)];
                    case 2:
                        stampLoadingStatus = _a.sent();
                        isFulfilled = function (input) {
                            return input.status === "fulfilled";
                        };
                        filteredStamps = stampLoadingStatus.filter(isFulfilled);
                        loadedStamps = filteredStamps.map(function (settledStamp) { return settledStamp.value; });
                        parsePassport = {
                            issuanceDate: new Date(passport.issuanceDate),
                            expiryDate: new Date(passport.expiryDate),
                            stamps: loadedStamps,
                        };
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4, this.store.getRecordDocument(this.model.getDefinitionID("Passport"))];
                    case 4:
                        passportDoc = _a.sent();
                        return [4, this.ceramicClient.pin.add(passportDoc.id)];
                    case 5:
                        _a.sent();
                        return [3, 7];
                    case 6:
                        e_1 = _a.sent();
                        this.logger.error("Error when pinning passport for did  ".concat(this.did, ":") + e_1.toString());
                        return [3, 7];
                    case 7: return [2, parsePassport];
                    case 8:
                        e_2 = _a.sent();
                        this.logger.error("Error when loading passport for did  ".concat(this.did, ":") + e_2.toString());
                        return [2, undefined];
                    case 9: return [2];
                }
            });
        });
    };
    CeramicDatabase.prototype.addStamp = function (stamp) {
        return __awaiter(this, void 0, void 0, function () {
            var passport, newStampTile, newStamps, streamId, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("adding stamp to did ".concat(this.did));
                        return [4, this.store.get("Passport")];
                    case 1:
                        passport = _a.sent();
                        if (!(passport && this.did === stamp.credential.credentialSubject.id.toLowerCase())) return [3, 7];
                        return [4, this.model.createTile("VerifiableCredential", stamp.credential)];
                    case 2:
                        newStampTile = _a.sent();
                        newStamps = passport === null || passport === void 0 ? void 0 : passport.stamps.concat({ provider: stamp.provider, credential: newStampTile.id.toUrl() });
                        return [4, this.store.merge("Passport", { stamps: newStamps })];
                    case 3:
                        streamId = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, this.ceramicClient.pin.add(streamId)];
                    case 5:
                        _a.sent();
                        return [3, 7];
                    case 6:
                        e_4 = _a.sent();
                        this.logger.error("Error when pinning passport for did  ".concat(this.did, ":") + e_4.toString());
                        return [3, 7];
                    case 7: return [2];
                }
            });
        });
    };
    CeramicDatabase.prototype.addStamps = function (stamps) {
        return __awaiter(this, void 0, void 0, function () {
            var passport, newStamps, _a, _b, _c, streamId, e_5;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.logger.info("adding stamps to did ".concat(this.did));
                        return [4, this.store.get("Passport")];
                    case 1:
                        passport = _d.sent();
                        if (!(passport === null || passport === void 0)) return [3, 2];
                        _a = void 0;
                        return [3, 4];
                    case 2:
                        _c = (_b = passport.stamps).concat;
                        return [4, Promise.all(stamps.map(function (stamp) { return __awaiter(_this, void 0, void 0, function () {
                                var newStampTile;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(passport && this.did === stamp.credential.credentialSubject.id.toLowerCase())) return [3, 2];
                                            return [4, this.model.createTile("VerifiableCredential", stamp.credential)];
                                        case 1:
                                            newStampTile = _a.sent();
                                            return [2, { provider: stamp.provider, credential: newStampTile.id.toUrl() }];
                                        case 2: return [2];
                                    }
                                });
                            }); }))];
                    case 3:
                        _a = _c.apply(_b, [(_d.sent()).filter(function (v) { return v; })]);
                        _d.label = 4;
                    case 4:
                        newStamps = _a;
                        return [4, this.store.merge("Passport", { stamps: newStamps })];
                    case 5:
                        streamId = _d.sent();
                        _d.label = 6;
                    case 6:
                        _d.trys.push([6, 8, , 9]);
                        return [4, this.ceramicClient.pin.add(streamId)];
                    case 7:
                        _d.sent();
                        return [3, 9];
                    case 8:
                        e_5 = _d.sent();
                        this.logger.error("Error when pinning passport for did  ".concat(this.did, ":") + e_5.toString());
                        return [3, 9];
                    case 9: return [2];
                }
            });
        });
    };
    CeramicDatabase.prototype.deleteStamps = function (providerIds) {
        return __awaiter(this, void 0, void 0, function () {
            var passport, updatedStamps, streamId, e_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("updating stamp(s) on ".concat(this.did));
                        return [4, this.store.get("Passport")];
                    case 1:
                        passport = _a.sent();
                        if (!(passport && passport.stamps)) return [3, 7];
                        return [4, Promise.all(passport.stamps.map(function (stamp) { return __awaiter(_this, void 0, void 0, function () {
                                var regex, cred;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            regex = /ceramic:\/*/i;
                                            cred = stamp.credential.replace(regex, "");
                                            if (!providerIds.includes(stamp.provider)) return [3, 2];
                                            return [4, this.deleteStamp(cred)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        updatedStamps = passport.stamps.filter(function (stamp) { return !providerIds.includes(stamp.provider); });
                        return [4, this.store.set("Passport", { stamps: updatedStamps })];
                    case 3:
                        streamId = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, this.ceramicClient.pin.add(streamId)];
                    case 5:
                        _a.sent();
                        return [3, 7];
                    case 6:
                        e_6 = _a.sent();
                        this.logger.error("Error when pinning passport for did  ".concat(this.did, ":") + e_6.toString());
                        return [3, 7];
                    case 7: return [2];
                }
            });
        });
    };
    CeramicDatabase.prototype.deleteStamp = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var passport, itemIndex, passportStreamId, stampStreamId, e_7, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("deleting stamp ".concat(streamId, " from did ").concat(this.did));
                        return [4, this.store.get("Passport")];
                    case 1:
                        passport = _a.sent();
                        if (!(passport && passport.stamps)) return [3, 11];
                        itemIndex = passport.stamps.findIndex(function (stamp) {
                            return stamp.credential === streamId;
                        });
                        if (!(itemIndex != -1)) return [3, 10];
                        passport.stamps.splice(itemIndex, 1);
                        return [4, this.store.merge("Passport", { stamps: passport.stamps })];
                    case 2:
                        passportStreamId = _a.sent();
                        stampStreamId = StreamID.fromString(streamId);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, this.ceramicClient.pin.rm(stampStreamId)];
                    case 4:
                        _a.sent();
                        return [3, 6];
                    case 5:
                        e_7 = _a.sent();
                        this.logger.error("Error when unpinning stamp with id ".concat(stampStreamId.toString(), " for did  ").concat(this.did, ":") + e_7.toString());
                        return [3, 6];
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4, this.ceramicClient.pin.add(passportStreamId)];
                    case 7:
                        _a.sent();
                        return [3, 9];
                    case 8:
                        e_8 = _a.sent();
                        this.logger.error("Error when pinning passport for did  ".concat(this.did, ":") + e_8.toString());
                        return [3, 9];
                    case 9: return [3, 11];
                    case 10:
                        this.logger.info("unable to find stamp with stream id ".concat(streamId, " in passport"));
                        _a.label = 11;
                    case 11: return [2];
                }
            });
        });
    };
    CeramicDatabase.prototype.deletePassport = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("deleting passport for did ".concat(this.did));
                        return [4, this.store.remove("Passport")];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return CeramicDatabase;
}());
export { CeramicDatabase };
//# sourceMappingURL=ceramicClient.js.map