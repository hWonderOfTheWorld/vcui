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
const poh_1 = require("../Providers/poh");
const mockIsRegistered = jest.fn();
jest.mock("ethers", () => {
    return {
        Contract: jest.fn().mockImplementation(() => {
            return {
                isRegistered: mockIsRegistered,
            };
        }),
    };
});
const MOCK_ADDRESS = "0x738488886dd94725864ae38252a90be1ab7609c7";
describe("Attempt verification", function () {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should return true for an address registered with proof of humanity", () => __awaiter(this, void 0, void 0, function* () {
        mockIsRegistered.mockResolvedValueOnce(true);
        const poh = new poh_1.PohProvider();
        const verifiedPayload = yield poh.verify({
            address: MOCK_ADDRESS,
        });
        expect(mockIsRegistered).toBeCalledWith(MOCK_ADDRESS);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS,
            },
        });
    }));
    it("should return false for an address not registered with proof of humanity", () => __awaiter(this, void 0, void 0, function* () {
        mockIsRegistered.mockResolvedValueOnce(false);
        const UNREGISTERED_ADDRESS = "0xUNREGISTERED";
        const poh = new poh_1.PohProvider();
        const verifiedPayload = yield poh.verify({
            address: UNREGISTERED_ADDRESS,
        });
        expect(mockIsRegistered).toBeCalledWith(UNREGISTERED_ADDRESS);
        expect(verifiedPayload).toEqual({
            valid: false,
        });
    }));
    it("should return error response when isRegistered call errors", () => __awaiter(this, void 0, void 0, function* () {
        mockIsRegistered.mockRejectedValueOnce("some error");
        const UNREGISTERED_ADDRESS = "0xUNREGISTERED";
        const poh = new poh_1.PohProvider();
        const verifiedPayload = yield poh.verify({
            address: UNREGISTERED_ADDRESS,
        });
        expect(mockIsRegistered).toBeCalledWith(UNREGISTERED_ADDRESS);
        expect(verifiedPayload).toEqual({
            valid: false,
            error: [JSON.stringify("some error")],
        });
    }));
});
//# sourceMappingURL=poh.test.js.map