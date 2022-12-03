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
exports.ZkSyncProvider = exports.zkSyncApiEnpoint = void 0;
const axios_1 = __importDefault(require("axios"));
const signer_1 = require("../../utils/signer");
exports.zkSyncApiEnpoint = "https://api.zksync.io/api/v0.2/";
class ZkSyncProvider {
    constructor(options = {}) {
        this.type = "ZkSync";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            let error = undefined;
            const address = (yield (0, signer_1.getAddress)(payload)).toLowerCase();
            try {
                const requestResponse = yield axios_1.default.get(`${exports.zkSyncApiEnpoint}accounts/${address}/transactions`, {
                    params: {
                        from: "latest",
                        limit: 100,
                        direction: "older",
                    },
                });
                if (requestResponse.status == 200) {
                    const zkSyncResponse = requestResponse.data;
                    if (zkSyncResponse.status === "success") {
                        for (let i = 0; i < zkSyncResponse.result.list.length; i++) {
                            const t = zkSyncResponse.result.list[i];
                            if (t.status === "finalized") {
                                if (t.op.from === address) {
                                    valid = true;
                                    break;
                                }
                            }
                        }
                        if (!valid) {
                            error = ["Unable to find a finalized transaction from the given address"];
                        }
                    }
                    else {
                        error = [`ZKSync API Error '${zkSyncResponse.status}'. Details: '${zkSyncResponse.error.toString()}'.`];
                    }
                }
                else {
                    error = [`HTTP Error '${requestResponse.status}'. Details: '${requestResponse.statusText}'.`];
                }
            }
            catch (exc) {
                error = ["Error getting transaction list for address"];
            }
            return Promise.resolve({
                valid: valid,
                record: valid
                    ? {
                        address: address,
                    }
                    : undefined,
                error,
            });
        });
    }
}
exports.ZkSyncProvider = ZkSyncProvider;
//# sourceMappingURL=zkSync.js.map