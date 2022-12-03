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
const githubStarredRepoProvider_1 = require("../githubStarredRepoProvider");
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
            stargazers_count: 4,
        },
    ],
    status: 200,
};
const validGithubUserRepoResponse1Star = {
    data: [
        {
            owner: {
                id: 18723656,
                type: "User",
            },
            stargazers_count: 1,
            stargazers_url: "https://api.github.com/repos/a-cool-user/a-cool-repo/stargazers",
        },
    ],
    status: 200,
};
const validGithubUserRepoStargazersResponse = {
    data: [
        {
            login: "another-cool-user",
            id: 123456789,
            type: "User",
        },
    ],
    status: 200,
};
const invalidRequestResponse = {
    data: {
        message: "Error",
    },
    status: 500,
};
const zeroStargazersResponse = {
    data: [
        {
            owner: {
                id: 18723656,
                type: "User",
            },
            starred_count: 0,
        },
    ],
    status: 200,
};
const sameUserStarredRepoResponse = {
    data: [
        {
            owner: {
                id: 18723656,
                login: "a-cool-user",
                type: "User",
            },
            stargazers_count: 1,
            stargazers_url: "https://api.github.com/repos/a-cool-user/coolest-repo/stargazers",
        },
    ],
    status: 200,
};
const invalidGithubUserRepoStargazersResponse = {
    data: [
        {
            login: "a-cool-user",
            id: 18723656,
            type: "User",
        },
    ],
    status: 200,
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
            return validCodeResponse;
        }));
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return validGithubUserResponse;
            }
            if (url.endsWith("/repos?per_page=100")) {
                return validGithubUserRepoResponse;
            }
        }));
        const starredGithubRepoProvider = new githubStarredRepoProvider_1.StarredGithubRepoProvider();
        const starredGithubRepoProviderPayload = yield starredGithubRepoProvider.verify({
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
        expect(starredGithubRepoProviderPayload).toEqual({
            valid: true,
            record: {
                id: `${validGithubUserResponse.data.id}gte1Star`,
            },
        });
    }));
    it("handles valid verification attempt for user with stars count == 1, that isn't the repo owner", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return validGithubUserResponse;
            }
            if (url.endsWith("/repos?per_page=100")) {
                return validGithubUserRepoResponse1Star;
            }
            if (url.endsWith("/stargazers")) {
                return validGithubUserRepoStargazersResponse;
            }
        }));
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        const starredGithubRepoProvider = new githubStarredRepoProvider_1.StarredGithubRepoProvider();
        const starredGithubRepoProviderPayload = yield starredGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toBeCalledTimes(3);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(mockedAxios.get).toBeCalledWith(`https://api.github.com/users/${validGithubUserResponse.data.login}/repos?per_page=100`, {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/repos/a-cool-user/a-cool-repo/stargazers");
        expect(starredGithubRepoProviderPayload).toEqual({
            valid: true,
            record: {
                id: `${validGithubUserResponse.data.id}gte1Star`,
            },
        });
    }));
    it("should return invalid payload when unable to retrieve auth token", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementationOnce(() => __awaiter(this, void 0, void 0, function* () {
            return Promise.reject({
                status: 500,
            });
        }));
        const starredGithubRepoProvider = new githubStarredRepoProvider_1.StarredGithubRepoProvider();
        const starredGithubRepoProviderPayload = yield starredGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(starredGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no id in verifyGithub response", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return Promise.resolve({
                    data: {
                        id: undefined,
                        login: "a-cool-user",
                        type: "User",
                    },
                    status: 200,
                });
            }
        }));
        const starredGithubRepoProvider = new githubStarredRepoProvider_1.StarredGithubRepoProvider();
        const starredGithubRepoProviderPayload = yield starredGithubRepoProvider.verify({
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
        expect(starredGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a repo has only one star, and it came from the repo owner", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return validGithubUserResponse;
            }
            if (url.endsWith("/repos?per_page=100")) {
                return sameUserStarredRepoResponse;
            }
            if (url.endsWith("/stargazers")) {
                return invalidGithubUserRepoStargazersResponse;
            }
        }));
        const starredGithubRepoProvider = new githubStarredRepoProvider_1.StarredGithubRepoProvider();
        const starredGithubRepoProviderPayload = yield starredGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toHaveBeenCalledTimes(3);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(mockedAxios.get).toBeCalledWith(`https://api.github.com/users/${validGithubUserResponse.data.login}/repos?per_page=100`, {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/repos/a-cool-user/coolest-repo/stargazers");
        expect(starredGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when the stargazers count for all repos is less than 1", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return Promise.resolve(validGithubUserResponse);
            }
            if (url.endsWith("/repos?per_page=100")) {
                return Promise.resolve(zeroStargazersResponse);
            }
        }));
        const starredGithubRepoProvider = new githubStarredRepoProvider_1.StarredGithubRepoProvider();
        const starredGithubRepoProviderPayload = yield starredGithubRepoProvider.verify({
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
        expect(starredGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned by github user request", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementationOnce((url, config) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("/user")) {
                return Promise.reject(invalidRequestResponse);
            }
        }));
        const starredGithubRepoProvider = new githubStarredRepoProvider_1.StarredGithubRepoProvider();
        const starredGithubRepoProviderPayload = yield starredGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(starredGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned by github repo request", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.endsWith("https://api.github.com/user")) {
                return Promise.resolve(validGithubUserResponse);
            }
            else if (url.endsWith("/repos?per_page=100")) {
                return Promise.reject(invalidRequestResponse);
            }
        }));
        const starredGithubRepoProvider = new githubStarredRepoProvider_1.StarredGithubRepoProvider();
        const starredGithubRepoProviderPayload = yield starredGithubRepoProvider.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(mockedAxios.get).toBeCalledWith(`https://api.github.com/users/${validGithubUserResponse.data.login}/repos?per_page=100`, {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(starredGithubRepoProviderPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=githubStarredRepoProvider.test.js.map