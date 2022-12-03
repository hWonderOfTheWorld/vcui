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
exports.getTweetCount = exports.getFollowerCount = exports.requestFindMyUser = exports.generateAuthURL = exports.getClient = exports.deleteClient = exports.initClient = exports.getSessionKey = exports.authedClients = exports.clients = void 0;
const crypto_1 = __importDefault(require("crypto"));
const twitter_api_sdk_1 = require("twitter-api-sdk");
const TIMEOUT_IN_MS = 60000;
const TIMEOUT_AUTHED_IN_MS = 10000;
exports.clients = {};
exports.authedClients = {};
const getSessionKey = () => {
    return `twitter-${crypto_1.default.randomBytes(32).toString("hex")}`;
};
exports.getSessionKey = getSessionKey;
const initClient = (callback, sessionKey) => {
    if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
        exports.clients[sessionKey] = new twitter_api_sdk_1.auth.OAuth2User({
            client_id: process.env.TWITTER_CLIENT_ID,
            client_secret: process.env.TWITTER_CLIENT_SECRET,
            callback: callback,
            scopes: ["tweet.read", "users.read"],
        });
        setTimeout(() => {
            (0, exports.deleteClient)(sessionKey);
        }, TIMEOUT_IN_MS);
        return exports.clients[sessionKey];
    }
    else {
        throw "Missing TWITTER_CLIENT_ID or TWITTER_CLIENT_SECRET";
    }
};
exports.initClient = initClient;
const timeoutDel = {};
const timeoutAuthDel = {};
const deleteClient = (state) => {
    timeoutDel[state] = setTimeout(() => {
        delete exports.clients[state];
        delete timeoutDel[state];
    }, TIMEOUT_AUTHED_IN_MS);
};
exports.deleteClient = deleteClient;
const deleteAuthClient = (code) => {
    timeoutAuthDel[code] = setTimeout(() => {
        delete exports.authedClients[code];
        delete timeoutAuthDel[code];
    }, TIMEOUT_AUTHED_IN_MS);
};
const getClient = (state) => {
    clearTimeout(timeoutDel[state]);
    const ret = exports.clients[state];
    if (ret !== undefined) {
        return ret;
    }
    throw "Unable to get twitter client";
};
exports.getClient = getClient;
const getAuthClient = (client, code) => __awaiter(void 0, void 0, void 0, function* () {
    clearTimeout(timeoutAuthDel[code]);
    if (!exports.authedClients[code]) {
        yield client.requestAccessToken(code);
        exports.authedClients[code] = new twitter_api_sdk_1.Client(client);
    }
    deleteAuthClient(code);
    return exports.authedClients[code];
});
const generateAuthURL = (client, state) => {
    return client.generateAuthURL({
        state,
        code_challenge_method: "s256",
    });
};
exports.generateAuthURL = generateAuthURL;
const requestFindMyUser = (client, code) => __awaiter(void 0, void 0, void 0, function* () {
    const twitterClient = yield getAuthClient(client, code);
    const myUser = yield twitterClient.users.findMyUser();
    return Object.assign({}, myUser.data);
});
exports.requestFindMyUser = requestFindMyUser;
const getFollowerCount = (client, code) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const twitterClient = yield getAuthClient(client, code);
    const myUser = yield twitterClient.users.findMyUser({
        "user.fields": ["public_metrics"],
    });
    return {
        username: (_a = myUser.data) === null || _a === void 0 ? void 0 : _a.username,
        followerCount: (_c = (_b = myUser.data) === null || _b === void 0 ? void 0 : _b.public_metrics) === null || _c === void 0 ? void 0 : _c.followers_count,
    };
});
exports.getFollowerCount = getFollowerCount;
const getTweetCount = (client, code) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const twitterClient = yield getAuthClient(client, code);
    const myUser = yield twitterClient.users.findMyUser({
        "user.fields": ["public_metrics"],
    });
    return {
        username: (_d = myUser.data) === null || _d === void 0 ? void 0 : _d.username,
        tweetCount: (_f = (_e = myUser.data) === null || _e === void 0 ? void 0 : _e.public_metrics) === null || _f === void 0 ? void 0 : _f.tweet_count,
    };
});
exports.getTweetCount = getTweetCount;
//# sourceMappingURL=twitterOauth.js.map