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
exports.DiscordPlatform = void 0;
const platform_1 = require("../utils/platform");
class DiscordPlatform extends platform_1.Platform {
    constructor(options = {}) {
        super();
        this.path = "discord";
        this.platformId = "Discord";
        this.clientId = null;
        this.redirectUri = null;
        this.clientId = options.clientId;
        this.redirectUri = options.redirectUri;
    }
    getOAuthUrl(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUrl = `https://discord.com/api/oauth2/authorize?response_type=code&scope=identify&client_id=${process.env.NEXT_PUBLIC_PASSPORT_DISCORD_CLIENT_ID}&state=${state}&redirect_uri=${process.env.NEXT_PUBLIC_PASSPORT_DISCORD_CALLBACK}`;
            return authUrl;
        });
    }
}
exports.DiscordPlatform = DiscordPlatform;
//# sourceMappingURL=App-Bindings.js.map