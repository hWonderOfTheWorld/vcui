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
const ethTransactions_1 = require("../Providers/ethTransactions");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";
const MOCK_ADDRESS_LOWER = MOCK_ADDRESS.toLocaleLowerCase();
const BAD_MOCK_ADDRESS = "F314CE817E25b4F784bC1f24c9A79A525fEC50f";
const BAD_MOCK_ADDRESS_LOWER = BAD_MOCK_ADDRESS.toLocaleLowerCase();
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const toUnixTime = () => {
    return Math.floor(new Date().getTime() / 1000);
};
const ETH_GAS_OFFSET_COUNT = 500;
const FIRST_ETH_GTE_TXN_OFFSET_COUNT = 100;
const validEtherscanResponse = {
    data: {
        data: {
            result: [
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "100000000",
                    isError: "0",
                    timeStamp: "1495266702",
                },
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "100000000",
                    isError: "0",
                    timeStamp: "1526802702",
                },
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "100000000",
                    isError: "0",
                    timeStamp: "1555266702",
                },
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "100000000",
                    isError: "0",
                    timeStamp: "1595266702",
                },
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "100000000",
                    isError: "0",
                    timeStamp: "1658303502",
                },
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "100000000",
                    isError: "0",
                    timeStamp: "1655711502",
                },
            ],
        },
        status: 200,
    },
};
const invalidEtherscanResponse = {
    data: {
        data: {
            result: [
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "200000000",
                    isError: "1",
                    timeStamp: toUnixTime().toString(),
                },
            ],
        },
        status: 200,
    },
};
const invalidEtherscanResponseNoResults = {
    data: {
        data: {
            result: null,
        },
        status: 200,
    },
};
const invalidEtherscanResponseLTHalfEthGasSpent = {
    data: {
        data: {
            result: [
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "200000000",
                    isError: "0",
                    timeStamp: "1658303502",
                },
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "100000000",
                    isError: "0",
                    timeStamp: "1655711502",
                },
            ],
        },
        status: 200,
    },
};
const invalidEtherscanResponseNoSuccessfulTxns = {
    data: {
        data: {
            result: [
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "200000000",
                    isError: "1",
                    timeStamp: toUnixTime().toString(),
                },
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "200000000",
                    isError: "1",
                    timeStamp: (toUnixTime() + 3000000).toString(),
                },
                {
                    from: `${MOCK_ADDRESS_LOWER}`,
                    gasUsed: "200000000",
                    isError: "1",
                    timeStamp: toUnixTime().toString(),
                },
            ],
        },
        status: 200,
    },
};
const invalidRequest = {
    data: {
        error: {
            response: {
                message: "Bad request",
            },
        },
        status: 500,
    },
};
describe("Attempt verification for ETH gas provider stamp", function () {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(validEtherscanResponse.data);
            }
        }));
        const ethGasProvider = new ethTransactions_1.EthGasProvider();
        const verifiedPayload = yield ethGasProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${ETH_GAS_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: `${MOCK_ADDRESS_LOWER}`,
                hasGTEHalfEthSpentGasSpentOnTheMainnet: "true",
            },
        });
    }));
    it("should return invalid payload if the user has accumulated less than 0.5 ETH in gas fees", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(invalidEtherscanResponseLTHalfEthGasSpent.data);
            }
        }));
        const ethGasProvider = new ethTransactions_1.EthGasProvider();
        const verifiedPayload = yield ethGasProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${ETH_GAS_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when the user has no ethereum transactions (empty result array)", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(invalidEtherscanResponseNoResults.data);
            }
        }));
        const ethGasProvider = new ethTransactions_1.EthGasProvider();
        const verifiedPayload = yield ethGasProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${ETH_GAS_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload if there is no address provided to the ETH gas provider verification method", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api")) {
                return Promise.resolve(invalidRequest.data);
            }
        }));
        const ethGasProvider = new ethTransactions_1.EthGasProvider();
        const verifiedPayload = yield ethGasProvider.verify({
            address: "",
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=&page=1&offset=${ETH_GAS_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when an exception is through when a request is made", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(BAD_MOCK_ADDRESS_LOWER)) {
                throw "an error";
            }
        }));
        const ethGasProvider = new ethTransactions_1.EthGasProvider();
        const verifiedPayload = yield ethGasProvider.verify({
            address: BAD_MOCK_ADDRESS_LOWER,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${BAD_MOCK_ADDRESS_LOWER}&page=1&offset=${ETH_GAS_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
});
describe("Attempt verification for gte 30 days since first ETH transaction stamp", function () {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(validEtherscanResponse.data);
            }
        }));
        const firstEthTxnProvider = new ethTransactions_1.FirstEthTxnProvider();
        const verifiedPayload = yield firstEthTxnProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: `${MOCK_ADDRESS_LOWER}`,
                hasGTE30DaysSinceFirstTxnOnTheMainnet: "true",
            },
        });
    }));
    it("should return invalid payload when it's been less than 30 days since the user's first ETH transaction", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(invalidEtherscanResponse.data);
            }
        }));
        const firstEthTxnProvider = new ethTransactions_1.FirstEthTxnProvider();
        const verifiedPayload = yield firstEthTxnProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when the user has no ethereum transactions (empty result array)", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(invalidEtherscanResponseNoResults.data);
            }
        }));
        const firstEthTxnProvider = new ethTransactions_1.FirstEthTxnProvider();
        const verifiedPayload = yield firstEthTxnProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload if there is no address provided to the ETH gas provider verification method", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api")) {
                return Promise.resolve(invalidRequest.data);
            }
        }));
        const firstEthTxnProvider = new ethTransactions_1.FirstEthTxnProvider();
        const verifiedPayload = yield firstEthTxnProvider.verify({
            address: "",
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when an exception is through when a request is made", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(BAD_MOCK_ADDRESS_LOWER)) {
                throw "an error";
            }
        }));
        const firstEthTxnProvider = new ethTransactions_1.FirstEthTxnProvider();
        const verifiedPayload = yield firstEthTxnProvider.verify({
            address: BAD_MOCK_ADDRESS_LOWER,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${BAD_MOCK_ADDRESS_LOWER}&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
});
describe("Attempt verification for at least one ETH transaction on the mainnet stamp", function () {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(validEtherscanResponse.data);
            }
        }));
        const ethGTEOneTxnProvider = new ethTransactions_1.EthGTEOneTxnProvider();
        const verifiedPayload = yield ethGTEOneTxnProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: `${MOCK_ADDRESS_LOWER}`,
                hasGTE1ETHTxnOnTheMainnet: "true",
            },
        });
    }));
    it("should return invalid payload when the user has no successful ethereum transactions", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(invalidEtherscanResponseNoSuccessfulTxns.data);
            }
        }));
        const ethGTEOneTxnProvider = new ethTransactions_1.EthGTEOneTxnProvider();
        const verifiedPayload = yield ethGTEOneTxnProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when the user has no ethereum transactions (empty result array)", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(invalidEtherscanResponseNoResults.data);
            }
        }));
        const ethGTEOneTxnProvider = new ethTransactions_1.EthGTEOneTxnProvider();
        const verifiedPayload = yield ethGTEOneTxnProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${MOCK_ADDRESS_LOWER}&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload if there is no address provided to the ETH gas provider verification method", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(invalidRequest.data);
            }
        }));
        const ethGTEOneTxnProvider = new ethTransactions_1.EthGTEOneTxnProvider();
        const verifiedPayload = yield ethGTEOneTxnProvider.verify({
            address: "",
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when an exception is through when a request is made", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(this, void 0, void 0, function* () {
            if (url.includes("https://api.etherscan.io/api") && url.includes(MOCK_ADDRESS_LOWER)) {
                return Promise.resolve(invalidRequest.data);
            }
        }));
        const ethGTEOneTxnProvider = new ethTransactions_1.EthGTEOneTxnProvider();
        const verifiedPayload = yield ethGTEOneTxnProvider.verify({
            address: BAD_MOCK_ADDRESS_LOWER,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`https://api.etherscan.io/api?module=account&action=txlist&address=${BAD_MOCK_ADDRESS_LOWER}&page=1&offset=${FIRST_ETH_GTE_TXN_OFFSET_COUNT}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
        expect(verifiedPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=ethTransactions.test.js.map