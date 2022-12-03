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
            proposals: [
                {
                    id: "0x8f46d1bd6d14681d42fa01b80f14b56f2953f5a8b95154d6ce9c8fe1db599771",
                    scores_total: 0,
                    author: `${MOCK_ADDRESS_LOWER}`,
                },
                {
                    id: "0x4d33fc4d9f6b8a6ed44ef78a1cc3dcb6c120c7f28fa938ced99385bbdaa0ba23",
                    scores_total: 228,
                    author: `${MOCK_ADDRESS_LOWER}`,
                },
            ],
        },
    },
};
const invalidSnapshotResponseNoProposalVotes = {
    data: {
        data: {
            proposals: [
                {
                    id: "0x8f46d1bd6d14681d42fa01b80f14b56f2953f5a8b95154d6ce9c8fe1db599771",
                    scores_total: 0,
                    author: `${MOCK_ADDRESS_LOWER}`,
                },
                {
                    id: "0x4d33fc4d9f6b8a6ed44ef78a1cc3dcb6c120c7f28fa938ced99385bbdaa0ba23",
                    scores_total: 0,
                    author: `${MOCK_ADDRESS_LOWER}`,
                },
            ],
        },
    },
};
const invalidSnapshotResponseNoProposals = {
    data: {
        data: {
            proposals: null,
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
        const snapshotProposalsProvider = new snapshotProposalsProvider_1.SnapshotProposalsProvider();
        const verifiedPayload = yield snapshotProposalsProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: `${MOCK_ADDRESS_LOWER}`,
                hasGT1SnapshotProposalsVotedOn: "true",
            },
        });
    }));
    it("should return invalid payload if the user has proposals, but none of them have been voted on", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
            const query = data.query;
            if (url === snapshotProposalsProvider_1.snapshotGraphQLDatabase && query.includes(MOCK_ADDRESS_LOWER)) {
                return invalidSnapshotResponseNoProposalVotes;
            }
        }));
        const snapshotProposalsProvider = new snapshotProposalsProvider_1.SnapshotProposalsProvider();
        const verifiedPayload = yield snapshotProposalsProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload if the user does not have any proposals (empty proposals array)", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
            const query = data.query;
            if (url === snapshotProposalsProvider_1.snapshotGraphQLDatabase && query.includes(MOCK_ADDRESS_LOWER)) {
                return invalidSnapshotResponseNoProposals;
            }
        }));
        const snapshotProposalsProvider = new snapshotProposalsProvider_1.SnapshotProposalsProvider();
        const verifiedPayload = yield snapshotProposalsProvider.verify({
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
        const snapshotProposalsProvider = new snapshotProposalsProvider_1.SnapshotProposalsProvider();
        const verifiedPayload = yield snapshotProposalsProvider.verify({
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
        const snapshotProposalsProvider = new snapshotProposalsProvider_1.SnapshotProposalsProvider();
        const verifiedPayload = yield snapshotProposalsProvider.verify({
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
        const snapshotProposalsProvider = new snapshotProposalsProvider_1.SnapshotProposalsProvider();
        const verifiedPayload = yield snapshotProposalsProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.post).toHaveBeenCalledTimes(1);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=snapshotProposalsProvider.test.js.map