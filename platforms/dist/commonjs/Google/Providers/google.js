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
exports.verifyGoogle = exports.requestAccessToken = exports.GoogleProvider = void 0;
const errors_1 = require("../../utils/errors");
const signer_1 = require("../../utils/signer");
const axios_1 = __importDefault(require("axios"));
class GoogleProvider {
    constructor(options = {}) {
        this.type = "Google";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (yield (0, signer_1.getAddress)(payload)).toLowerCase();
            const verifiedPayload = yield (0, exports.verifyGoogle)(payload.proofs.code);
            const valid = !verifiedPayload.errors && verifiedPayload.emailVerified;
            console.log("google - verify - verifiedPayload", address, JSON.stringify(verifiedPayload));
            return {
                valid: valid,
                error: verifiedPayload.errors,
                record: {
                    email: verifiedPayload.email,
                },
            };
        });
    }
}
exports.GoogleProvider = GoogleProvider;
const requestAccessToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK;
    try {
        const url = `https://oauth2.googleapis.com/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirectUri=${redirectUri}`;
        const tokenRequest = yield axios_1.default.post(url, {}, {
            headers: { Accept: "application/json" },
        });
        const tokenResponse = tokenRequest.data;
        console.log("google - tokenRequest.statusText, tokenRequest.status, tokenRequest.data", tokenRequest.statusText, tokenRequest.status, JSON.stringify(tokenRequest.data));
        return tokenResponse.access_token;
    }
    catch (_error) {
        const error = _error;
        const errorString = (0, errors_1.getErrorString)(error);
        console.log(errorString);
        throw new Error(errorString);
    }
});
exports.requestAccessToken = requestAccessToken;
const verifyGoogle = (code) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const accessToken = yield (0, exports.requestAccessToken)(code);
        const userRequest = yield axios_1.default.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("google - userRequest.statusText, userRequest.status, userRequest.data", userRequest.statusText, userRequest.status, JSON.stringify(userRequest.data));
        const userInfo = userRequest.data;
        console.log("google - userInfo", JSON.stringify(userInfo));
        return {
            email: userInfo === null || userInfo === void 0 ? void 0 : userInfo.email,
            emailVerified: userInfo === null || userInfo === void 0 ? void 0 : userInfo.verified_email,
        };
    }
    catch (_error) {
        const error = _error;
        const errorString = (0, errors_1.getErrorString)(error);
        console.log(errorString);
        return {
            errors: [
                "Error getting user info",
                `${error === null || error === void 0 ? void 0 : error.message}`,
                `Status ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status}: ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText}`,
                `Details: ${JSON.stringify((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data)}`,
            ],
        };
    }
});
exports.verifyGoogle = verifyGoogle;
//# sourceMappingURL=google.js.map