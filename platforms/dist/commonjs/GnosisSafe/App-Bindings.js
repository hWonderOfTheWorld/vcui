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
exports.GnosisSafePlatform = void 0;
const platform_1 = require("../utils/platform");
class GnosisSafePlatform extends platform_1.Platform {
    constructor() {
        super(...arguments);
        this.platformId = "GnosisSafe";
        this.path = "GnosisSafe";
    }
    getProviderPayload(appContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Promise.resolve({});
            return result;
        });
    }
}
exports.GnosisSafePlatform = GnosisSafePlatform;
//# sourceMappingURL=App-Bindings.js.map