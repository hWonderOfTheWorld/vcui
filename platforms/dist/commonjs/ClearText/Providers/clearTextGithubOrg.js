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
exports.ClearTextGithubOrgProvider = exports.ClientType = void 0;
const axios_1 = __importDefault(require("axios"));
var ClientType;
(function (ClientType) {
    ClientType[ClientType["GrantHub"] = 0] = "GrantHub";
})(ClientType = exports.ClientType || (exports.ClientType = {}));
class ClearTextGithubOrgProvider {
    constructor(options = {}) {
        this.type = "ClearTextGithubOrg";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false, ghVerification, pii;
            console.log({ payload });
            try {
                ghVerification = yield verifyGithub(payload.proofs.code, payload.org, payload.requestedClient);
            }
            catch (e) {
                return { valid: false };
            }
            finally {
                const validOrg = ghVerification === null || ghVerification === void 0 ? void 0 : ghVerification.validOrg;
                pii = validOrg ? `${validOrg.matchingOrg}#${ghVerification.id}` : "";
                valid = validOrg && validOrg.matchingOrg === validOrg.providedOrg;
            }
            return {
                valid: valid,
                record: {
                    pii,
                },
            };
        });
    }
}
exports.ClearTextGithubOrgProvider = ClearTextGithubOrgProvider;
const verifyOrg = (data, providedOrg) => {
    const orgs = data;
    const matchingOrgs = orgs.filter((org) => org.login === providedOrg);
    if (matchingOrgs.length !== 1) {
        throw `${providedOrg} not found in user profile`;
    }
    return {
        providedOrg,
        matchingOrg: matchingOrgs[0].login,
    };
};
const requestAccessToken = (code, requestedClient) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = requestedClient === ClientType.GrantHub ? process.env.GRANT_HUB_GITHUB_CLIENT_ID : process.env.GITHUB_CLIENT_ID;
    const clientSecret = requestedClient === ClientType.GrantHub
        ? process.env.GRANT_HUB_GITHUB_CLIENT_SECRET
        : process.env.GITHUB_CLIENT_SECRET;
    const tokenRequest = yield axios_1.default.post(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
        headers: { Accept: "application/json" },
    });
    if (tokenRequest.status != 200) {
        throw `Post for request returned status code ${tokenRequest.status} instead of the expected 200`;
    }
    const tokenResponse = tokenRequest.data;
    return tokenResponse.access_token;
});
const verifyGithub = (code, providedOrg, requestedClient) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield requestAccessToken(code, requestedClient);
    const userRequest = yield axios_1.default.get("https://api.github.com/user", {
        headers: { Authorization: `token ${accessToken}` },
    });
    if (userRequest.status != 200) {
        throw `Get user request returned status code ${userRequest.status} instead of the expected 200`;
    }
    const handle = userRequest.data.login;
    const { id } = userRequest.data;
    const userOrgRequest = yield axios_1.default.get(`https://api.github.com/users/${handle}/orgs`, {
        headers: { Authorization: `token ${accessToken}` },
    });
    if (userOrgRequest.status != 200) {
        throw `Get user org request returned status code ${userOrgRequest.status} instead of the expected 200`;
    }
    const validOrg = verifyOrg(userOrgRequest.data, providedOrg);
    return {
        validOrg,
        id,
    };
});
//# sourceMappingURL=clearTextGithubOrg.js.map