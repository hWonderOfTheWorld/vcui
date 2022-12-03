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
exports.FacebookProfilePictureProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const facebook_1 = require("./facebook");
const luxon_1 = require("luxon");
const APP_ID = process.env.FACEBOOK_APP_ID;
class FacebookProfilePictureProvider {
    constructor(options = {}) {
        this.type = "FacebookProfilePicture";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenResponseData = yield (0, facebook_1.verifyFacebook)(payload.proofs.accessToken);
                if (tokenResponseData.status != 200) {
                    throw tokenResponseData.statusText;
                }
                const formattedData = tokenResponseData === null || tokenResponseData === void 0 ? void 0 : tokenResponseData.data.data;
                const notExpired = luxon_1.DateTime.now() < luxon_1.DateTime.fromSeconds(formattedData.expires_at);
                const isTokenValid = notExpired && formattedData.app_id === APP_ID && formattedData.is_valid && !!formattedData.user_id;
                const profileResponseData = yield verifyFacebookFriends(payload.proofs.accessToken);
                if (profileResponseData.status != 200) {
                    throw profileResponseData.statusText;
                }
                const profileData = profileResponseData === null || profileResponseData === void 0 ? void 0 : profileResponseData.data;
                const hasProfilePicture = !profileData.picture.data.is_silhouette;
                const valid = isTokenValid && hasProfilePicture;
                return {
                    valid,
                    record: valid
                        ? {
                            userId: profileData.id,
                            hasProfilePicture: String(valid),
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
exports.FacebookProfilePictureProvider = FacebookProfilePictureProvider;
function verifyFacebookFriends(userAccessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: userAccessToken, fields: "id,picture{is_silhouette}" },
        });
    });
}
//# sourceMappingURL=facebookProfilePicture.js.map