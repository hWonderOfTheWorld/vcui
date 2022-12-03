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
exports.GitcoinGrantStatisticsProvider = void 0;
const errors_1 = require("../../utils/errors");
const signer_1 = require("../../utils/signer");
const axios_1 = __importDefault(require("axios"));
const github_1 = require("../../Github/Providers/github");
const AMI_API_TOKEN = process.env.AMI_API_TOKEN;
class GitcoinGrantStatisticsProvider {
    constructor(providerTypePrefix, options = {}) {
        this.type = "";
        this.dataUrl = "";
        this._options = {
            threshold: 1,
            receivingAttribute: "",
            recordAttribute: "",
        };
        this._options = Object.assign(Object.assign({}, this._options), options);
        this.type = `${providerTypePrefix}#${this._options.recordAttribute}#${this._options.threshold}`;
    }
    verify(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (yield (0, signer_1.getAddress)(payload)).toLowerCase();
            let valid = false;
            let githubUser = context.githubUser;
            try {
                if (!githubUser) {
                    githubUser = yield (0, github_1.verifyGithub)(payload.proofs.code, context);
                    context["githubUser"] = githubUser;
                }
                console.log("gitcoin - githubUser", address, JSON.stringify(githubUser));
                valid = !githubUser.errors && !!githubUser.id;
                if (valid) {
                    const gitcoinGrantsStatistic = yield getGitcoinStatistics(this.dataUrl, githubUser.login);
                    console.log("gitcoin - getGitcoinStatistics", address, JSON.stringify(gitcoinGrantsStatistic));
                    valid =
                        !gitcoinGrantsStatistic.errors &&
                            (gitcoinGrantsStatistic.record
                                ? gitcoinGrantsStatistic.record[this._options.receivingAttribute] >= this._options.threshold
                                : false);
                    return {
                        valid: valid,
                        error: gitcoinGrantsStatistic.errors,
                        record: valid
                            ? {
                                id: githubUser.id,
                                [this._options.recordAttribute]: `${this._options.threshold}`,
                            }
                            : undefined,
                    };
                }
            }
            catch (e) {
                return { valid: false };
            }
            const ret = {
                valid: valid,
                error: githubUser ? githubUser.errors : undefined,
                record: valid
                    ? {
                        id: `${githubUser.id}`,
                        [this._options.recordAttribute]: `${this._options.threshold}`,
                    }
                    : undefined,
            };
            return ret;
        });
    }
}
exports.GitcoinGrantStatisticsProvider = GitcoinGrantStatisticsProvider;
const getGitcoinStatistics = (dataUrl, handle) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const lowerHandle = handle.toLowerCase();
        const grantStatisticsRequest = yield axios_1.default.get(`${dataUrl}?handle=${lowerHandle}`, {
            headers: { Authorization: `token ${AMI_API_TOKEN}` },
        });
        console.log("gitcoin - API response", handle, dataUrl, JSON.stringify(grantStatisticsRequest.data));
        return { record: grantStatisticsRequest.data };
    }
    catch (_error) {
        const error = _error;
        console.log("gitcoinGrantsStatistics", dataUrl, handle, (0, errors_1.getErrorString)(error));
        return {
            errors: [
                "Error getting user info",
                `${error === null || error === void 0 ? void 0 : error.message}`,
                `Status ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status}: ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText}`,
                `Details: ${JSON.stringify((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data)}`,
            ],
        };
    }
});
//# sourceMappingURL=gitcoinGrantsStatistics.js.map