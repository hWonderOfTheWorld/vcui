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
const nft_1 = require("../nft");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";
const MOCK_ADDRESS_LOWER = MOCK_ADDRESS.toLocaleLowerCase();
beforeEach(() => {
    jest.clearAllMocks();
});
describe("Attempt verification", function () {
    it.each([
        [200, 0, false],
        [200, 1, true],
        [200, 200, true],
        [300, 0, false],
        [400, 1, false],
        [500, 200, false],
    ])(" - when status is %p and totalCount is %p valid es expected to be %p", (httpStatus, totalCount, expectedValid) => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation((url) => {
            return Promise.resolve({
                status: httpStatus,
                data: {
                    totalCount: totalCount,
                    ownedNfts: [],
                },
            });
        });
        const nftProvider = new nft_1.NFTProvider();
        const nftPayload = yield nftProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(nft_1.alchemyGetNFTsUrl, {
            params: {
                withMetadata: "false",
                owner: MOCK_ADDRESS_LOWER,
            },
        });
        if (expectedValid) {
            expect(nftPayload).toEqual({
                valid: true,
                record: {
                    address: MOCK_ADDRESS_LOWER,
                    numTotalNFTs: totalCount.toString(),
                },
            });
        }
        else {
            expect(nftPayload).toEqual({
                valid: false,
            });
        }
    }));
    it("should return invalid payload when unable to get NFTs (exception thrown)", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            throw "some kind of error";
        }));
        const nftProvider = new nft_1.NFTProvider();
        const nftPayload = yield nftProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(nftPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=nft.test.js.map