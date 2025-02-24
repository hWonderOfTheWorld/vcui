"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterProviderConfig = exports.TwitterPlatformDetails = void 0;
exports.TwitterPlatformDetails = {
    icon: "./assets/twitterStampIcon.svg",
    platform: "Twitter",
    name: "Twitter",
    description: "Connect your existing Twitter account to verify.",
    connectMessage: "Connect Account",
    enablePlatformCardUpdate: true,
};
exports.TwitterProviderConfig = [
    {
        platformGroup: "Account Name",
        providers: [{ title: "Encrypted", name: "Twitter" }],
    },
    {
        platformGroup: "Tweet/Posts",
        providers: [{ title: "More than 10", name: "TwitterTweetGT10" }],
    },
    {
        platformGroup: "Followers",
        providers: [
            { title: "More than 100", name: "TwitterFollowerGT100" },
            {
                title: "More than 500",
                name: "TwitterFollowerGT500",
            },
            {
                title: "More than 1000",
                name: "TwitterFollowerGTE1000",
            },
            {
                title: "More than 5000",
                name: "TwitterFollowerGT5000",
            },
        ],
    },
];
//# sourceMappingURL=Providers-config.js.map