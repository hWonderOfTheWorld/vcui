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
const TwitterFollowerProvider_1 = require("../Providers/TwitterFollowerProvider");
const twitterOauth_1 = require("../procedures/twitterOauth");
jest.mock("../procedures/twitterOauth", () => ({
    getClient: jest.fn(),
    deleteClient: jest.fn(),
    getFollowerCount: jest.fn(),
}));
const MOCK_TWITTER_OAUTH_CLIENT = {};
const MOCK_TWITTER_USER = {
    username: "DpoppDev",
    followerCount: 200,
};
const sessionKey = "twitter-myOAuthSession";
const code = "ABC123_ACCESSCODE";
beforeEach(() => {
    jest.clearAllMocks();
    twitterOauth_1.getClient.mockReturnValue(MOCK_TWITTER_OAUTH_CLIENT);
});
describe("Attempt verification", function () {
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getFollowerCount.mockResolvedValue(MOCK_TWITTER_USER);
        const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT100Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(twitterOauth_1.getClient).toBeCalledWith(sessionKey);
        expect(twitterOauth_1.getFollowerCount).toBeCalledWith(MOCK_TWITTER_OAUTH_CLIENT, code);
        expect(twitterOauth_1.deleteClient).toBeCalledWith(sessionKey);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                username: "DpoppDev",
                followerCount: "gt100",
            },
        });
    }));
    it("should return invalid payload when unable to retrieve twitter oauth client", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getClient.mockReturnValue(undefined);
        twitterOauth_1.getFollowerCount.mockImplementationOnce((client) => __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(client ? MOCK_TWITTER_USER : {});
        }));
        const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT100Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no username in requestFindMyUser response", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getFollowerCount.mockResolvedValue({ username: undefined });
        const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT100Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when requestFindMyUser throws", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getFollowerCount.mockRejectedValue("unauthorized");
        const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT100Provider();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    describe("Check invalid cases for follower ranges", function () {
        it("Expected Greater than 100 and Follower Count is 50", () => __awaiter(this, void 0, void 0, function* () {
            twitterOauth_1.getFollowerCount.mockResolvedValue({ username: "DpoppDev", followerCount: 50 });
            const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT100Provider();
            const verifiedPayload = yield twitter.verify({
                proofs: {
                    sessionKey,
                    code,
                },
            });
            expect(verifiedPayload).toMatchObject({ valid: false });
        }));
        it("Expected Greater than 500 and Follower Count is 150", () => __awaiter(this, void 0, void 0, function* () {
            twitterOauth_1.getFollowerCount.mockResolvedValue({ username: "DpoppDev", followerCount: 150 });
            const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT500Provider();
            const verifiedPayload = yield twitter.verify({
                proofs: {
                    sessionKey,
                    code,
                },
            });
            expect(verifiedPayload).toMatchObject({ valid: false });
        }));
        it("Expected Greater than or equal to 1000 and Follower Count is 900", () => __awaiter(this, void 0, void 0, function* () {
            twitterOauth_1.getFollowerCount.mockResolvedValue({ username: "DpoppDev", followerCount: 900 });
            const twitter = new TwitterFollowerProvider_1.TwitterFollowerGTE1000Provider();
            const verifiedPayload = yield twitter.verify({
                proofs: {
                    sessionKey,
                    code,
                },
            });
            expect(verifiedPayload).toMatchObject({ valid: false });
        }));
        it("Expected Greater than 5000 and Follower Count is 2500", () => __awaiter(this, void 0, void 0, function* () {
            twitterOauth_1.getFollowerCount.mockResolvedValue({ username: "DpoppDev", followerCount: 2500 });
            const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT5000Provider();
            const verifiedPayload = yield twitter.verify({
                proofs: {
                    sessionKey,
                    code,
                },
            });
            expect(verifiedPayload).toMatchObject({ valid: false });
        }));
    });
    describe("Check valid cases for follower ranges", function () {
        it("Expected Greater than 100 and Follower Count is 150", () => __awaiter(this, void 0, void 0, function* () {
            twitterOauth_1.getFollowerCount.mockResolvedValue({ username: "DpoppDev", followerCount: 150 });
            const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT100Provider();
            const verifiedPayload = yield twitter.verify({
                proofs: {
                    sessionKey,
                    code,
                },
            });
            expect(verifiedPayload).toMatchObject({ valid: true });
        }));
        it("Expected Greater than 500 and Follower Count is 700", () => __awaiter(this, void 0, void 0, function* () {
            twitterOauth_1.getFollowerCount.mockResolvedValue({ username: "DpoppDev", followerCount: 700 });
            const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT500Provider();
            const verifiedPayload = yield twitter.verify({
                proofs: {
                    sessionKey,
                    code,
                },
            });
            expect(verifiedPayload).toMatchObject({ valid: true });
        }));
        it("Expected Greater than or equal to 1000 and Follower Count is 1500", () => __awaiter(this, void 0, void 0, function* () {
            twitterOauth_1.getFollowerCount.mockResolvedValue({ username: "DpoppDev", followerCount: 1500 });
            const twitter = new TwitterFollowerProvider_1.TwitterFollowerGTE1000Provider();
            const verifiedPayload = yield twitter.verify({
                proofs: {
                    sessionKey,
                    code,
                },
            });
            expect(verifiedPayload).toMatchObject({ valid: true });
        }));
        it("Expected Greater than 5000 and Follower Count is 7500", () => __awaiter(this, void 0, void 0, function* () {
            twitterOauth_1.getFollowerCount.mockResolvedValue({ username: "DpoppDev", followerCount: 7500 });
            const twitter = new TwitterFollowerProvider_1.TwitterFollowerGT5000Provider();
            const verifiedPayload = yield twitter.verify({
                proofs: {
                    sessionKey,
                    code,
                },
            });
            expect(verifiedPayload).toMatchObject({ valid: true });
        }));
    });
});
//# sourceMappingURL=twitterFollower.test.js.map