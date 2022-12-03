"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETHProviderConfig = exports.ETHPlatformDetails = void 0;
exports.ETHPlatformDetails = {
    icon: "./assets/ethereumStampIcon.svg",
    platform: "ETH",
    name: "ETH",
    description: "ETH possession and transaction verification",
    connectMessage: "Verify Account",
    isEVM: true,
};
exports.ETHProviderConfig = [
    {
        platformGroup: "Possessions",
        providers: [
            { title: "At least 1 ETH", name: "ethPossessionsGte#1" },
            { title: "At least 10 ETH", name: "ethPossessionsGte#10" },
            { title: "At least 32 ETH", name: "ethPossessionsGte#32" },
        ],
    },
    {
        platformGroup: "Transactions",
        providers: [
            { title: "First ETH transaction occurred more than 30 days ago", name: "FirstEthTxnProvider" },
            { title: "At least 1 ETH transaction", name: "EthGTEOneTxnProvider" },
        ],
    },
    {
        platformGroup: "Gas fees spent",
        providers: [{ title: "At least 0.5 ETH in gas fees spent", name: "EthGasProvider" }],
    },
];
//# sourceMappingURL=Providers-config.js.map