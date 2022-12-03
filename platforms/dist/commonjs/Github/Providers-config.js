"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubProviderConfig = exports.GithubPlatformDetails = void 0;
exports.GithubPlatformDetails = {
    icon: "./assets/githubStampIcon.svg",
    platform: "Github",
    name: "Github",
    description: "Connect your existing Github account to verify.",
    connectMessage: "Connect Account",
    enablePlatformCardUpdate: true,
};
exports.GithubProviderConfig = [
    {
        platformGroup: "Account Name",
        providers: [{ title: "Encrypted", name: "Github" }],
    },
    {
        platformGroup: "Repositories",
        providers: [
            {
                title: "Five or more Github repos",
                name: "FiveOrMoreGithubRepos",
            },
            {
                title: "At least 1 Github repo forked by another user",
                name: "ForkedGithubRepoProvider",
            },
            {
                title: "At least 1 Github repo starred by another user",
                name: "StarredGithubRepoProvider",
            },
        ],
    },
    {
        platformGroup: "Followers",
        providers: [
            {
                title: "Ten or more Github followers",
                name: "TenOrMoreGithubFollowers",
            },
            {
                title: "Fifty or more Github followers",
                name: "FiftyOrMoreGithubFollowers",
            },
        ],
    },
];
//# sourceMappingURL=Providers-config.js.map