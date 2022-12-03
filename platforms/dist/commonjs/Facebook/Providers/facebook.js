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
exports.verifyFacebook = exports.FacebookProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const luxon_1 = require("luxon");
const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
class FacebookProvider {
    constructor(options = {}) {
        this.type = "Facebook";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield verifyFacebook(payload.proofs.accessToken);
                const formattedData = responseData === null || responseData === void 0 ? void 0 : responseData.data.data;
                const notExpired = luxon_1.DateTime.now() < luxon_1.DateTime.fromSeconds(formattedData.expires_at);
                const valid = notExpired && formattedData.app_id === APP_ID && formattedData.is_valid && !!formattedData.user_id;
                return {
                    valid,
                    record: valid
                        ? {
                            user_id: formattedData.user_id,
                        }
                        : undefined,
                };
            }
            catch (e) {
                return { valid: false };
            }
        });
    }
}
exports.FacebookProvider = FacebookProvider;
function verifyFacebook(userAccessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const appAccessToken = `${APP_ID}|${APP_SECRET}`;
        return axios_1.default.get("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: userAccessToken },
        });
    });
}
exports.verifyFacebook = verifyFacebook;
//# sourceMappingURL=facebook.js.map