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
const ethErc20Possession_1 = require("../../ETH/Providers/ethErc20Possession");
const units_1 = require("@ethersproject/units");
jest.mock("@ethersproject/units", () => ({
    formatUnits: jest.fn(),
}));
const mockBalanceOf = jest.fn();
jest.mock("ethers", () => {
    return {
        Contract: jest.fn().mockImplementation(() => {
            return {
                balanceOf: mockBalanceOf,
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
        mockBalanceOf.mockResolvedValue(MOCK_BALANCE);
        units_1.formatUnits.mockImplementation((num, power) => {
            return parseFloat(num) / Math.pow(10, power);
        });
    });
    it("should return valid response", () => __awaiter(this, void 0, void 0, function* () {
        const gtcPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 100,
            recordAttribute: "gtcPossessionsGte",
            contractAddress: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
        });
        const verifiedPayload = yield gtcPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockBalanceOf).toBeCalledWith(MOCK_ADDRESS_LOWER);
        expect(units_1.formatUnits).toBeCalledWith(MOCK_BALANCE, 18);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                gtcPossessionsGte: "100",
            },
        });
    }));
    it("should return false for an improper address", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockRejectedValueOnce("0");
        const gtcPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 100,
            recordAttribute: "gtcPossessionsGte",
            contractAddress: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
            error: "GTC Possessions >= 100 Provider verify Error",
        });
        const verifiedPayload = yield gtcPossessions.verify({
            address: MOCK_FAKE_ADDRESS,
        });
        expect(mockBalanceOf).toBeCalledWith(MOCK_FAKE_ADDRESS);
        expect(verifiedPayload).toEqual({
            valid: false,
            error: ["GTC Possessions >= 100 Provider verify Error"],
        });
    }));
    it("should return error response when balanceOf call throws an error", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockRejectedValueOnce(new Error("some error"));
        const gtcPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 100,
            recordAttribute: "gtcPossessionsGte",
            contractAddress: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
            error: "GTC Possessions >= 100 Provider verify Error",
        });
        const verifiedPayload = yield gtcPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockBalanceOf).toBeCalledWith(MOCK_ADDRESS_LOWER);
        expect(verifiedPayload).toEqual({
            valid: false,
            error: ["GTC Possessions >= 100 Provider verify Error"],
        });
    }));
});
describe("Check valid cases for GTC Balances", function () {
    beforeEach(() => {
        jest.clearAllMocks();
        mockBalanceOf.mockResolvedValue(MOCK_BALANCE);
        units_1.formatUnits.mockImplementation((num, power) => {
            return parseFloat(num) / Math.pow(10, power);
        });
    });
    it("Expected Greater than 10 GTC and GTC Balance is 15", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockResolvedValueOnce("15000000000000000000");
        const gtcPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 10,
            recordAttribute: "gtcPossessionsGte",
            contractAddress: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
        });
        const verifiedPayload = yield gtcPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                gtcPossessionsGte: "10",
            },
        });
    }));
    it("Expected Greater than 100 GTC and GTC Balance is 150", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockResolvedValueOnce("150000000000000000000");
        const gtcPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 100,
            recordAttribute: "gtcPossessionsGte",
            contractAddress: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
        });
        const verifiedPayload = yield gtcPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                gtcPossessionsGte: "100",
            },
        });
    }));
});
describe("Check invalid cases for GTC Balances", function () {
    beforeEach(() => {
        jest.clearAllMocks();
        mockBalanceOf.mockResolvedValue(MOCK_BALANCE);
        units_1.formatUnits.mockImplementation((num, power) => {
            return parseFloat(num) / Math.pow(10, power);
        });
    });
    it("Expected Greater than 10 GTC and GTC Balance is 7", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockResolvedValueOnce("7000000000000000000");
        const gtcPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 10,
            recordAttribute: "gtcPossessionsGte",
            contractAddress: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
        });
        const verifiedPayload = yield gtcPossessions.verify({
            address: MOCK_ADDRESS,
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {},
        });
    }));
    it("Expected Greater than 100 GTC and GTC Balance is 75", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockResolvedValueOnce("75000000000000000000");
        const gtcPossessions = new ethErc20Possession_1.EthErc20PossessionProvider({
            threshold: 100,
            recordAttribute: "gtcPossessionsGte",
            contractAddress: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
        });
        const verifiedPayload = yield gtcPossessions.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {},
        });
    }));
});
//# sourceMappingURL=ethErc20PossessionGtc.test.js.map