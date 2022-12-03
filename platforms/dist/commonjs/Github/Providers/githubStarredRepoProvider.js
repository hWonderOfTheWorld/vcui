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
exports.StarredGithubRepoProvider = void 0;
const github_1 = require("./github");
const axios_1 = __importDefault(require("axios"));
class StarredGithubRepoProvider {
    constructor(options = {}) {
        this.type = "StarredGithubRepoProvider";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false, accessToken, verifiedUserPayload = {}, verifiedUserRepoPayload = {};
            try {
                accessToken = yield (0, github_1.requestAccessToken)(payload.proofs.code, context);
                verifiedUserPayload = yield verifyGithub(accessToken);
                verifiedUserRepoPayload = yield verifyUserGithubRepo(verifiedUserPayload, accessToken);
                valid = verifiedUserPayload && verifiedUserPayload.id && verifiedUserRepoPayload ? true : false;
            }
            catch (e) {
                return { valid: false };
            }
            return {
                valid: valid,
                record: valid
                    ? {
                        id: `${verifiedUserPayload.id}gte1Star`,
                    }
                    : undefined,
            };
        });
    }
}
exports.StarredGithubRepoProvider = StarredGithubRepoProvider;
const verifyGithub = (ghAccessToken) => __awaiter(void 0, void 0, void 0, function* () {
    let userRequest;
    try {
        userRequest = yield axios_1.default.get("https://api.github.com/user", {
            headers: { Authorization: `token ${ghAccessToken}` },
        });
        if (userRequest.status != 200) {
            throw `Get user request returned status code ${userRequest.status} instead of the expected 200`;
        }
    }
    catch (e) {
        const error = e;
        if (error.response) {
            throw `User GET request returned status code ${userRequest.status} instead of the expected 200`;
        }
        else if (error.request) {
            throw `A request was made, but no response was received: ${error.request}`;
        }
        else {
            throw `Error: ${error.message}`;
        }
    }
    return userRequest.data;
});
const verifyUserGithubRepo = (userData, ghAccessToken) => __awaiter(void 0, void 0, void 0, function* () {
    let repoRequest;
    try {
        repoRequest = yield axios_1.default.get(`https://api.github.com/users/${userData.login}/repos?per_page=100`, {
            headers: { Authorization: `token ${ghAccessToken}` },
        });
    }
    catch (e) {
        const error = e;
        if (error.response) {
            throw `User GET request returned status code ${repoRequest.status} instead of the expected 200`;
        }
        else if (error.request) {
            throw `A request was made, but no response was received: ${error.request}`;
        }
        else {
            throw `Error: ${error.message}`;
        }
    }
    const checkUserRepoStars = () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < repoRequest.data.length; i++) {
            const repo = repoRequest.data[i];
            if (userData.id === repo.owner.id && repo.stargazers_count > 1) {
                return true;
            }
            else if (userData.id === repo.owner.id && repo.stargazers_count === 1) {
                const stargazer = (yield axios_1.default.get(repo.stargazers_url)).data;
                for (let i = 0; i < stargazer.length; i++) {
                    if (stargazer[i].id != repo.owner.id) {
                        return true;
                    }
                }
                return false;
            }
        }
    });
    return yield checkUserRepoStars();
});
//# sourceMappingURL=githubStarredRepoProvider.js.map