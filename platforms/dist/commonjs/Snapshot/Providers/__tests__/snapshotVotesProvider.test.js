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
const snapshotVotesProvider_1 = require("../snapshotVotesProvider");
const snapshotProposalsProvider_1 = require("../snapshotProposalsProvider");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";
const MOCK_ADDRESS_LOWER = MOCK_ADDRESS.toLocaleLowerCase();
const NO_MOCK_ADDRESS = "";
const BAD_MOCK_ADDRESS = "F314CE817E25b4F784bC1f24c9A79A525fEC50f";
const BAD_MOCK_ADDRESS_LOWER = BAD_MOCK_ADDRESS.toLocaleLowerCase();
const validSnapshotResponse = {
    data: {
        data: {
            votes: [
                {
                    voter: "0xc2E2B715d9e302947Ec7e312fd2384b5a1296099",
                    proposal: {
                        id: "0xc6655f1fb08259263693f9111a8cdaba6b726390e9dbb65eaa6ce41905ba297c",
                    },
                    space: {
                        id: "gitcoindao.eth",
                    },
                },
                {
                    voter: "0xc2E2B715d9e302947Ec7e312fd2384b5a1296099",
                    proposal: {
                        id: "0xc6309348f43ba77bb488d2d5f154db3264f86a890b500fa8286fe089c6ddc9a0",
                    },
                    space: {
                        id: "gitcoindao.eth",
                    },
                },
                {
                    voter: "0xc2E2B715d9e302947Ec7e312fd2384b5a1296099",
                    proposal: {
                        id: "0x625e70dcff35be042778684d66cb3e24efd35bdc4222d263047afd2699188fb6",
                    },
                    space: {
                        id: "opcollective.eth",
                    },
                },
                {
                    voter: "0xc2E2B715d9e302947Ec7e312fd2384b5a1296099",
                    proposal: {
                        id: "0x3fcd17d2393cfdcd3583a97fea85dfc9bc874b2e8ac2427c059e4e2566197e7f",
                    },
                    space: {
                        id: "rehashweb3.eth",
                    },
                },
            ],
        },
    },
};
const invalidSnapshotResponseLessThan2DAOProposalVotes = {
    data: {
        data: {
            votes: [
                {
                    voter: "0xc2E2B715d9e302947Ec7e312fd2384b5a1296099",
                    proposal: {
                        id: "0xc6655f1fb08259263693f9111a8cdaba6b726390e9dbb65eaa6ce41905ba297c",
                    },
                    space: {
                        id: "gitcoindao.eth",
                    },
                },
            ],
        },
    },
};
const invalidSnapshotResponseNoProposalsVotedOn = {
    data: {
        data: {
            votes: null,
        },
    },
};
describe("Attempt verification", function () {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
            const query = data.query;
            if (url === snapshotProposalsProvider_1.snapshotGraphQLDatabase && query.includes(MOCK_ADDRESS_LOWER)) {
                return validSnapshotResponse;
            }
        }));
        const snapshotVotesProvider = new snapshotVotesProvider_1.SnapshotVotesProvider();
        const verifiedPayload = yield snapshotVotesProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: `${MOCK_ADDRESS_LOWER}`,
                hasVotedOnGTE2SnapshotProposals: "true",
            },
        });
    }));
    it("should return invalid payload if the user has voted on less than 2 DAO proposals", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
            const query = data.query;
            if (url === snapshotProposalsProvider_1.snapshotGraphQLDatabase && query.includes(MOCK_ADDRESS_LOWER)) {
                return invalidSnapshotResponseLessThan2DAOProposalVotes;
            }
        }));
        const snapshotVotesProvider = new snapshotVotesProvider_1.SnapshotVotesProvider();
        const verifiedPayload = yield snapshotVotesProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload if the user has not voted on any DAO proposals (empty proposals array)", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
            const query = data.query;
            if (url === snapshotProposalsProvider_1.snapshotGraphQLDatabase && query.includes(MOCK_ADDRESS_LOWER)) {
                return invalidSnapshotResponseNoProposalsVotedOn;
            }
        }));
        const snapshotVotesProvider = new snapshotVotesProvider_1.SnapshotVotesProvider();
        const verifiedPayload = yield snapshotVotesProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when there is no address to send with the graphQL query", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
            const query = data.query;
            if (url === snapshotProposalsProvider_1.snapshotGraphQLDatabase && query.includes(NO_MOCK_ADDRESS)) {
                return Promise.resolve({
                    status: 400,
                    error: {
                        response: {
                            message: "Syntax Error: Invalid number, expected digit but got: 'x'.",
                        },
                    },
                });
            }
        }));
        const snapshotVotesProvider = new snapshotVotesProvider_1.SnapshotVotesProvider();
        const verifiedPayload = yield snapshotVotesProvider.verify({
            address: NO_MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned after Snapshot graphQL query", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
            const query = data.query;
            if (url === snapshotProposalsProvider_1.snapshotGraphQLDatabase && query.includes(BAD_MOCK_ADDRESS_LOWER)) {
                return Promise.resolve({
                    status: 400,
                    error: {
                        response: {
                            message: "Bad request",
                        },
                    },
                });
            }
        }));
        const snapshotVotesProvider = new snapshotVotesProvider_1.SnapshotVotesProvider();
        const verifiedPayload = yield snapshotVotesProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when an exception is thrown when a request is made", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
            const query = data.query;
            if (url === snapshotProposalsProvider_1.snapshotGraphQLDatabase && query.includes(BAD_MOCK_ADDRESS_LOWER)) {
                throw "an error";
            }
        }));
        const snapshotVotesProvider = new snapshotVotesProvider_1.SnapshotVotesProvider();
        const verifiedPayload = yield snapshotVotesProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=snapshotVotesProvider.test.js.map