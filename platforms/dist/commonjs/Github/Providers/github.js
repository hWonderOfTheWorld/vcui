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
exports.verifyGithub = exports.requestAccessToken = exports.GithubProvider = void 0;
const errors_1 = require("../../utils/errors");
const signer_1 = require("../../utils/signer");
const axios_1 = __importDefault(require("axios"));
class GithubProvider {
    constructor(options = {}) {
        this.type = "Github";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (yield (0, signer_1.getAddress)(payload)).toLowerCase();
            const verifiedPayload = yield (0, exports.verifyGithub)(payload.proofs.code, context);
            console.log("github - verifiedPayload", address, JSON.stringify(verifiedPayload));
            const valid = !!(!verifiedPayload.errors && verifiedPayload.id);
            console.log("github - valid", address, valid);
            return {
                valid: valid,
                error: verifiedPayload.errors,
                record: valid
                    ? {
                        id: verifiedPayload.id,
                    }
                    : undefined,
            };
        });
    }
}
exports.GithubProvider = GithubProvider;
const requestAccessToken = (code, context) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const accessToken = context.githubAccessToken;
    if (accessToken) {
        return accessToken;
    }
    const tokenRequest = yield axios_1.default.post(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
        headers: { Accept: "application/json" },
    });
    const tokenResponse = tokenRequest.data;
    context["githubAccessToken"] = tokenResponse.access_token;
    return tokenResponse.access_token;
});
exports.requestAccessToken = requestAccessToken;
const verifyGithub = (code, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const accessToken = yield (0, exports.requestAccessToken)(code, context);
        const userRequest = yield axios_1.default.get("https://api.github.com/user", {
            headers: { Authorization: `token ${accessToken}` },
        });
        console.log("verifyGithub result:", JSON.stringify(userRequest.data));
        return userRequest.data;
    }
    catch (_error) {
        const error = _error;
        console.log("verifyGithub ERROR:", (0, errors_1.getErrorString)(error));
        return {
            errors: [
                "Error getting getting github info",
                `${error === null || error === void 0 ? void 0 : error.message}`,
                `Status ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status}: ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText}`,
                `Details: ${JSON.stringify((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data)}`,
            ],
        };
    }
});
exports.verifyGithub = verifyGithub;
//# sourceMappingURL=github.js.map