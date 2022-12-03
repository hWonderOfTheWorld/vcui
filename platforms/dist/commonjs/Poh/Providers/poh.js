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
exports.PohProvider = exports.RPC_URL = void 0;
const ethers_1 = require("ethers");
const providers_1 = require("@ethersproject/providers");
const signer_1 = require("../../utils/signer");
const POH_CONTRACT_ADDRESS = "0xC5E9dDebb09Cd64DfaCab4011A0D5cEDaf7c9BDb";
const POH_ABI = [
    {
        constant: true,
        inputs: [{ internalType: "address", name: "_submissionID", type: "address" }],
        name: "isRegistered",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];
exports.RPC_URL = process.env.RPC_URL;
class PohProvider {
    constructor(options = {}) {
        this.type = "Poh";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield (0, signer_1.getAddress)(payload);
            try {
                const provider = new providers_1.StaticJsonRpcProvider(exports.RPC_URL);
                const readContract = new ethers_1.Contract(POH_CONTRACT_ADDRESS, POH_ABI, provider);
                const valid = yield readContract.isRegistered(address);
                return {
                    valid,
                    record: valid
                        ? {
                            address,
                        }
                        : undefined,
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: [JSON.stringify(e)],
                };
            }
        });
    }
}
exports.PohProvider = PohProvider;
//# sourceMappingURL=poh.js.map