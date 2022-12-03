"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZkSyncProviderConfig = exports.ZkSyncPlatformDetails = void 0;
exports.ZkSyncPlatformDetails = {
    icon: "./assets/zksyncStampIcon.svg",
    platform: "ZkSync",
    name: "ZkSync",
    description: "ZkSync Verification",
    connectMessage: "Verify Account",
    isEVM: true,
};
exports.ZkSyncProviderConfig = [
    {
        platformGroup: "Account name",
        providers: [{ title: "Encrypted", name: "ZkSync" }],
    },
];
//# sourceMappingURL=Providers-config.js.map