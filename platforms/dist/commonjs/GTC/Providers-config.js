"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTCProviderConfig = exports.GTCPlatformDetails = void 0;
exports.GTCPlatformDetails = {
    icon: "./assets/gtcPossessionStampIcon.svg",
    platform: "GTC",
    name: "GTC",
    description: "GTC possession verification",
    connectMessage: "Verify Account",
    isEVM: true,
};
exports.GTCProviderConfig = [
    {
        platformGroup: "GTC possessions",
        providers: [
            { title: "At least 10 GTC", name: "gtcPossessionsGte#10" },
            { title: "At least 100 GTC", name: "gtcPossessionsGte#100" },
        ],
    },
];
//# sourceMappingURL=Providers-config.js.map