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
exports.NFTProvider = exports.alchemyGetNFTsUrl = exports.apiKey = void 0;
const axios_1 = __importDefault(require("axios"));
const signer_1 = require("../../utils/signer");
exports.apiKey = process.env.ALCHEMY_API_KEY;
exports.alchemyGetNFTsUrl = `https://eth-mainnet.g.alchemy.com/nft/v2/${exports.apiKey}/getNFTs`;
class NFTProvider {
    constructor(options = {}) {
        this.type = "NFT";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (yield (0, signer_1.getAddress)(payload)).toLowerCase();
            let valid = false;
            let nftsResponse = {
                ownedNfts: [],
                totalCount: 0,
            };
            try {
                const requestResponse = yield axios_1.default.get(exports.alchemyGetNFTsUrl, {
                    params: {
                        withMetadata: "false",
                        owner: address,
                    },
                });
                if (requestResponse.status == 200) {
                    nftsResponse = requestResponse.data;
                    valid = nftsResponse.totalCount > 0;
                }
            }
            catch (error) {
            }
            return Promise.resolve({
                valid: valid,
                record: valid
                    ? {
                        address: address,
                        numTotalNFTs: nftsResponse.totalCount.toString(),
                    }
                    : undefined,
            });
        });
    }
}
exports.NFTProvider = NFTProvider;
//# sourceMappingURL=nft.js.map