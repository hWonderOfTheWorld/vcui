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
const TwitterTweetsProvider_1 = require("../Providers/TwitterTweetsProvider");
const twitterOauth_1 = require("../procedures/twitterOauth");
jest.mock("../procedures/twitterOauth", () => ({
    getClient: jest.fn(),
    deleteClient: jest.fn(),
    getTweetCount: jest.fn(),
}));
const MOCK_TWITTER_OAUTH_CLIENT = {};
const MOCK_TWITTER_USER = {
    username: "DpoppDev",
    tweetCount: 200,
};
const sessionKey = "twitter-myOAuthSession";
const code = "ABC123_ACCESSCODE";
beforeEach(() => {
    jest.clearAllMocks();
    twitterOauth_1.getClient.mockReturnValue(MOCK_TWITTER_OAUTH_CLIENT);
});
describe("Attempt verification", function () {
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getTweetCount.mockResolvedValue(MOCK_TWITTER_USER);
        const twitter = new TwitterTweetsProvider_1.TwitterTweetGT10Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(twitterOauth_1.getClient).toBeCalledWith(sessionKey);
        expect(twitterOauth_1.getTweetCount).toBeCalledWith(MOCK_TWITTER_OAUTH_CLIENT, code);
        expect(twitterOauth_1.deleteClient).toBeCalledWith(sessionKey);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                username: "DpoppDev",
                tweetCount: "gt10",
            },
        });
    }));
    it("should return invalid payload when unable to retrieve twitter oauth client", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getClient.mockReturnValue(undefined);
        twitterOauth_1.getTweetCount.mockImplementationOnce((client) => __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(client ? MOCK_TWITTER_USER : {});
        }));
        const twitter = new TwitterTweetsProvider_1.TwitterTweetGT10Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no username in requestFindMyUser response", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getTweetCount.mockResolvedValue({ username: undefined });
        const twitter = new TwitterTweetsProvider_1.TwitterTweetGT10Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when requestFindMyUser throws", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getTweetCount.mockRejectedValue("unauthorized");
        const twitter = new TwitterTweetsProvider_1.TwitterTweetGT10Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when tweet count is 5", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getTweetCount.mockResolvedValue({ username: "DpoppDev", tweetCount: 5 });
        const twitter = new TwitterTweetsProvider_1.TwitterTweetGT10Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return valid payload when tweet count is 20", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getTweetCount.mockResolvedValue({ username: "DpoppDev", tweetCount: 20 });
        const twitter = new TwitterTweetsProvider_1.TwitterTweetGT10Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: true });
    }));
});
//# sourceMappingURL=twitterTweets.test.js.map