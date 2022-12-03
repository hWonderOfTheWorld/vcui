"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityStakingGoldProvider = exports.CommunityStakingSilverProvider = exports.CommunityStakingBronzeProvider = exports.stakingSubgraph = void 0;
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
exports.stakingSubgraph = "https://api.thegraph.com/subgraphs/name/moonshotcollective/id-staking";
function verifyStake(payload) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const address = payload.address.toLowerCase();
        const result = yield axios_1.default.post(exports.stakingSubgraph, {
            query: `
    {
      users(where: {address: "${address}"}) {
        address,
        xstakeAggregates(where: {round: "1", total_gt: 0}) {
          total
          round {
            id
          }
        }
      }
    }
      `,
        });
        const r = result;
        const response = {
            address: address,
            totalAmountStaked: 0,
        };
        const xstake = (_d = (_c = (_b = (_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.users[0]) === null || _c === void 0 ? void 0 : _c.xstakeAggregates[0]) === null || _d === void 0 ? void 0 : _d.total;
        if (!xstake) {
            return response;
        }
        const stakeAmountFormatted = ethers_1.utils.formatUnits(xstake, 18);
        return {
            totalAmountStaked: parseFloat(stakeAmountFormatted),
            address: address,
        };
    });
}
class CommunityStakingBronzeProvider {
    constructor(options = {}) {
        this.type = "CommunityStakingBronze";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            try {
                const stakeData = yield verifyStake(payload);
                const stakeAmount = stakeData.totalAmountStaked;
                valid = stakeAmount >= 1.0;
                return {
                    valid,
                    record: valid
                        ? {
                            address: stakeData.address,
                            stakeAmount: "csgte1",
                        }
                        : {},
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: ["Community Staking Bronze Provider verifyStake Error"],
                };
            }
        });
    }
}
exports.CommunityStakingBronzeProvider = CommunityStakingBronzeProvider;
class CommunityStakingSilverProvider {
    constructor(options = {}) {
        this.type = "CommunityStakingSilver";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            try {
                const stakeData = yield verifyStake(payload);
                const stakeAmount = stakeData.totalAmountStaked;
                valid = stakeAmount >= 10.0;
                return {
                    valid,
                    record: valid
                        ? {
                            address: stakeData.address,
                            stakeAmount: "csgte10",
                        }
                        : {},
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: ["Community Staking Silver Provider verifyStake Error"],
                };
            }
        });
    }
}
exports.CommunityStakingSilverProvider = CommunityStakingSilverProvider;
class CommunityStakingGoldProvider {
    constructor(options = {}) {
        this.type = "CommunityStakingGold";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            try {
                const stakeData = yield verifyStake(payload);
                const stakeAmount = stakeData.totalAmountStaked;
                valid = stakeAmount >= 100.0;
                return {
                    valid: valid,
                    record: valid
                        ? {
                            address: stakeData.address,
                            stakeAmount: "csgte100",
                        }
                        : {},
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: ["Community Staking Gold Provider verifyStake Error"],
                };
            }
        });
    }
}
exports.CommunityStakingGoldProvider = CommunityStakingGoldProvider;
//# sourceMappingURL=communityStaking.js.map