"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsProviderConfig = exports.EnsPlatformDetails = void 0;
exports.EnsPlatformDetails = {
    icon: "./assets/ensStampIcon.svg",
    platform: "Ens",
    name: "ENS",
    description: "Purchase an .eth name to verify/ connect your existing account.",
    connectMessage: "Connect Account",
    isEVM: true,
};
exports.EnsProviderConfig = [
    {
        platformGroup: "Account Name",
        providers: [{ title: "Encrypted", name: "Ens" }],
    },
];
//# sourceMappingURL=Providers-config.js.map