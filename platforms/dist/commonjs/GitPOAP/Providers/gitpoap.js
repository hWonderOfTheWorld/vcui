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
exports.GitPOAPProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const GITPOAP_API_URL = "https://public-api.gitpoap.io";
class GitPOAPProvider {
    constructor(options = {}) {
        this.type = "GitPOAP";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = payload.address;
            let valid = false;
            let gitpoaps = [];
            try {
                const { data } = yield axios_1.default.get(`${GITPOAP_API_URL}/v1/address/${address}/gitpoaps`, {
                    headers: { "Content-Type": "application/json" },
                });
                gitpoaps = data;
                valid = gitpoaps.length > 0;
            }
            catch (err) {
                return {
                    valid: false,
                };
            }
            const gitpoapIds = gitpoaps.map((gitpoap) => gitpoap.gitPoapId);
            return {
                valid,
                record: {
                    gitpoaps: valid && gitpoapIds ? gitpoapIds.join(",") : undefined,
                },
            };
        });
    }
}
exports.GitPOAPProvider = GitPOAPProvider;
//# sourceMappingURL=gitpoap.js.map