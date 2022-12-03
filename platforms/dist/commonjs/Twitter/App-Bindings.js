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
exports.TwitterPlatform = void 0;
const platform_1 = require("../utils/platform");
const axios_1 = __importDefault(require("axios"));
class TwitterPlatform extends platform_1.Platform {
    constructor() {
        super(...arguments);
        this.platformId = "Twitter";
        this.path = "twitter";
    }
    getOAuthUrl() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.post(`${(_a = process.env.NEXT_PUBLIC_PASSPORT_PROCEDURE_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/*?$/, "")}/twitter/generateAuthUrl`, {
                callback: process.env.NEXT_PUBLIC_PASSPORT_TWITTER_CALLBACK,
            });
            return res.data.authUrl;
        });
    }
}
exports.TwitterPlatform = TwitterPlatform;
//# sourceMappingURL=App-Bindings.js.map