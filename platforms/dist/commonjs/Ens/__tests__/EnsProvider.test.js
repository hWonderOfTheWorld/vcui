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
const EnsProvider_1 = require("../Providers/EnsProvider");
const providers_1 = require("@ethersproject/providers");
const jest_mock_extended_1 = require("jest-mock-extended");
jest.mock("@ethersproject/providers");
const MOCK_ADDRESS = "0x6Cc41e662668C733c029d3c70E9CF248359ce544";
const MOCK_ENS = "dpopptest.eth";
const mockSigner = (0, jest_mock_extended_1.mock)(providers_1.JsonRpcSigner);
const EthersLookupAddressMock = jest.spyOn(providers_1.StaticJsonRpcProvider.prototype, "lookupAddress");
const EthersResolveAddressMock = jest.spyOn(providers_1.StaticJsonRpcProvider.prototype, "resolveName");
describe("Attempt verification", function () {
    beforeEach(() => {
        jest.clearAllMocks();
        EthersLookupAddressMock.mockImplementation((address) => __awaiter(this, void 0, void 0, function* () {
            if (address === MOCK_ADDRESS)
                return MOCK_ENS;
        }));
        EthersResolveAddressMock.mockImplementation((ens) => __awaiter(this, void 0, void 0, function* () {
            if (ens === MOCK_ENS)
                return MOCK_ADDRESS;
        }));
        mockSigner.getAddress = jest.fn(() => __awaiter(this, void 0, void 0, function* () { return MOCK_ADDRESS; }));
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        const ens = new EnsProvider_1.EnsProvider();
        const verifiedPayload = yield ens.verify({
            address: MOCK_ADDRESS,
        });
        expect(EthersLookupAddressMock).toBeCalledWith(MOCK_ADDRESS);
        expect(EthersResolveAddressMock).toBeCalledWith(MOCK_ENS);
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                ens: MOCK_ENS,
            },
        });
    }));
    it("should return false for invalid address", () => __awaiter(this, void 0, void 0, function* () {
        EthersLookupAddressMock.mockRejectedValueOnce("Invalid Address");
        const ens = new EnsProvider_1.EnsProvider();
        const MOCK_FAKE_ADDRESS = "FAKE_ADDRESS";
        const verifiedPayload = yield ens.verify({
            address: MOCK_FAKE_ADDRESS,
        });
        expect(EthersLookupAddressMock).toBeCalledWith(MOCK_FAKE_ADDRESS);
        expect(verifiedPayload).toEqual({
            valid: false,
        });
    }));
    it("should return false for an address without a valid ens name", () => __awaiter(this, void 0, void 0, function* () {
        const ens = new EnsProvider_1.EnsProvider();
        const MOCK_FAKE_ADDRESS = "0xd9FA0c2bF77750EE0C154875d1b6f06aa494668a";
        const verifiedPayload = yield ens.verify({
            address: MOCK_FAKE_ADDRESS,
        });
        expect(EthersLookupAddressMock).toBeCalledWith(MOCK_FAKE_ADDRESS);
        expect(verifiedPayload).toEqual({ valid: false, error: ["Ens name was not found for given address."] });
    }));
});
//# sourceMappingURL=EnsProvider.test.js.map