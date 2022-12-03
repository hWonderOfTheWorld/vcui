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
exports.GnosisSafeProvider = exports.gnosisSafeApiEndpoint = void 0;
const axios_1 = __importDefault(require("axios"));
const signer_1 = require("../../utils/signer");
exports.gnosisSafeApiEndpoint = "https://safe-transaction.gnosis.io/api/v1/";
class GnosisSafeProvider {
    constructor(options = {}) {
        this.type = "GnosisSafe";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            const error = [];
            const address = yield (0, signer_1.getAddress)(payload);
            try {
                const ownerSafes = yield getSafes(address);
                valid = !!ownerSafes.safes && ownerSafes.safes.length >= 1;
            }
            catch (exc) {
                error.push(exc.toString());
            }
            if (!valid && error.length === 0) {
                error.push("Unable to find any safes owned by the given address");
            }
            return Promise.resolve({
                valid: valid,
                record: valid
                    ? {
                        address: address,
                    }
                    : undefined,
                error: error.length ? error : undefined,
            });
        });
    }
}
exports.GnosisSafeProvider = GnosisSafeProvider;
const getSafes = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const requestResponse = yield axios_1.default.get(`${exports.gnosisSafeApiEndpoint}owners/${address}/safes`);
    if (requestResponse.status != 200) {
        throw [`HTTP Error '${requestResponse.status}'. Details: '${requestResponse.statusText}'.`];
    }
    return requestResponse.data;
});
//# sourceMappingURL=gnosisSafe.js.map