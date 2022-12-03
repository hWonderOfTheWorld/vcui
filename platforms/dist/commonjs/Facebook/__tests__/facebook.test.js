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
const facebook_1 = require("../Providers/facebook");
const axios_1 = __importDefault(require("axios"));
const luxon_1 = require("luxon");
jest.mock("axios");
describe("Attempt verification", function () {
    const accessToken = "12345";
    const appAccessToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    const tokenExpirationDate = luxon_1.DateTime.now().plus({ years: 1 }).toSeconds();
    const validAccessTokenData = {
        app_id: process.env.FACEBOOK_APP_ID,
        type: "USER",
        application: "Gitcoin Passport",
        data_access_expires_at: tokenExpirationDate,
        expires_at: tokenExpirationDate,
        is_valid: true,
        scopes: ["public_profile"],
        user_id: "some-user-id",
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockResolvedValueOnce({
            data: {
                data: Object.assign({}, validAccessTokenData),
            },
        });
        const result = yield new facebook_1.FacebookProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(result).toEqual({
            valid: true,
            record: {
                user_id: "some-user-id",
            },
        });
    }));
    it("returns invalid response when access token is not valid", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockResolvedValueOnce({
            data: {
                data: Object.assign(Object.assign({}, validAccessTokenData), { is_valid: false }),
            },
        });
        const result = yield new facebook_1.FacebookProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when user_id is not present", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockResolvedValueOnce({
            data: {
                data: Object.assign(Object.assign({}, validAccessTokenData), { user_id: undefined }),
            },
        });
        const result = yield new facebook_1.FacebookProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when app_id doesn't match passport app id", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockResolvedValueOnce({
            data: {
                data: Object.assign(Object.assign({}, validAccessTokenData), { app_id: "fake-app-id" }),
            },
        });
        const result = yield new facebook_1.FacebookProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when access token is expired", () => __awaiter(this, void 0, void 0, function* () {
        const expiredDate = luxon_1.DateTime.now().minus({ years: 1 }).toSeconds();
        axios_1.default.get.mockResolvedValueOnce({
            data: {
                data: Object.assign(Object.assign({}, validAccessTokenData), { expires_at: expiredDate }),
            },
        });
        const result = yield new facebook_1.FacebookProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when call results in error", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockRejectedValueOnce({ status: 400, data: { error: { message: "some error" } } });
        const result = yield new facebook_1.FacebookProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
});
//# sourceMappingURL=facebook.test.js.map