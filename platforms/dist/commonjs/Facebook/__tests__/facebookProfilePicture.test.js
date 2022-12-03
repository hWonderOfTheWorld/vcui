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
const axios_1 = __importDefault(require("axios"));
const luxon_1 = require("luxon");
const facebookProfilePicture_1 = require("../Providers/facebookProfilePicture");
jest.mock("axios");
describe("Attempt Facebook friends verification", function () {
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
    const validProfileData = {
        id: "some-user-id",
        picture: {
            data: {
                is_silhouette: false,
            },
        },
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: Object.assign({}, validAccessTokenData),
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 200,
                    data: Object.assign({}, validProfileData),
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: accessToken, fields: "id,picture{is_silhouette}" },
        });
        expect(result).toEqual({
            valid: true,
            record: {
                userId: "some-user-id",
                hasProfilePicture: "true",
            },
        });
    }));
    it("returns invalid response when status != 200 is returned", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: Object.assign({}, validAccessTokenData),
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 400,
                    data: Object.assign({}, validProfileData),
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: accessToken, fields: "id,picture{is_silhouette}" },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when access token is not valid", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: Object.assign({}, validAccessTokenData),
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 400,
                    data: {
                        error: {
                            message: "Error validating access token: The session is invalid because the user logged out.",
                            type: "OAuthException",
                            code: 190,
                            error_subcode: 467,
                            fbtrace_id: "xsdqfuiwqefguisbdjk",
                        },
                    },
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: accessToken, fields: "id,picture{is_silhouette}" },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when an error occurs when getting user profile", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: Object.assign({}, validAccessTokenData),
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                throw "some kind of error";
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: accessToken, fields: "id,picture{is_silhouette}" },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when is_silhouette is true", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: Object.assign({}, validAccessTokenData),
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 200,
                    data: Object.assign(Object.assign({}, validProfileData), { picture: {
                            data: {
                                is_silhouette: true,
                            },
                        } }),
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: accessToken, fields: "id,picture{is_silhouette}" },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when picture is not available", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: Object.assign({}, validAccessTokenData),
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 200,
                    data: Object.assign(Object.assign({}, validProfileData), { picture: undefined }),
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: accessToken, fields: "id,picture{is_silhouette}" },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when validation of the token fails `is_valid: false`", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: Object.assign(Object.assign({}, validAccessTokenData), { is_valid: false }),
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 200,
                    data: Object.assign(Object.assign({}, validProfileData), { picture: undefined }),
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: accessToken, fields: "id,picture{is_silhouette}" },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when validation of the token fails because of bad app ID", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: Object.assign(Object.assign({}, validAccessTokenData), { app_id: `BAD${process.env.FACEBOOK_APP_ID}` }),
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 200,
                    data: Object.assign(Object.assign({}, validProfileData), { picture: undefined }),
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/me/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: accessToken, fields: "id,picture{is_silhouette}" },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when validation of the token fails (exception thrown)", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                throw "some error";
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 200,
                    data: Object.assign(Object.assign({}, validProfileData), { picture: undefined }),
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
    it("returns invalid response when validation of the token fails because of empty data", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://graph.facebook.com/debug_token/")
                return Promise.resolve({
                    status: 200,
                    data: {
                        data: {},
                    },
                });
            else if (url === "https://graph.facebook.com/me/")
                return Promise.resolve({
                    status: 200,
                    data: Object.assign(Object.assign({}, validProfileData), { picture: undefined }),
                });
        });
        const result = yield new facebookProfilePicture_1.FacebookProfilePictureProvider().verify({
            proofs: {
                accessToken,
            },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(axios_1.default.get).toBeCalledWith("https://graph.facebook.com/debug_token/", {
            headers: { "User-Agent": "Facebook Graph Client" },
            params: { access_token: appAccessToken, input_token: accessToken },
        });
        expect(result).toMatchObject({
            valid: false,
        });
    }));
});
//# sourceMappingURL=facebookProfilePicture.test.js.map