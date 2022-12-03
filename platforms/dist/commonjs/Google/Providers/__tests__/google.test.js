"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const google = __importStar(require("../google"));
const MOCK_EMAIL = "testEmail";
const MOCK_EMAIL_VERIFIED = true;
const MOCK_TOKEN_ID = "testToken";
const MOCK_ACCESS_TOKEN = "secret access token";
const axios_1 = __importDefault(require("axios"));
describe("Attempt verification", function () {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        const googleProvider = new google.GoogleProvider();
        const verifyGoogleMock = jest
            .spyOn(google, "verifyGoogle")
            .mockImplementation((code) => {
            return new Promise((resolve) => {
                resolve({
                    email: MOCK_EMAIL,
                    emailVerified: MOCK_EMAIL_VERIFIED,
                });
            });
        });
        const verifiedPayload = yield googleProvider.verify({
            address: "0x0",
            proofs: {
                code: MOCK_TOKEN_ID,
            },
        });
        expect(verifyGoogleMock).toBeCalledWith(MOCK_TOKEN_ID);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                email: MOCK_EMAIL,
            },
        });
    }));
    it("should return invalid payload when email is not verified", () => __awaiter(this, void 0, void 0, function* () {
        const googleProvider = new google.GoogleProvider();
        const verifyGoogleMock = jest
            .spyOn(google, "verifyGoogle")
            .mockImplementation((code) => {
            return new Promise((resolve) => {
                resolve({
                    email: MOCK_EMAIL,
                    emailVerified: false,
                });
            });
        });
        const verifiedPayload = yield googleProvider.verify({
            address: "0x0",
            proofs: {
                code: MOCK_TOKEN_ID,
            },
        });
        expect(verifyGoogleMock).toBeCalledWith(MOCK_TOKEN_ID);
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {
                email: MOCK_EMAIL,
            },
        });
    }));
});
describe("verifyGoogle", function () {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it("should suceed when a access token and user info are obtained", () => __awaiter(this, void 0, void 0, function* () {
        const requestAccessTokenMock = jest
            .spyOn(google, "requestAccessToken")
            .mockImplementation((code) => {
            return new Promise((resolve) => {
                resolve(MOCK_ACCESS_TOKEN);
            });
        });
        const userInfoMock = jest.spyOn(axios_1.default, "get").mockImplementation((code) => {
            return new Promise((resolve) => {
                resolve({
                    data: {
                        email: MOCK_EMAIL,
                        verified_email: MOCK_EMAIL_VERIFIED,
                    },
                    status: 200,
                });
            });
        });
        const verifiedGoogleResponse = yield google.verifyGoogle(MOCK_TOKEN_ID);
        expect(requestAccessTokenMock).toBeCalledWith(MOCK_TOKEN_ID);
        expect(userInfoMock).toBeCalledWith("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${MOCK_ACCESS_TOKEN}` },
        });
        expect(verifiedGoogleResponse).toEqual({
            email: MOCK_EMAIL,
            emailVerified: MOCK_EMAIL_VERIFIED,
        });
    }));
    it("should throw if getting user info throws", () => __awaiter(this, void 0, void 0, function* () {
        const requestAccessTokenMock = jest
            .spyOn(google, "requestAccessToken")
            .mockImplementation((code) => {
            return new Promise((resolve) => {
                resolve(MOCK_ACCESS_TOKEN);
            });
        });
        const userInfoMock = jest.spyOn(axios_1.default, "get").mockImplementation((code) => {
            throw { response: { data: { error: { message: "error message for user data request" } } } };
        });
        const verifiedGoogleResponse = yield google.verifyGoogle(MOCK_TOKEN_ID);
        expect(verifiedGoogleResponse).toEqual({
            errors: [
                "Error getting user info",
                "undefined",
                "Status undefined: undefined",
                "Details: " + JSON.stringify({ error: { message: "error message for user data request" } }),
            ],
        });
        expect(requestAccessTokenMock).toBeCalledWith(MOCK_TOKEN_ID);
        expect(userInfoMock).toBeCalledTimes(1);
        expect(userInfoMock).toBeCalledWith("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${MOCK_ACCESS_TOKEN}` },
        });
    }));
    it("should throw when requestAccessToken throws", () => __awaiter(this, void 0, void 0, function* () {
        jest.spyOn(google, "requestAccessToken").mockImplementation((code) => {
            throw new Error("ERROR");
        });
        const verifiedGoogleResponse = yield google.verifyGoogle(MOCK_TOKEN_ID);
        expect(verifiedGoogleResponse).toEqual({
            errors: ["Error getting user info", "ERROR", "Status undefined: undefined", "Details: undefined"],
        });
    }));
});
//# sourceMappingURL=google.test.js.map