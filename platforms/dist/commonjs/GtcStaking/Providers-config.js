"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTCStakingProviderConfig = exports.GTCStakingPlatformDetails = void 0;
exports.GTCStakingPlatformDetails = {
    icon: "./assets/gtcStakingLogoIcon.svg",
    platform: "GtcStaking",
    name: "GTC Staking",
    description: "Connect to passport to verify your staking amount.",
    connectMessage: "Verify amount",
    isEVM: true,
};
exports.GTCStakingProviderConfig = [
    {
        platformGroup: "Self GTC Staking",
        providers: [
            { title: "1 GTC (Bronze)", name: "SelfStakingBronze" },
            { title: "10 GTC (Silver)", name: "SelfStakingSilver" },
            { title: "100 GTC (Gold)", name: "SelfStakingGold" },
        ],
    },
    {
        platformGroup: "Community GTC Staking",
        providers: [
            { title: "1 GTC (Bronze)", name: "CommunityStakingBronze" },
            { title: "10 GTC (Silver)", name: "CommunityStakingSilver" },
            { title: "100 GTC (Gold)", name: "CommunityStakingGold" },
        ],
    },
];
//# sourceMappingURL=Providers-config.js.map