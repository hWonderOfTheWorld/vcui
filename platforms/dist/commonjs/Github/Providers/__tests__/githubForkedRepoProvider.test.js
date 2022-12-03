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
const githubForkedRepoProvider_1 = require("../githubForkedRepoProvider");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const validGithubUserResponse = {
    data: {
        id: 18723656,
        login: "a-cool-user",
        type: "User",
    },
    status: 200,
};
const validGithubUserRepoResponse = {
    data: [
        {
            owner: {
                id: 18723656,
                type: "User",
            },
            fork: false,
            forks_count: 5,
        },
        {
            owner: {
                id: 18723656,
                type: "User",
            },
            fork: true,
            forks_count: 2,
        },
    ],
    status: 200,
};
const invalidGithubUserRepoResponse = {
    data: [
        {
            owner: {
                id: 18723656,
                type: "User",
            },
            fork: false,
            forks_count: 0,
        },
    ],
    status: 200,
};
const invalidGithubResponse = {
    data: {
        message: "Error",
    },
    status: 500,
};
const validCodeResponse = {
    data: {
        access_token: "762165719dhiqudgasyuqwt6235",
    },
    status: 200,
};
const code = "ABC123_ACCESSCODE";
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
beforeEach(() => {
    jest.clearAllMocks();
});
describe("Attempt verification", function () {
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(validCodeResponse);
        }));
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return Promise.resolve(validGithubUserResponse);
            }
            if (url.endsWith("/repos?per_page=100")) {
                return Promise.resolve(validGithubUserRepoResponse);
            }
        }));
        const forkedGithubRepoProvider = new githubForkedRepoProvider_1.ForkedGithubRepoProvider();
        const forkedGithubRepoProviderPayload = yield forkedGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toBeCalledTimes(2);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(mockedAxios.get).toBeCalledWith(`https://api.github.com/users/${validGithubUserResponse.data.login}/repos?per_page=100`, {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(forkedGithubRepoProviderPayload).toEqual({
            valid: true,
            record: {
                id: `${validGithubUserResponse.data.id}gte1Fork`,
            },
        });
    }));
    it("should return invalid payload when unable to retrieve auth token", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementationOnce(() => __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve({
                status: 500,
            });
        }));
        const forkedGithubRepoProvider = new githubForkedRepoProvider_1.ForkedGithubRepoProvider();
        const forkedGithubRepoProviderPayload = yield forkedGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(forkedGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no id in verifyGithub response", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve({
                data: {
                    id: undefined,
                    login: "a-cool-user",
                    type: "User",
                },
                status: 200,
            });
        }));
        const forkedGithubRepoProvider = new githubForkedRepoProvider_1.ForkedGithubRepoProvider();
        const forkedGithubRepoProviderPayload = yield forkedGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toBeCalledTimes(2);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(forkedGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when the fork count for all repos is less than 1", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return Promise.resolve(validGithubUserResponse);
            }
            if (url.endsWith("/repos?per_page=100")) {
                return Promise.resolve(invalidGithubUserRepoResponse);
            }
        }));
        const forkedGithubRepoProvider = new githubForkedRepoProvider_1.ForkedGithubRepoProvider();
        const forkedGithubRepoProviderPayload = yield forkedGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toBeCalledTimes(2);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(mockedAxios.get).toBeCalledWith(`https://api.github.com/users/${validGithubUserResponse.data.login}/repos?per_page=100`, {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(forkedGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned by github user request", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return Promise.reject(invalidGithubResponse);
            }
        }));
        const forkedGithubRepoProvider = new githubForkedRepoProvider_1.ForkedGithubRepoProvider();
        const forkedGithubRepoProviderPayload = yield forkedGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toBeCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(forkedGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned by github repo request", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return Promise.resolve(validGithubUserResponse);
            }
            if (url.endsWith("/repos?per_page=100")) {
                return Promise.reject(invalidGithubResponse);
            }
        }));
        const forkedGithubRepoProvider = new githubForkedRepoProvider_1.ForkedGithubRepoProvider();
        const forkedGithubRepoProviderPayload = yield forkedGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toBeCalledTimes(2);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(mockedAxios.get).toBeCalledWith(`https://api.github.com/users/${validGithubUserResponse.data.login}/repos?per_page=100`, {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(forkedGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=githubForkedRepoProvider.test.js.map