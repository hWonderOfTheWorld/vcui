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
exports.EthErc20PossessionProvider = exports.getEthBalance = exports.getTokenBalance = exports.RPC_URL = void 0;
const ethers_1 = require("ethers");
const units_1 = require("@ethersproject/units");
const providers_1 = require("@ethersproject/providers");
const ERC20_ABI = [
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];
exports.RPC_URL = process.env.RPC_URL;
function getTokenBalance(address, tokenContractAddress, decimalNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new providers_1.StaticJsonRpcProvider(exports.RPC_URL);
        const readContract = new ethers_1.Contract(tokenContractAddress, ERC20_ABI, provider);
        const tokenBalance = yield (readContract === null || readContract === void 0 ? void 0 : readContract.balanceOf(address));
        const balanceFormatted = (0, units_1.formatUnits)(tokenBalance, decimalNumber);
        return parseFloat(balanceFormatted);
    });
}
exports.getTokenBalance = getTokenBalance;
function getEthBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new providers_1.StaticJsonRpcProvider(exports.RPC_URL);
        const ethBalance = yield (provider === null || provider === void 0 ? void 0 : provider.getBalance(address));
        const balanceFormatted = (0, units_1.formatUnits)(ethBalance, 18);
        return parseFloat(balanceFormatted);
    });
}
exports.getEthBalance = getEthBalance;
class EthErc20PossessionProvider {
    constructor(options = {}) {
        this.type = "";
        this._options = {
            threshold: 1,
            recordAttribute: "",
            contractAddress: "",
            decimalNumber: 18,
            error: "Coin Possession Provider Error",
        };
        this._options = Object.assign(Object.assign({}, this._options), options);
        this.type = `${this._options.recordAttribute}#${this._options.threshold}`;
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address } = payload;
            let valid = false;
            let amount = 0;
            try {
                if (this._options.contractAddress.length > 0) {
                    amount = yield getTokenBalance(address, this._options.contractAddress, this._options.decimalNumber);
                }
                else {
                    amount = yield getEthBalance(address);
                }
            }
            catch (e) {
                return {
                    valid: false,
                    error: [this._options.error],
                };
            }
            finally {
                valid = amount >= this._options.threshold;
            }
            return {
                valid,
                record: valid
                    ? {
                        address,
                        [this._options.recordAttribute]: `${this._options.threshold}`,
                    }
                    : {},
            };
        });
    }
}
exports.EthErc20PossessionProvider = EthErc20PossessionProvider;
//# sourceMappingURL=ethErc20Possession.js.map