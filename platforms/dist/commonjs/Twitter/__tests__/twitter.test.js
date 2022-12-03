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
const TwitterAuthProvider_1 = __importDefault(require("../Providers/TwitterAuthProvider"));
const twitterOauth_1 = require("../procedures/twitterOauth");
jest.mock("../procedures/twitterOauth", () => ({
    getClient: jest.fn(),
    deleteClient: jest.fn(),
    requestFindMyUser: jest.fn(),
}));
const MOCK_TWITTER_OAUTH_CLIENT = {};
const MOCK_TWITTER_USER = {
    id: "123",
    name: "Userguy McTesterson",
    username: "DpoppDev",
};
const sessionKey = "twitter-myOAuthSession";
const code = "ABC123_ACCESSCODE";
beforeEach(() => {
    jest.clearAllMocks();
    twitterOauth_1.getClient.mockReturnValue(MOCK_TWITTER_OAUTH_CLIENT);
});
describe("Attempt verification", function () {
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.requestFindMyUser.mockResolvedValue(MOCK_TWITTER_USER);
        const twitter = new TwitterAuthProvider_1.default();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(twitterOauth_1.getClient).toBeCalledWith(sessionKey);
        expect(twitterOauth_1.requestFindMyUser).toBeCalledWith(MOCK_TWITTER_OAUTH_CLIENT, code);
        expect(twitterOauth_1.deleteClient).toBeCalledWith(sessionKey);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                username: MOCK_TWITTER_USER.username,
            },
        });
    }));
    it("should return invalid payload when unable to retrieve twitter oauth client", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.getClient.mockResolvedValueOnce(undefined);
        twitterOauth_1.requestFindMyUser.mockResolvedValueOnce((client) => {
            return client ? MOCK_TWITTER_USER : {};
        });
        const twitter = new TwitterAuthProvider_1.default();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no username in requestFindMyUser response", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.requestFindMyUser.mockResolvedValue({ username: undefined });
        const twitter = new TwitterAuthProvider_1.default();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when requestFindMyUser throws", () => __awaiter(this, void 0, void 0, function* () {
        twitterOauth_1.requestFindMyUser.mockRejectedValue("unauthorized");
        const twitter = new TwitterAuthProvider_1.default();
        const verifiedPayload = yield twitter.verify({
            proofs: {
                sessionKey,
                code,
            },
        });
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=twitter.test.js.map