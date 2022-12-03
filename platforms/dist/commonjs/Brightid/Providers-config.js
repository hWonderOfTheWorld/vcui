"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrightidProviderConfig = exports.BrightidPlatformDetails = void 0;
exports.BrightidPlatformDetails = {
    icon: "./assets/brightidStampIcon.svg",
    platform: "Brightid",
    name: "BrightID",
    description: "Connect your BrightID",
    connectMessage: "Connect Account",
    isEVM: true,
};
exports.BrightidProviderConfig = [
    {
        platformGroup: "Account Name",
        providers: [{ title: "Encrypted", name: "Brightid" }],
    },
];
//# sourceMappingURL=Providers-config.js.map