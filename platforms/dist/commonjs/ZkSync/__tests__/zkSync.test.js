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
const zkSync_1 = require("../Providers/zkSync");
jest.mock("axios");
const mockedAxios = axios_1.default;
const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";
const MOCK_ADDRESS_LOWER = MOCK_ADDRESS.toLocaleLowerCase();
const BAD_ADDRESS = "0xsieh2863426gsaa";
const validResponseList = [
    {
        txHash: "0xsome_hash",
        op: {
            from: MOCK_ADDRESS_LOWER,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: MOCK_ADDRESS_LOWER,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: MOCK_ADDRESS_LOWER,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: MOCK_ADDRESS_LOWER,
        },
        status: "finalized",
    },
];
const inValidResponseListAddressNotInFromField = [
    {
        txHash: "0xsome_hash",
        op: {
            from: BAD_ADDRESS,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: BAD_ADDRESS,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: BAD_ADDRESS,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: BAD_ADDRESS,
        },
        status: "finalized",
    },
];
const inValidResponseListNoFinalizedTranzaction = [
    {
        txHash: "0xsome_hash",
        op: {
            from: MOCK_ADDRESS_LOWER,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: MOCK_ADDRESS_LOWER,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: MOCK_ADDRESS_LOWER,
        },
        status: "pending",
    },
    {
        txHash: "0xsome_hash",
        op: {
            from: MOCK_ADDRESS_LOWER,
        },
        status: "pending",
    },
];
beforeEach(() => {
    jest.clearAllMocks();
});
describe("Verification succeeds", function () {
    it("when valid response is received from the zksync API endpoint", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: {
                    result: { list: validResponseList },
                    status: "success",
                },
            });
        });
        const zkSyncProvider = new zkSync_1.ZkSyncProvider();
        const zkSyncPayload = yield zkSyncProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${zkSync_1.zkSyncApiEnpoint}accounts/${MOCK_ADDRESS_LOWER}/transactions`, {
            params: {
                from: "latest",
                limit: 100,
                direction: "older",
            },
        });
        expect(zkSyncPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
            },
        });
    }));
});
describe("Verification fails", function () {
    it("when the response list does not contain any transaction initiated by the address we verify (address is not in from field)", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: {
                    result: { list: inValidResponseListAddressNotInFromField },
                    status: "success",
                },
            });
        });
        const zkSyncProvider = new zkSync_1.ZkSyncProvider();
        const zkSyncPayload = yield zkSyncProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${zkSync_1.zkSyncApiEnpoint}accounts/${MOCK_ADDRESS_LOWER}/transactions`, {
            params: {
                from: "latest",
                limit: 100,
                direction: "older",
            },
        });
        expect(zkSyncPayload).toEqual({
            valid: false,
            error: ["Unable to find a finalized transaction from the given address"],
        });
    }));
    it("when the response list does not contain any finalized tranzactions", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: {
                    result: { list: inValidResponseListNoFinalizedTranzaction },
                    status: "success",
                },
            });
        });
        const zkSyncProvider = new zkSync_1.ZkSyncProvider();
        const zkSyncPayload = yield zkSyncProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${zkSync_1.zkSyncApiEnpoint}accounts/${MOCK_ADDRESS_LOWER}/transactions`, {
            params: {
                from: "latest",
                limit: 100,
                direction: "older",
            },
        });
        expect(zkSyncPayload).toEqual({
            valid: false,
            error: ["Unable to find a finalized transaction from the given address"],
        });
    }));
    it("when the API response is not with status='success'", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: {
                    result: { list: validResponseList },
                    status: "error",
                    error: "some kind of error",
                },
            });
        });
        const zkSyncProvider = new zkSync_1.ZkSyncProvider();
        const zkSyncPayload = yield zkSyncProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${zkSync_1.zkSyncApiEnpoint}accounts/${MOCK_ADDRESS_LOWER}/transactions`, {
            params: {
                from: "latest",
                limit: 100,
                direction: "older",
            },
        });
        expect(zkSyncPayload).toEqual({
            valid: false,
            error: ["ZKSync API Error 'error'. Details: 'some kind of error'."],
        });
    }));
    it("when the HTTP status code is not 200", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 400,
                statusText: "Bad Request",
                data: {
                    result: { list: validResponseList },
                    status: "success",
                },
            });
        });
        const zkSyncProvider = new zkSync_1.ZkSyncProvider();
        const zkSyncPayload = yield zkSyncProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${zkSync_1.zkSyncApiEnpoint}accounts/${MOCK_ADDRESS_LOWER}/transactions`, {
            params: {
                from: "latest",
                limit: 100,
                direction: "older",
            },
        });
        expect(zkSyncPayload).toEqual({
            valid: false,
            error: ["HTTP Error '400'. Details: 'Bad Request'."],
        });
    }));
    it("when the HTTP request throws", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            throw "something bad happened";
        });
        const zkSyncProvider = new zkSync_1.ZkSyncProvider();
        const zkSyncPayload = yield zkSyncProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${zkSync_1.zkSyncApiEnpoint}accounts/${MOCK_ADDRESS_LOWER}/transactions`, {
            params: {
                from: "latest",
                limit: 100,
                direction: "older",
            },
        });
        expect(zkSyncPayload).toEqual({
            valid: false,
            error: ["Error getting transaction list for address"],
        });
    }));
});
//# sourceMappingURL=zkSync.test.js.map