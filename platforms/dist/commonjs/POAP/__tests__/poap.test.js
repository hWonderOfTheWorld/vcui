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
const poap_1 = require("../Providers/poap");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";
const MOCK_ADDRESS_LOWER = MOCK_ADDRESS.toLocaleLowerCase();
const now = Math.floor(Date.now() / 1000);
const secondsInADay = 3600 * 24;
const daysAgo5 = now - 5 * secondsInADay;
const daysAgo10 = now - 10 * secondsInADay;
const daysAgo14 = now - 14 * secondsInADay;
const daysAgo16 = now - 16 * secondsInADay;
const validPoapResponse = {
    data: {
        data: {
            account: {
                tokens: [
                    {
                        id: "1",
                        created: daysAgo16,
                    },
                    {
                        id: "2",
                        created: daysAgo14,
                    },
                    {
                        id: "3",
                        created: daysAgo10,
                    },
                    {
                        id: "4",
                        created: daysAgo5,
                    },
                ],
            },
        },
    },
};
const invalidPoapResponse = {
    data: {
        data: {
            account: {
                tokens: [
                    {
                        id: "1",
                        created: daysAgo14,
                    },
                    {
                        id: "2",
                        created: daysAgo10,
                    },
                    {
                        id: "3",
                        created: daysAgo5,
                    },
                ],
            },
        },
    },
};
const emptyPoapResponse = {
    data: {
        data: {
            account: {},
        },
    },
};
describe("Attempt verification", function () {
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        const expectedSubgraphsToCheck = [];
        for (let i = 0; i < poap_1.poapSubgraphs.length; i++) {
            const subgraphUrl = poap_1.poapSubgraphs[i];
            expectedSubgraphsToCheck.push(subgraphUrl);
            jest.clearAllMocks();
            mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
                const query = data.query;
                if (url === subgraphUrl && query.includes(MOCK_ADDRESS_LOWER)) {
                    return validPoapResponse;
                }
            }));
            const poap = new poap_1.POAPProvider();
            const verifiedPayload = yield poap.verify({
                address: MOCK_ADDRESS,
            });
            expect(mockedAxios.post.mock.calls.length).toEqual(expectedSubgraphsToCheck.length);
            for (let j = 0; j < expectedSubgraphsToCheck.length; j++) {
                expect(mockedAxios.post.mock.calls[i][0]).toEqual(expectedSubgraphsToCheck[i]);
            }
            expect(verifiedPayload).toEqual({
                valid: true,
                record: {
                    address: MOCK_ADDRESS_LOWER,
                },
            });
        }
    }));
    it("should return false if user does not have a POAP within the expected time range", () => __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < poap_1.poapSubgraphs.length; i++) {
            const subgraphUrl = poap_1.poapSubgraphs[i];
            jest.clearAllMocks();
            mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
                const query = data.query;
                if (url === subgraphUrl && query.includes(MOCK_ADDRESS)) {
                    return invalidPoapResponse;
                }
            }));
            const poap = new poap_1.POAPProvider();
            const verifiedPayload = yield poap.verify({
                address: MOCK_ADDRESS,
            });
            expect(mockedAxios.post.mock.calls.length).toEqual(poap_1.poapSubgraphs.length);
            for (let j = 0; j < poap_1.poapSubgraphs.length; j++) {
                expect(mockedAxios.post.mock.calls[i][0]).toEqual(poap_1.poapSubgraphs[i]);
            }
            expect(verifiedPayload).toEqual({
                valid: false,
                record: {},
            });
        }
    }));
    it("should return false if user does not have any POAP", () => __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < poap_1.poapSubgraphs.length; i++) {
            const subgraphUrl = poap_1.poapSubgraphs[i];
            jest.clearAllMocks();
            mockedAxios.post.mockImplementation((url, data) => __awaiter(this, void 0, void 0, function* () {
                const query = data.query;
                if (url === subgraphUrl && query.includes(MOCK_ADDRESS_LOWER)) {
                    return emptyPoapResponse;
                }
            }));
            const poap = new poap_1.POAPProvider();
            const verifiedPayload = yield poap.verify({
                address: MOCK_ADDRESS,
            });
            expect(mockedAxios.post.mock.calls.length).toEqual(poap_1.poapSubgraphs.length);
            for (let j = 0; j < poap_1.poapSubgraphs.length; j++) {
                expect(mockedAxios.post.mock.calls[i][0]).toEqual(poap_1.poapSubgraphs[i]);
            }
            expect(verifiedPayload).toEqual({
                valid: false,
                record: {},
            });
        }
    }));
});
//# sourceMappingURL=poap.test.js.map