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
exports.Platform = void 0;
class Platform {
    getProviderPayload(appContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUrl = yield this.getOAuthUrl(appContext.state);
            const width = 600;
            const height = 800;
            const left = appContext.screen.width / 2 - width / 2;
            const top = appContext.screen.height / 2 - height / 2;
            appContext.window.open(authUrl, "_blank", `toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`);
            return appContext.waitForRedirect().then((data) => {
                return {
                    code: data.code,
                    sessionKey: data.state,
                    signature: data.signature,
                };
            });
        });
    }
    getOAuthUrl(state) {
        throw new Error("Method not implemented.");
    }
}
exports.Platform = Platform;
//# sourceMappingURL=platform.js.map