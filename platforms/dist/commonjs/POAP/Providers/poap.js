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
exports.POAPProvider = exports.poapSubgraphs = void 0;
const axios_1 = __importDefault(require("axios"));
const signer_1 = require("../../utils/signer");
exports.poapSubgraphs = [
    "https://api.thegraph.com/subgraphs/name/poap-xyz/poap",
    "https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai",
];
const minTokenAge = 15 * 24 * 3600000;
class POAPProvider {
    constructor(options = {}) {
        this.type = "POAP";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (yield (0, signer_1.getAddress)(payload)).toLowerCase();
            let poapCheckResult = {
                hasPoaps: false,
                poapList: null,
            };
            function checkForPoaps(url) {
                var _a, _b, _c;
                return __awaiter(this, void 0, void 0, function* () {
                    let hasPoaps = false;
                    let poapList = null;
                    const result = yield axios_1.default.post(url, {
                        query: `
          {
            account(id: "${address}") {
              tokens(orderBy: created, orderDirection: asc) {
                id
                created
              }
            }
          }
          `,
                    });
                    const r = result;
                    const tokens = ((_c = (_b = (_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.account) === null || _c === void 0 ? void 0 : _c.tokens) || [];
                    if (tokens.length > 0) {
                        const oldestToken = tokens[0];
                        const age = Date.now() - oldestToken.created * 1000;
                        hasPoaps = age > minTokenAge;
                        if (hasPoaps) {
                            poapList = tokens.map((token) => token.id);
                        }
                    }
                    return {
                        hasPoaps,
                        poapList,
                    };
                });
            }
            for (let i = 0; !poapCheckResult.hasPoaps && i < exports.poapSubgraphs.length; i++) {
                poapCheckResult = yield checkForPoaps(exports.poapSubgraphs[i]);
            }
            return Promise.resolve({
                valid: poapCheckResult.hasPoaps,
                record: {
                    address: poapCheckResult.hasPoaps ? address : undefined,
                },
            });
        });
    }
}
exports.POAPProvider = POAPProvider;
//# sourceMappingURL=poap.js.map