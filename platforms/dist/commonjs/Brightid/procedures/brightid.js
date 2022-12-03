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
exports.triggerBrightidSponsorship = exports.verifyBrightidContextId = void 0;
const brightid_sdk_1 = require("brightid_sdk");
const CONTEXT = "Gitcoin";
const verifyBrightidContextId = (contextId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyContextIdResult = (yield (0, brightid_sdk_1.verifyContextId)(CONTEXT, contextId));
        const isUnique = "unique" in verifyContextIdResult && verifyContextIdResult.unique === true;
        const isValid = "contextIds" in verifyContextIdResult &&
            verifyContextIdResult.contextIds &&
            verifyContextIdResult.contextIds.length > 0;
        return { valid: (isValid && isUnique) || false, result: verifyContextIdResult };
    }
    catch (err) {
        return { valid: false, error: err };
    }
});
exports.verifyBrightidContextId = verifyBrightidContextId;
const triggerBrightidSponsorship = (contextId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sponsorResult = (yield (0, brightid_sdk_1.sponsor)(process.env.BRIGHTID_PRIVATE_KEY || "", CONTEXT, contextId));
        return { valid: sponsorResult.status === "success", result: sponsorResult };
    }
    catch (err) {
        return { valid: false, error: err };
    }
});
exports.triggerBrightidSponsorship = triggerBrightidSponsorship;
//# sourceMappingURL=brightid.js.map