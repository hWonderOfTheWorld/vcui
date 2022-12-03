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
exports.GTCStakingPlatform = void 0;
class GTCStakingPlatform {
    constructor() {
        this.platformId = "GtcStaking";
        this.path = "";
        this.clientId = null;
        this.redirectUri = null;
    }
    getProviderPayload(appContext) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getOAuthUrl(state) {
        throw new Error("Method not implemented.");
    }
}
exports.GTCStakingPlatform = GTCStakingPlatform;
//# sourceMappingURL=App-Bindings.js.map