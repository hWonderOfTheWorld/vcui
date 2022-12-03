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
exports.GithubPlatform = void 0;
const platform_1 = require("../utils/platform");
class GithubPlatform extends platform_1.Platform {
    constructor(options = {}) {
        super();
        this.platformId = "Github";
        this.path = "github";
        this.clientId = null;
        this.redirectUri = null;
        this.clientId = options.clientId;
        this.redirectUri = options.redirectUri;
    }
    getOAuthUrl(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const githubUrl = yield Promise.resolve(`https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}`);
            return githubUrl;
        });
    }
}
exports.GithubPlatform = GithubPlatform;
//# sourceMappingURL=App-Bindings.js.map