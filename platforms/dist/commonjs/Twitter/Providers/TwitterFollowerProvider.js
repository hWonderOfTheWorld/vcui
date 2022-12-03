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
exports.TwitterFollowerGT5000Provider = exports.TwitterFollowerGTE1000Provider = exports.TwitterFollowerGT500Provider = exports.TwitterFollowerGT100Provider = void 0;
const twitterOauth_1 = require("../procedures/twitterOauth");
function verifyTwitterFollowers(sessionKey, code) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, twitterOauth_1.getClient)(sessionKey);
        const data = yield (0, twitterOauth_1.getFollowerCount)(client, code);
        (0, twitterOauth_1.deleteClient)(sessionKey);
        return data;
    });
}
class TwitterFollowerGT100Provider {
    constructor(options = {}) {
        this.type = "TwitterFollowerGT100";
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
                    data = yield verifyTwitterFollowers(payload.proofs.sessionKey, payload.proofs.code);
                    if (data.username && data.followerCount !== undefined && data.followerCount > 100) {
                        valid = true;
                        record = {
                            username: data.username,
                            followerCount: valid ? "gt100" : "",
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
exports.TwitterFollowerGT100Provider = TwitterFollowerGT100Provider;
class TwitterFollowerGT500Provider {
    constructor(options = {}) {
        this.type = "TwitterFollowerGT500";
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
                    data = yield verifyTwitterFollowers(payload.proofs.sessionKey, payload.proofs.code);
                    if (data && data.username && data.followerCount) {
                        valid = data.followerCount > 500;
                        record = {
                            username: data.username,
                            followerCount: valid ? "gt500" : "",
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
exports.TwitterFollowerGT500Provider = TwitterFollowerGT500Provider;
class TwitterFollowerGTE1000Provider {
    constructor(options = {}) {
        this.type = "TwitterFollowerGTE1000";
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
                    data = yield verifyTwitterFollowers(payload.proofs.sessionKey, payload.proofs.code);
                    if (data && data.followerCount && data.username) {
                        valid = data.followerCount >= 1000;
                        record = {
                            username: data.username,
                            followerCount: valid ? "gte1000" : "",
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
exports.TwitterFollowerGTE1000Provider = TwitterFollowerGTE1000Provider;
class TwitterFollowerGT5000Provider {
    constructor(options = {}) {
        this.type = "TwitterFollowerGT5000";
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
                    data = yield verifyTwitterFollowers(payload.proofs.sessionKey, payload.proofs.code);
                    if (data && data.username && data.followerCount) {
                        valid = data.followerCount > 5000;
                        record = {
                            username: data.username,
                            followerCount: valid ? "gt5000" : "",
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
exports.TwitterFollowerGT5000Provider = TwitterFollowerGT5000Provider;
//# sourceMappingURL=TwitterFollowerProvider.js.map