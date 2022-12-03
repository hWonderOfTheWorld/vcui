"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiveOrMoreGithubRepos = exports.StarredGithubRepoProvider = exports.ForkedGithubRepoProvider = exports.GithubProvider = exports.FiftyOrMoreGithubFollowers = exports.TenOrMoreGithubFollowers = void 0;
var githubFollowers_1 = require("./githubFollowers");
Object.defineProperty(exports, "TenOrMoreGithubFollowers", { enumerable: true, get: function () { return githubFollowers_1.TenOrMoreGithubFollowers; } });
Object.defineProperty(exports, "FiftyOrMoreGithubFollowers", { enumerable: true, get: function () { return githubFollowers_1.FiftyOrMoreGithubFollowers; } });
var github_1 = require("./github");
Object.defineProperty(exports, "GithubProvider", { enumerable: true, get: function () { return github_1.GithubProvider; } });
var githubForkedRepoProvider_1 = require("./githubForkedRepoProvider");
Object.defineProperty(exports, "ForkedGithubRepoProvider", { enumerable: true, get: function () { return githubForkedRepoProvider_1.ForkedGithubRepoProvider; } });
var githubStarredRepoProvider_1 = require("./githubStarredRepoProvider");
Object.defineProperty(exports, "StarredGithubRepoProvider", { enumerable: true, get: function () { return githubStarredRepoProvider_1.StarredGithubRepoProvider; } });
var githubFiveOrMoreRepos_1 = require("./githubFiveOrMoreRepos");
Object.defineProperty(exports, "FiveOrMoreGithubRepos", { enumerable: true, get: function () { return githubFiveOrMoreRepos_1.FiveOrMoreGithubRepos; } });
//# sourceMappingURL=index.js.map