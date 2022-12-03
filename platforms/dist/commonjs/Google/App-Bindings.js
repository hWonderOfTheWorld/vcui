"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePlatform = void 0;
const platform_1 = require("../utils/platform");
class GooglePlatform extends platform_1.Platform {
    constructor(options = {}) {
        super();
        this.platformId = "Google";
        this.path = "Google";
        this.clientId = null;
        this.redirectUri = null;
        this.clientId = options.clientId;
        this.redirectUri = options.redirectUri;
    }
    getOAuthUrl(state) {
        return new Promise((resolve) => {
            resolve(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${this.redirectUri}&prompt=consent&response_type=code&client_id=${this.clientId}&scope=email+profile&access_type=offline&state=${state}`);
        });
    }
}
exports.GooglePlatform = GooglePlatform;
//# sourceMappingURL=App-Bindings.js.map