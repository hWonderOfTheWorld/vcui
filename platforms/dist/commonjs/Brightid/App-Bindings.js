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
exports.BrightidPlatform = void 0;
const axios_1 = __importDefault(require("axios"));
class BrightidPlatform {
    constructor() {
        this.platformId = "Brightid";
        this.path = "brightid";
        this.clientId = null;
        this.redirectUri = null;
    }
    handleVerifyContextId(userDid) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post(`${(_a = process.env.NEXT_PUBLIC_PASSPORT_PROCEDURE_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/*?$/, "")}/brightid/verifyContextId`, {
                    contextIdData: userDid,
                });
                const { data } = res;
                return (_b = data === null || data === void 0 ? void 0 : data.response) === null || _b === void 0 ? void 0 : _b.valid;
            }
            catch (error) {
                return false;
            }
        });
    }
    getProviderPayload(appContext) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (appContext.userDid) {
                const isVerified = yield this.handleVerifyContextId(appContext.userDid);
                if (isVerified) {
                    return {
                        did: appContext.userDid,
                    };
                }
            }
            const authUrl = `${(_a = process.env.NEXT_PUBLIC_PASSPORT_PROCEDURE_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/*?$/, "")}/brightid/information?callback=${appContext === null || appContext === void 0 ? void 0 : appContext.callbackUrl}`;
            const width = 600;
            const height = 800;
            const left = appContext.screen.width / 2 - width / 2;
            const top = appContext.screen.height / 2 - height / 2;
            appContext.window.open(authUrl, "_blank", `toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`);
            return appContext.waitForRedirect().then((response) => __awaiter(this, void 0, void 0, function* () {
                var _b, _c;
                const res = yield axios_1.default.post(`${(_b = process.env.NEXT_PUBLIC_PASSPORT_PROCEDURE_URL) === null || _b === void 0 ? void 0 : _b.replace(/\/*?$/, "")}/brightid/sponsor`, {
                    contextIdData: appContext.userDid,
                });
                const { data } = res;
                return {
                    code: ((_c = data === null || data === void 0 ? void 0 : data.response) === null || _c === void 0 ? void 0 : _c.valid) ? "success" : "error",
                    sessionKey: response.state,
                };
            }));
        });
    }
}
exports.BrightidPlatform = BrightidPlatform;
//# sourceMappingURL=App-Bindings.js.map