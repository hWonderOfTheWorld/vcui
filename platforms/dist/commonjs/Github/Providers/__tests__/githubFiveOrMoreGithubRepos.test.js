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
const githubFiveOrMoreRepos_1 = require("../githubFiveOrMoreRepos");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const validGithubUserResponse = {
    data: {
        id: "39483721",
        login: "a-cool-user",
        public_repos: 7,
        type: "User",
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
    mockedAxios.post.mockImplementation((url, data, config) => __awaiter(void 0, void 0, void 0, function* () {
        return validCodeResponse;
    }));
    mockedAxios.get.mockImplementation((url, config) => __awaiter(void 0, void 0, void 0, function* () {
        return validGithubUserResponse;
    }));
});
describe("Attempt verification", function () {
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        const fiveOrMoreGithubRepos = new githubFiveOrMoreRepos_1.FiveOrMoreGithubRepos();
        const fiveOrMoreGithubReposPayload = yield fiveOrMoreGithubRepos.verify({
            proofs: {
                code,
            },
        }, {});
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: "token 762165719dhiqudgasyuqwt6235" },
        });
        expect(fiveOrMoreGithubReposPayload).toEqual({
            valid: true,
            record: {
                id: validGithubUserResponse.data.id + "gte5GithubRepos",
            },
        });
    }));
    it("should return invalid payload when the user's repo count is less than 5", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url, config) => __awaiter(this, void 0, void 0, function* () {
            return {
                data: {
                    id: "39483721",
                    login: "a-cool-user",
                    public_repos: 3,
                    type: "User",
                },
                status: 200,
            };
        }));
        const fiveOrMoreGithubRepos = new githubFiveOrMoreRepos_1.FiveOrMoreGithubRepos();
        const fiveOrMoreGithubReposPayload = yield fiveOrMoreGithubRepos.verify({
            proofs: {
                code,
            },
        }, {});
        expect(fiveOrMoreGithubReposPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when unable to retrieve auth token", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data, config) => __awaiter(this, void 0, void 0, function* () {
            return {
                status: 500,
            };
        }));
        const fiveOrMoreGithubRepos = new githubFiveOrMoreRepos_1.FiveOrMoreGithubRepos();
        const fiveOrMoreGithubReposPayload = yield fiveOrMoreGithubRepos.verify({
            proofs: {
                code,
            },
        }, {});
        expect(fiveOrMoreGithubReposPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no id in verifyGithub response", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url, config) => __awaiter(this, void 0, void 0, function* () {
            return {
                data: {
                    id: undefined,
                    login: "my-login-handle",
                    public_repos: 7,
                    type: "User",
                },
                status: 200,
            };
        }));
        const fiveOrMoreGithubRepos = new githubFiveOrMoreRepos_1.FiveOrMoreGithubRepos();
        const fiveOrMoreGithubReposPayload = yield fiveOrMoreGithubRepos.verify({
            proofs: {
                code,
            },
        }, {});
        expect(fiveOrMoreGithubReposPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned by github user api", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url, config) => __awaiter(this, void 0, void 0, function* () {
            return {
                status: 500,
            };
        }));
        const fiveOrMoreGithubRepos = new githubFiveOrMoreRepos_1.FiveOrMoreGithubRepos();
        const fiveOrMoreGithubReposPayload = yield fiveOrMoreGithubRepos.verify({
            proofs: {
                code,
            },
        }, {});
        expect(fiveOrMoreGithubReposPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=githubFiveOrMoreGithubRepos.test.js.map