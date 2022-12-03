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
exports.LensProfileProvider = void 0;
const ethers_1 = require("ethers");
const providers_1 = require("@ethersproject/providers");
const LENS_HUB_PROXY_CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
const LENS_HUB_PROXY_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "wallet",
                type: "address",
            },
        ],
        name: "defaultProfile",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "profileId",
                type: "uint256",
            },
        ],
        name: "getHandle",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];
function getNumberOfHandles(userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new providers_1.StaticJsonRpcProvider(process.env.POLYGON_RPC_URL);
        const contract = new ethers_1.Contract(LENS_HUB_PROXY_CONTRACT_ADDRESS, LENS_HUB_PROXY_ABI, provider);
        const numberOfHandles = yield contract.balanceOf(userAddress);
        return (numberOfHandles === null || numberOfHandles === void 0 ? void 0 : numberOfHandles._isBigNumber) ? parseInt(numberOfHandles === null || numberOfHandles === void 0 ? void 0 : numberOfHandles._hex, 16) : 0;
    });
}
class LensProfileProvider {
    constructor(options = {}) {
        this.type = "Lens";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = payload.address.toString().toLowerCase();
            let valid = false;
            let numberOfHandles;
            try {
                numberOfHandles = yield getNumberOfHandles(address);
            }
            catch (e) {
                return {
                    valid: false,
                    error: ["Lens provider get user handle error"],
                };
            }
            valid = numberOfHandles >= 1;
            return Promise.resolve({
                valid: valid,
                record: valid
                    ? {
                        address: address,
                        numberOfHandles: numberOfHandles.toString(),
                    }
                    : {},
            });
        });
    }
}
exports.LensProfileProvider = LensProfileProvider;
//# sourceMappingURL=lens.js.map