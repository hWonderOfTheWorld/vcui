"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gitcoinGrantsContributorStatistics_1 = require("../gitcoinGrantsContributorStatistics");
describe("GitcoinContributorStatisticsProvider class", function () {
    it("should be properly initialized", function () {
        const threshold = 193;
        const receivingAttribute = "aaa";
        const recordAttribute = "bbb";
        const gitcoin = new gitcoinGrantsContributorStatistics_1.GitcoinContributorStatisticsProvider({
            threshold,
            receivingAttribute,
            recordAttribute,
        });
        expect(gitcoin.type).toEqual(`GitcoinContributorStatistics#${recordAttribute}#${threshold}`);
        expect(gitcoin.dataUrl).toEqual("https://gitcoin.co/grants/v1/api/vc/contributor_statistics");
        expect(gitcoin._options).toEqual({ threshold, receivingAttribute, recordAttribute });
    });
});
//# sourceMappingURL=gitcoinGrantsContributorStatistics.test.js.map