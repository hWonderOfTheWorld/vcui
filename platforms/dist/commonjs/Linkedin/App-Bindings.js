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
exports.LinkedinPlatform = void 0;
const platform_1 = require("../utils/platform");
class LinkedinPlatform extends platform_1.Platform {
    constructor(options = {}) {
        super();
        this.platformId = "Linkedin";
        this.path = "linkedin";
        this.clientId = options.clientId;
        this.redirectUri = options.redirectUri;
        this.state = options.state;
    }
    getOAuthUrl(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const linkedinUrl = yield Promise.resolve(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}&scope=r_emailaddress%20r_liteprofile`);
            return linkedinUrl;
        });
    }
}
exports.LinkedinPlatform = LinkedinPlatform;
//# sourceMappingURL=App-Bindings.js.map