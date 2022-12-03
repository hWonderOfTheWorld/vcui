"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotProviderConfig = exports.SnapshotPlatformDetails = void 0;
exports.SnapshotPlatformDetails = {
    icon: "./assets/snapshotStampIcon.svg",
    platform: "Snapshot",
    name: "Snapshot",
    description: "Connect your existing account to verify with Snapshot.",
    connectMessage: "Verify Account",
    isEVM: true,
};
exports.SnapshotProviderConfig = [
    {
        platformGroup: "Snapshot Voter",
        providers: [{ title: "Voted on 2 or more DAO proposals", name: "SnapshotVotesProvider" }],
    },
    {
        platformGroup: "Snapshot Proposal Creator",
        providers: [
            { title: "Created a DAO proposal that was voted on by at least 1 account", name: "SnapshotProposalsProvider" },
        ],
    },
];
//# sourceMappingURL=Providers-config.js.map