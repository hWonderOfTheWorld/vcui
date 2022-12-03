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
exports.DiscordProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class DiscordProvider {
    constructor(options = {}) {
        this.type = "Discord";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false, verifiedPayload = {};
            try {
                verifiedPayload = yield verifyDiscord(payload.proofs.code);
            }
            catch (e) {
                return { valid: false };
            }
            finally {
                valid = verifiedPayload && ((_a = verifiedPayload.user) === null || _a === void 0 ? void 0 : _a.id) ? true : false;
            }
            return {
                valid: valid,
                record: {
                    id: (_b = verifiedPayload.user) === null || _b === void 0 ? void 0 : _b.id,
                },
            };
        });
    }
}
exports.DiscordProvider = DiscordProvider;
const requestAccessToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_CALLBACK;
    try {
        const tokenRequest = yield axios_1.default.post("https://discord.com/api/oauth2/token", `grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}`);
        if (tokenRequest.status != 200) {
            throw `Post for request returned status code ${tokenRequest.status} instead of the expected 200`;
        }
        const tokenResponse = tokenRequest.data;
        return tokenResponse.access_token;
    }
    catch (e) {
        const error = e;
        console.error("Error when verifying discord account for user:", (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
        throw e;
    }
});
const verifyDiscord = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield requestAccessToken(code);
    const userRequest = yield axios_1.default.get("https://discord.com/api/oauth2/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (userRequest.status != 200) {
        throw `Get user request returned status code ${userRequest.status} instead of the expected 200`;
    }
    return userRequest.data;
});
//# sourceMappingURL=discord.js.map