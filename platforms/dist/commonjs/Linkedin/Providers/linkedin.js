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
exports.LinkedinProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class LinkedinProvider {
    constructor(options = {}) {
        this.type = "Linkedin";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false, verifiedPayload = {};
            try {
                if (payload.proofs) {
                    verifiedPayload = yield verifyLinkedin(payload.proofs.code);
                }
            }
            catch (e) {
                return { valid: false };
            }
            finally {
                valid = verifiedPayload && verifiedPayload.id ? true : false;
            }
            return {
                valid: valid,
                record: {
                    id: verifiedPayload.id,
                },
            };
        });
    }
}
exports.LinkedinProvider = LinkedinProvider;
const requestAccessToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const tokenRequest = yield axios_1.default.post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${process.env.LINKEDIN_CALLBACK}`, {}, {
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (tokenRequest.status != 200) {
        throw `Post for request returned status code ${tokenRequest.status} instead of the expected 200`;
    }
    const tokenResponse = tokenRequest.data;
    return tokenResponse.access_token;
});
const verifyLinkedin = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield requestAccessToken(code);
    const userRequest = yield axios_1.default.get("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (userRequest.status != 200) {
        throw `Get user request returned status code ${userRequest.status} instead of the expected 200`;
    }
    return userRequest.data;
});
//# sourceMappingURL=linkedin.js.map