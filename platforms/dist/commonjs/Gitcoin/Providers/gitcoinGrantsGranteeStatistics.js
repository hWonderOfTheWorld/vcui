"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitcoinGranteeStatisticsProvider = void 0;
const gitcoinGrantsStatistics_1 = require("./gitcoinGrantsStatistics");
class GitcoinGranteeStatisticsProvider extends gitcoinGrantsStatistics_1.GitcoinGrantStatisticsProvider {
    constructor(options = {}) {
        super("GitcoinGranteeStatistics", options);
        this.dataUrl = "https://gitcoin.co/grants/v1/api/vc/grantee_statistics";
    }
}
exports.GitcoinGranteeStatisticsProvider = GitcoinGranteeStatisticsProvider;
//# sourceMappingURL=gitcoinGrantsGranteeStatistics.js.map