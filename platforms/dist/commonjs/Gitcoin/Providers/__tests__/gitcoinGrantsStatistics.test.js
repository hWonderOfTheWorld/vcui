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
const gitcoinGrantsStatistics_1 = require("../gitcoinGrantsStatistics");
jest.mock("axios");
const mockedAxios = axios_1.default;
const userHandle = "my-login-handle";
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const gitcoinAmiApiToken = process.env.AMI_API_TOKEN;
const validGithubUserResponse = {
    data: {
        id: "18723656",
        login: userHandle,
        type: "User",
    },
    status: 200,
};
const githubAccessCode = "762165719dhiqudgasyuqwt6235";
const validCodeResponse = {
    data: {
        access_token: githubAccessCode,
    },
    status: 200,
};
const testDataUrl = "https://gitcoin.co/grants/v1/api/vc/configurable_test_endpoint";
const testProviderPrefix = "GitcoinGrantStatisticsProviderTester";
const code = "ABC123_ACCESSCODE";
class GitcoinGrantStatisticsProviderTester extends gitcoinGrantsStatistics_1.GitcoinGrantStatisticsProvider {
    constructor(options = {}) {
        super(testProviderPrefix, options);
        this.dataUrl = testDataUrl;
    }
}
beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.post.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
        return validCodeResponse;
    }));
});
describe("GitcoinGrantStatisticsProvider class", function () {
    it("should properly initialize the attributes", function () {
        const threshold = 193;
        const receivingAttribute = "aaa";
        const recordAttribute = "bbb";
        const gitcoin = new GitcoinGrantStatisticsProviderTester({
            threshold,
            receivingAttribute,
            recordAttribute,
        });
        expect(gitcoin.type).toEqual(`${testProviderPrefix}#${recordAttribute}#${threshold}`);
        expect(gitcoin.dataUrl).toEqual(testDataUrl);
    });
});
describe("Attempt verification %s", function () {
    it.each([
        ["num_grants_contribute_to", "numGrantsContributedToGte", 123, 122, false],
        ["num_grants_contribute_to", "numGrantsContributedToGte", 123, 123, true],
        ["num_grants_contribute_to", "numGrantsContributedToGte", 123, 124, true],
        ["num_rounds_contribute_to", "numRoundsContributedToGte", 12, 11, false],
        ["num_rounds_contribute_to", "numRoundsContributedToGte", 12, 12, true],
        ["num_rounds_contribute_to", "numRoundsContributedToGte", 12, 13, true],
    ])(" for %p (and VerifiedPayload record %p) with threshold %p for the received value is %p expects %p", (receivingAttribute, recordAttribute, threshold, returnedValue, expectedValid) => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://api.github.com/user")
                return Promise.resolve(validGithubUserResponse);
            else if (url.startsWith(testDataUrl))
                return Promise.resolve({
                    status: 200,
                    data: Object.assign({
                        num_grants_contribute_to: 0,
                        num_rounds_contribute_to: 0,
                        total_contribution_amount: 0,
                        num_gr14_contributions: false,
                    }, { [receivingAttribute]: returnedValue }),
                });
        });
        const gitcoin = new GitcoinGrantStatisticsProviderTester({
            threshold,
            receivingAttribute,
            recordAttribute,
        });
        const gitcoinPayload = yield gitcoin.verify({
            address: "0x0",
            proofs: {
                code,
            },
        }, {});
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: `token ${githubAccessCode}` },
        });
        expect(mockedAxios.get).toBeCalledWith(`${testDataUrl}?handle=${userHandle}`, {
            headers: { Authorization: `token ${gitcoinAmiApiToken}` },
        });
        if (expectedValid)
            expect(gitcoinPayload).toEqual({
                valid: true,
                record: {
                    id: validGithubUserResponse.data.id,
                    [recordAttribute]: `${threshold}`,
                },
            });
        else
            expect(gitcoinPayload).toEqual({
                valid: false,
            });
    }));
    it("should return invalid payload when unable to retrieve auth token (http status code 500 received)", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.post.mockImplementation((url, data, config) => __awaiter(this, void 0, void 0, function* () {
            return {
                status: 500,
            };
        }));
        axios_1.default.get.mockImplementation((url) => {
            return Promise.resolve({
                status: 200,
                data: {},
            });
        });
        const github = new GitcoinGrantStatisticsProviderTester({ threshold: 1 });
        const gitcoinPayload = yield github.verify({
            address: "0x0",
            proofs: {
                code,
            },
        }, {});
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(axios_1.default.get).toHaveBeenCalledTimes(0);
        expect(gitcoinPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when unable to retrieve auth token (exception thrown)", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.post.mockImplementation((url, data, config) => __awaiter(this, void 0, void 0, function* () {
            throw "Some kind of error";
        }));
        axios_1.default.get.mockImplementation((url) => {
            return Promise.resolve({
                status: 200,
                data: {},
            });
        });
        const github = new GitcoinGrantStatisticsProviderTester({ threshold: 1 });
        const gitcoinPayload = yield github.verify({
            address: "0x0",
            proofs: {
                code,
            },
        }, {});
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(axios_1.default.get).toHaveBeenCalledTimes(0);
        expect(gitcoinPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no id in verifyGithub response", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://api.github.com/user")
                return Promise.resolve(Object.assign(Object.assign({}, validGithubUserResponse), { data: {
                        login: userHandle,
                        type: "User",
                    } }));
            else if (url.startsWith("https://gitcoin.co/grants/v1/api/vc/contributor_statistics"))
                return Promise.resolve({
                    status: 200,
                    data: Object.assign({
                        num_grants_contribute_to: 0,
                        num_rounds_contribute_to: 0,
                        total_contribution_amount: 0,
                        num_gr14_contributions: false,
                    }),
                });
        });
        const github = new GitcoinGrantStatisticsProviderTester({ threshold: 1 });
        const gitcoinPayload = yield github.verify({
            address: "0x0",
            proofs: {
                code,
            },
        }, {});
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: `token ${githubAccessCode}` },
        });
        expect(gitcoinPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned by github user api", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://api.github.com/user")
                throw new Error("API EXCEPTION");
            else if (url.startsWith("https://gitcoin.co/grants/v1/api/vc/contributor_statistics"))
                return Promise.resolve({
                    status: 200,
                    data: Object.assign({
                        num_grants_contribute_to: 0,
                        num_rounds_contribute_to: 0,
                        total_contribution_amount: 0,
                        num_gr14_contributions: false,
                    }),
                });
        });
        const github = new GitcoinGrantStatisticsProviderTester({ threshold: 1 });
        const gitcoinPayload = yield github.verify({
            address: "0x0",
            proofs: {
                code,
            },
        }, {});
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: `token ${githubAccessCode}` },
        });
        expect(gitcoinPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad response received when calling the github user api (exception thrown)", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://api.github.com/user")
                throw "Some kind of error";
            else if (url.startsWith("https://gitcoin.co/grants/v1/api/vc/contributor_statistics"))
                return Promise.resolve({
                    status: 200,
                    data: Object.assign({
                        num_grants_contribute_to: 0,
                        num_rounds_contribute_to: 0,
                        total_contribution_amount: 0,
                        num_gr14_contributions: false,
                    }),
                });
        });
        const github = new GitcoinGrantStatisticsProviderTester({ threshold: 1 });
        const gitcoinPayload = yield github.verify({
            address: "0x0",
            proofs: {
                code,
            },
        }, {});
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: `token ${githubAccessCode}` },
        });
        expect(gitcoinPayload).toMatchObject({ valid: false });
    }));
    it("should use the lowercase github handle when making querying the gitcoin API", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            if (url === "https://api.github.com/user") {
                return Promise.resolve({
                    data: {
                        id: "18723656",
                        login: "User-Handle-With-Upper",
                        type: "User",
                    },
                    status: 200,
                });
            }
            else if (url.startsWith("https://gitcoin.co/grants/v1/api/vc/contributor_statistics"))
                return Promise.resolve({
                    status: 200,
                    data: Object.assign({
                        num_grants_contribute_to: 0,
                        num_rounds_contribute_to: 0,
                        total_contribution_amount: 0,
                        num_gr14_contributions: false,
                    }),
                });
        });
        const github = new GitcoinGrantStatisticsProviderTester({ threshold: 1 });
        const gitcoinPayload = yield github.verify({
            address: "0x0",
            proofs: {
                code,
            },
        }, {});
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toBeCalledWith(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {}, {
            headers: { Accept: "application/json" },
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toBeCalledWith("https://api.github.com/user", {
            headers: { Authorization: `token ${githubAccessCode}` },
        });
        expect(mockedAxios.get).nthCalledWith(2, `${testDataUrl}?handle=user-handle-with-upper`, {
            headers: { Authorization: `token ${gitcoinAmiApiToken}` },
        });
        expect(gitcoinPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=gitcoinGrantsStatistics.test.js.map