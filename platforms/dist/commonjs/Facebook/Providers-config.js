"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookProviderConfig = exports.FacebookPlatformDetails = void 0;
exports.FacebookPlatformDetails = {
    icon: "./assets/facebookStampIcon.svg",
    platform: "Facebook",
    name: "Facebook",
    description: "Connect your existing account to verify with Facebook.",
    connectMessage: "Connect Account",
    enablePlatformCardUpdate: true,
};
exports.FacebookProviderConfig = [
    {
        platformGroup: "Account Name",
        providers: [{ title: "Encrypted", name: "Facebook" }],
    },
    {
        platformGroup: "Friends",
        providers: [{ title: "Greater than 100", name: "FacebookFriends" }],
    },
    {
        platformGroup: "Profile",
        providers: [{ title: "Profile Picture attached", name: "FacebookProfilePicture" }],
    },
];
//# sourceMappingURL=Providers-config.js.map