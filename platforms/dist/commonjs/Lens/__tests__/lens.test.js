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
const lens_1 = require("../Providers/lens");
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
const MOCK_FAKE_ADDRESS = "fake_address";
const MOCK_BIG_NUMBER_TWO = { _hex: "0x02", _isBigNumber: true };
const MOCK_BIG_NUMBER_ONE = { _hex: "0x01", _isBigNumber: true };
const MOCK_BIG_NUMBER_ZERO = { _hex: "0x00", _isBigNumber: true };
describe("Attempt verification", function () {
    beforeEach(() => {
        jest.clearAllMocks();
        mockBalanceOf.mockResolvedValue(MOCK_BIG_NUMBER_TWO);
    });
    it("should return true for an address with more than one lens handle", () => __awaiter(this, void 0, void 0, function* () {
        const lens = new lens_1.LensProfileProvider();
        const verifiedPayload = yield lens.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockBalanceOf).toBeCalledWith(MOCK_ADDRESS_LOWER);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                numberOfHandles: "2",
            },
        });
    }));
    it("should return false for an improper address", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockRejectedValueOnce(MOCK_FAKE_ADDRESS);
        const lens = new lens_1.LensProfileProvider();
        const verifiedPayload = yield lens.verify({
            address: MOCK_FAKE_ADDRESS,
        });
        expect(mockBalanceOf).toBeCalledWith(MOCK_FAKE_ADDRESS);
        expect(verifiedPayload).toEqual({
            valid: false,
            error: ["Lens provider get user handle error"],
        });
    }));
    it("should return an error response when balanceOf throws an error", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockRejectedValueOnce(new Error("some error"));
        const lens = new lens_1.LensProfileProvider();
        const verifiedPayload = yield lens.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockBalanceOf).toBeCalledWith(MOCK_ADDRESS_LOWER);
        expect(verifiedPayload).toEqual({
            valid: false,
            error: ["Lens provider get user handle error"],
        });
    }));
    it("should return true for an address with one lens handle", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockResolvedValueOnce(MOCK_BIG_NUMBER_ONE);
        const lens = new lens_1.LensProfileProvider();
        const verifiedPayload = yield lens.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockBalanceOf).toBeCalledWith(MOCK_ADDRESS_LOWER);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                numberOfHandles: "1",
            },
        });
    }));
    it("should return false for an address that does not have a lens handle", () => __awaiter(this, void 0, void 0, function* () {
        mockBalanceOf.mockResolvedValueOnce(MOCK_BIG_NUMBER_ZERO);
        const lens = new lens_1.LensProfileProvider();
        const verifiedPayload = yield lens.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockBalanceOf).toBeCalledWith(MOCK_ADDRESS_LOWER);
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {},
        });
    }));
});
//# sourceMappingURL=lens.test.js.map