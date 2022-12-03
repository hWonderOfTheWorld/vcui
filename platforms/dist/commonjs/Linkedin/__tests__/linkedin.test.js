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
const linkedin_1 = require("../../Linkedin/Providers/linkedin");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const validLinkedinUserResponse = {
    data: {
        id: "18723656",
        firstName: "First",
        lastName: "Last",
    },
    status: 200,
};
const validCodeResponse = {
    data: {
        access_token: "762165719dhiqudgasyuqwt6235",
    },
    status: 200,
};
const code = "ABC123_ACCESSCODE";
beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.post.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
        return validCodeResponse;
    }));
    mockedAxios.get.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
        return validLinkedinUserResponse;
    }));
});
describe("Attempt verification", function () {
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
        const linkedin = new linkedin_1.LinkedinProvider();
        const linkedinPayload = yield linkedin.verify({
            proofs: {
                code,
            },
        });
        expect(mockedAxios.post).toBeCalledWith(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${process.env.LINKEDIN_CALLBACK}`, {}, {
            headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        });
        expect(mockedAxios.get).toBeCalledWith("https://api.linkedin.com/v2/me", {
            headers: { Authorization: "Bearer 762165719dhiqudgasyuqwt6235" },
        });
        expect(linkedinPayload).toEqual({
            valid: true,
            record: {
                id: validLinkedinUserResponse.data.id,
            },
        });
    }));
    it("should return invalid payload when unable to retrieve auth token", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return {
                status: 500,
            };
        }));
        const linkedin = new linkedin_1.LinkedinProvider();
        const linkedinPayload = yield linkedin.verify({
            proofs: {
                code,
            },
        });
        expect(linkedinPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no id in verifyLinkedin response", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return {
                data: {
                    id: undefined,
                    firstName: "First",
                    lastName: "Last",
                },
                status: 200,
            };
        }));
        const linkedin = new linkedin_1.LinkedinProvider();
        const linkedinPayload = yield linkedin.verify({
            proofs: {
                code,
            },
        });
        expect(linkedinPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned by linkedin user api", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return {
                status: 500,
            };
        }));
        const linkedin = new linkedin_1.LinkedinProvider();
        const linkedinPayload = yield linkedin.verify({
            proofs: {
                code,
            },
        });
        expect(linkedinPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=linkedin.test.js.map