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
Object.defineProperty(exports, "__esModule", { value: true });
const twitterOauth_1 = require("../procedures/twitterOauth");
class TwitterProvider {
    constructor(options = {}) {
        this.type = "Twitter";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false, verifiedPayload = {};
            try {
                if (payload.proofs) {
                    verifiedPayload = yield verifyTwitter(payload.proofs.sessionKey, payload.proofs.code);
                }
            }
            catch (e) {
                return { valid: false };
            }
            finally {
                valid = verifiedPayload && verifiedPayload.username ? true : false;
            }
            return {
                valid: valid,
                record: {
                    username: verifiedPayload.username || "",
                },
            };
        });
    }
}
exports.default = TwitterProvider;
function verifyTwitter(sessionKey, code) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, twitterOauth_1.getClient)(sessionKey);
        let myUser;
        if (client) {
            myUser = yield (0, twitterOauth_1.requestFindMyUser)(client, code);
            (0, twitterOauth_1.deleteClient)(sessionKey);
            return myUser;
        }
        throw "Unable to determin twitter user";
    });
}
//# sourceMappingURL=TwitterAuthProvider.js.map