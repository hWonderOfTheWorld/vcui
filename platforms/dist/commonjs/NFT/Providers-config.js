"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTProviderConfig = exports.NFTPlatformDetails = void 0;
exports.NFTPlatformDetails = {
    icon: "./assets/nftStampIcon.svg",
    platform: "NFT",
    name: "NFT Holder",
    description: "Connect a wallet and validate the stamp by retrieving an NFT.",
    connectMessage: "Connect NFT",
};
exports.NFTProviderConfig = [
    {
        platformGroup: "NFT Holder",
        providers: [{ title: "Holds at least 1 NFT", name: "NFT" }],
    },
];
//# sourceMappingURL=Providers-config.js.map