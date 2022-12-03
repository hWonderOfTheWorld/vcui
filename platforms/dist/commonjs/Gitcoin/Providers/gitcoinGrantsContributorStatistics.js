"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitcoinContributorStatisticsProvider = void 0;
const gitcoinGrantsStatistics_1 = require("./gitcoinGrantsStatistics");
class GitcoinContributorStatisticsProvider extends gitcoinGrantsStatistics_1.GitcoinGrantStatisticsProvider {
    constructor(options = {}) {
        super("GitcoinContributorStatistics", options);
        this.dataUrl = "https://gitcoin.co/grants/v1/api/vc/contributor_statistics";
    }
}
exports.GitcoinContributorStatisticsProvider = GitcoinContributorStatisticsProvider;
//# sourceMappingURL=gitcoinGrantsContributorStatistics.js.map