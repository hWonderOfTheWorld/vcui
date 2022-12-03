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
exports.TwitterTweetGT10Provider = void 0;
const twitterOauth_1 = require("../procedures/twitterOauth");
function verifyTwitterTweets(sessionKey, code) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, twitterOauth_1.getClient)(sessionKey);
        const data = yield (0, twitterOauth_1.getTweetCount)(client, code);
        (0, twitterOauth_1.deleteClient)(sessionKey);
        return data;
    });
}
class TwitterTweetGT10Provider {
    constructor(options = {}) {
        this.type = "TwitterTweetGT10";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            let data = {};
            let record = undefined;
            try {
                if (payload && payload.proofs) {
                    data = yield verifyTwitterTweets(payload.proofs.sessionKey, payload.proofs.code);
                    if (data && data.username && data.tweetCount) {
                        valid = data.tweetCount > 10;
                        record = {
                            username: data.username,
                            tweetCount: valid ? "gt10" : "",
                        };
                    }
                }
            }
            catch (e) {
                return { valid: false };
            }
            return {
                valid: valid,
                record,
            };
        });
    }
}
exports.TwitterTweetGT10Provider = TwitterTweetGT10Provider;
//# sourceMappingURL=TwitterTweetsProvider.js.map