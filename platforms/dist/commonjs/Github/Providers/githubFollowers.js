"use strict";
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
exports.FiftyOrMoreGithubFollowers = exports.TenOrMoreGithubFollowers = void 0;
const github_1 = require("./github");
const axios_1 = __importDefault(require("axios"));
class TenOrMoreGithubFollowers {
    constructor(options = {}) {
        this.type = "TenOrMoreGithubFollowers";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false, verifiedPayload = {};
            try {
                verifiedPayload = yield verifyGithubFollowerCount(payload.proofs.code, context);
            }
            catch (e) {
                return { valid: false };
            }
            finally {
                valid = verifiedPayload && verifiedPayload.followers >= 10 && verifiedPayload.id ? true : false;
            }
            return {
                valid: valid,
                record: {
                    id: verifiedPayload.id + "gte10GithubFollowers",
                },
            };
        });
    }
}
exports.TenOrMoreGithubFollowers = TenOrMoreGithubFollowers;
class FiftyOrMoreGithubFollowers {
    constructor(options = {}) {
        this.type = "FiftyOrMoreGithubFollowers";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false, verifiedPayload = {};
            try {
                verifiedPayload = yield verifyGithubFollowerCount(payload.proofs.code, context);
            }
            catch (e) {
                return { valid: false };
            }
            finally {
                valid = verifiedPayload && verifiedPayload.followers >= 50 && verifiedPayload.id ? true : false;
            }
            return {
                valid: valid,
                record: {
                    id: verifiedPayload.id + "gte50GithubFollowers",
                },
            };
        });
    }
}
exports.FiftyOrMoreGithubFollowers = FiftyOrMoreGithubFollowers;
const verifyGithubFollowerCount = (code, context) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield (0, github_1.requestAccessToken)(code, context);
    const userRequest = yield axios_1.default.get("https://api.github.com/user", {
        headers: { Authorization: `token ${accessToken}` },
    });
    if (userRequest.status != 200) {
        throw `Get user request returned status code ${userRequest.status} instead of the expected 200`;
    }
    return userRequest.data;
});
//# sourceMappingURL=githubFollowers.js.map