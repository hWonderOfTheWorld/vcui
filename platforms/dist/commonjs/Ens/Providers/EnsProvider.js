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
exports.EnsProvider = void 0;
const providers_1 = require("@ethersproject/providers");
const ethers_1 = require("ethers");
const signer_1 = require("../../utils/signer");
class EnsProvider {
    constructor(options = {}) {
        this.type = "Ens";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = (0, signer_1.getRPCProvider)(payload);
                const staticProvider = new providers_1.StaticJsonRpcProvider(payload.rpcUrl);
                const reportedName = yield staticProvider.lookupAddress(payload.address);
                if (!reportedName)
                    return { valid: false, error: ["Ens name was not found for given address."] };
                const resolvedAddress = yield provider.resolveName(reportedName);
                const valid = ethers_1.utils.getAddress(payload.address) === ethers_1.utils.getAddress(resolvedAddress);
                return {
                    valid: valid,
                    record: {
                        ens: valid ? reportedName : undefined,
                    },
                };
            }
            catch (e) {
                return {
                    valid: false,
                };
            }
        });
    }
}
exports.EnsProvider = EnsProvider;
//# sourceMappingURL=EnsProvider.js.map