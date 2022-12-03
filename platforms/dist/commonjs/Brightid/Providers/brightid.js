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
exports.BrightIdProvider = void 0;
const brightid_1 = require("../procedures/brightid");
class BrightIdProvider {
    constructor(options = {}) {
        this.type = "Brightid";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const did = (_a = payload.proofs) === null || _a === void 0 ? void 0 : _a.did;
                const responseData = yield (0, brightid_1.verifyBrightidContextId)(did || "");
                const formattedData = responseData === null || responseData === void 0 ? void 0 : responseData.result;
                const isUnique = "unique" in formattedData && formattedData.unique === true;
                const firstContextId = "contextIds" in formattedData &&
                    formattedData.contextIds &&
                    formattedData.contextIds.length > 0 &&
                    formattedData.contextIds[0];
                const valid = (firstContextId && isUnique) || false;
                return {
                    valid,
                    record: valid
                        ? {
                            context: "context" in formattedData && formattedData.context,
                            contextId: firstContextId,
                            meets: JSON.stringify(isUnique),
                        }
                        : undefined,
                };
            }
            catch (e) {
                return { valid: false };
            }
        });
    }
}
exports.BrightIdProvider = BrightIdProvider;
//# sourceMappingURL=brightid.js.map