"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LensProviderConfig = exports.LensPlatformDetails = void 0;
exports.LensPlatformDetails = {
    icon: "./assets/lensStampIcon.svg",
    platform: "Lens",
    name: "Lens",
    description: "Lens Profile Verification",
    connectMessage: "Verify Account",
    isEVM: true,
};
exports.LensProviderConfig = [
    {
        platformGroup: "Lens Handle",
        providers: [{ title: "At least 1 Lens Handle", name: "Lens" }],
    },
];
//# sourceMappingURL=Providers-config.js.map