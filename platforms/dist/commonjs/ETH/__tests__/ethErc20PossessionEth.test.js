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
Object.defineProperty(exports, "__esModule", { value: true });
const ethErc20Possession_1 = require("../Providers/ethErc20Possession");
const units_1 = require("@ethersproject/units");
jest.mock("@ethersproject/units", () => ({
    formatUnits: jest.fn(),
}));
const mockGetBalance = jest.fn();
jest.mock("@ethersproject/providers", () => {
    return {
        StaticJsonRpcProvider: jest.fn().mockImplementation(() => {
            return {
                getBalance: mockGetBalance,
            };
        }),
    };
});
const MOCK_ADDRESS = "0x738488886dd94725864ae38252a90be1ab7609c7";
const MOCK_ADDRESS_LOWER = MOCK_ADDRESS.toLowerCase();
const MOCK_FAKE_ADDRESS = "FAKE_ADDRESS";
const MOCK_BALANCE = "200000000000000000000";
describe("Attempt verification", function () {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetBalance.mockResolvedValue(MOCK_BALANCE);
        units_1.formatUnits.mockImplementation((num, power) => {
            return parseFloat(num) / Math.pow(10, power);
        });
    });
    it("should return valid response", () => __awaiter(this, void 0, void 0, function* () {
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 1,
            recordAttribute: "ethPossessionsGte",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockGetBalance).toBeCalledWith(MOCK_ADDRESS_LOWER);
        expect(units_1.formatUnits).toBeCalledWith(MOCK_BALANCE, 18);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                ethPossessionsGte: "1",
            },
        });
    }));
    it("should return false for an improper address", () => __awaiter(this, void 0, void 0, function* () {
        mockGetBalance.mockImplementationOnce((address) => {
            if (address === MOCK_ADDRESS_LOWER)
                return MOCK_BALANCE;
        });
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 1,
            recordAttribute: "ethPossessionsGte",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_FAKE_ADDRESS,
        });
        expect(mockGetBalance).toBeCalledWith(MOCK_FAKE_ADDRESS);
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {},
        });
    }));
    it("should return error response when getBalance call throws an error", () => __awaiter(this, void 0, void 0, function* () {
        mockGetBalance.mockRejectedValueOnce(new Error("some error"));
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 1,
            recordAttribute: "ethPossessionsGte",
            error: "ETH Possessions >= 1 Provider verify Error",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockGetBalance).toBeCalledWith(MOCK_ADDRESS_LOWER);
        expect(verifiedPayload).toEqual({
            valid: false,
            error: ["ETH Possessions >= 1 Provider verify Error"],
        });
    }));
});
describe("Check valid cases for ETH Balances", function () {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetBalance.mockResolvedValue(MOCK_BALANCE);
        units_1.formatUnits.mockImplementation((num, power) => {
            return parseFloat(num) / Math.pow(10, power);
        });
    });
    it("Expected Greater than 1 ETH and ETH Balance is 5", () => __awaiter(this, void 0, void 0, function* () {
        mockGetBalance.mockResolvedValueOnce("5000000000000000000");
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 1,
            recordAttribute: "ethPossessionsGte",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                ethPossessionsGte: "1",
            },
        });
    }));
    it("Expected Greater than 10 ETH and ETH Balance is 15", () => __awaiter(this, void 0, void 0, function* () {
        mockGetBalance.mockResolvedValueOnce("15000000000000000000");
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 10,
            recordAttribute: "ethPossessionsGte",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                ethPossessionsGte: "10",
            },
        });
    }));
    it("Expected Greater than 32 ETH and ETH Balance is 70", () => __awaiter(this, void 0, void 0, function* () {
        mockGetBalance.mockResolvedValueOnce("70000000000000000000");
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 32,
            recordAttribute: "ethPossessionsGte",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                ethPossessionsGte: "32",
            },
        });
    }));
});
describe("Check invalid cases for ETH Balances", function () {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetBalance.mockResolvedValue(MOCK_BALANCE);
        units_1.formatUnits.mockImplementation((num, power) => {
            return parseFloat(num) / Math.pow(10, power);
        });
    });
    it("Expected Greater than 1 ETH and ETH Balance is 0.5", () => __awaiter(this, void 0, void 0, function* () {
        mockGetBalance.mockResolvedValueOnce("500000000000000000");
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 1,
            recordAttribute: "ethPossessionsGte",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_ADDRESS,
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {},
        });
    }));
    it("Expected Greater than 10 ETH and ETH Balance is 5", () => __awaiter(this, void 0, void 0, function* () {
        mockGetBalance.mockResolvedValueOnce("5000000000000000000");
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 10,
            recordAttribute: "ethPossessionsGte",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_ADDRESS,
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {},
        });
    }));
    it("Expected Greater than 32 ETH and ETH Balance is 20", () => __awaiter(this, void 0, void 0, function* () {
        mockGetBalance.mockResolvedValueOnce("2000000000000000000");
        const ethPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 32,
            recordAttribute: "ethPossessionsGte",
        });
        const verifiedPayload = yield ethPossessions.verify({
            address: MOCK_ADDRESS,
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {},
        });
    }));
});
//# sourceMappingURL=ethErc20PossessionEth.test.js.map