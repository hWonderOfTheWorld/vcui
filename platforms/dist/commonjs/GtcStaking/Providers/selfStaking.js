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
exports.SelfStakingGoldProvider = exports.SelfStakingSilverProvider = exports.SelfStakingBronzeProvider = exports.stakingSubgraph = void 0;
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
        stakes(where: {round: "1"}) {
          stake
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
            stakeAmount: 0,
        };
        const stake = (_d = (_c = (_b = (_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.users[0]) === null || _c === void 0 ? void 0 : _c.stakes[0]) === null || _d === void 0 ? void 0 : _d.stake;
        if (!stake) {
            return response;
        }
        const stakeAmountFormatted = ethers_1.utils.formatUnits(stake.toString(), 18);
        return {
            stakeAmount: parseFloat(stakeAmountFormatted),
            address: address,
        };
    });
}
class SelfStakingBronzeProvider {
    constructor(options = {}) {
        this.type = "SelfStakingBronze";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            try {
                const stakeData = yield verifyStake(payload);
                const stakeAmount = stakeData.stakeAmount;
                valid = stakeAmount >= 1.0;
                return {
                    valid,
                    record: valid
                        ? {
                            address: payload.address,
                            stakeAmount: "ssgte1",
                        }
                        : {},
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: ["Self Staking Bronze Provider verifyStake Error"],
                };
            }
        });
    }
}
exports.SelfStakingBronzeProvider = SelfStakingBronzeProvider;
class SelfStakingSilverProvider {
    constructor(options = {}) {
        this.type = "SelfStakingSilver";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            try {
                const stakeData = yield verifyStake(payload);
                const stakeAmount = stakeData.stakeAmount;
                valid = stakeAmount >= 10.0;
                return {
                    valid,
                    record: valid
                        ? {
                            address: payload.address,
                            stakeAmount: "ssgte10",
                        }
                        : {},
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: ["Self Staking Silver Provider verifyStake Error"],
                };
            }
        });
    }
}
exports.SelfStakingSilverProvider = SelfStakingSilverProvider;
class SelfStakingGoldProvider {
    constructor(options = {}) {
        this.type = "SelfStakingGold";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = false;
            try {
                const stakeData = yield verifyStake(payload);
                const stakeAmount = stakeData.stakeAmount;
                valid = stakeAmount >= 100.0;
                return {
                    valid,
                    record: valid
                        ? {
                            address: payload.address,
                            stakeAmount: "ssgte100",
                        }
                        : {},
                };
            }
            catch (e) {
                return {
                    valid: false,
                    error: ["Self Staking Gold Provider verifyStake Error"],
                };
            }
        });
    }
}
exports.SelfStakingGoldProvider = SelfStakingGoldProvider;
//# sourceMappingURL=selfStaking.js.map