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
const communityStaking_1 = require("../Providers/communityStaking");
const axios_1 = __importDefault(require("axios"));
const mockedAxiosPost = jest.spyOn(axios_1.default, "post");
const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";
const MOCK_ADDRESS_LOWER = MOCK_ADDRESS.toLowerCase();
const generateSubgraphResponse = (address, total) => {
    return new Promise((resolve) => {
        resolve({
            data: {
                data: {
                    address: address,
                    users: [
                        {
                            xstakeAggregates: [
                                {
                                    total: total,
                                    round: {
                                        id: "1",
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        });
    });
};
const invalidCommunityStakingResponse = {
    data: {
        data: {
            users: [{}],
        },
    },
};
const getSubgraphQuery = (address) => {
    return `
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
      `;
};
describe("Attempt verification", function () {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxiosPost.mockImplementation((url, data) => {
            const query = data.query;
            if (url === communityStaking_1.stakingSubgraph && query.includes(MOCK_ADDRESS_LOWER)) {
                return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "220000000000000000000");
            }
        });
    });
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        const communityStakingProvider = new communityStaking_1.CommunityStakingBronzeProvider();
        const verifiedPayload = yield communityStakingProvider.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockedAxiosPost).toBeCalledWith(communityStaking_1.stakingSubgraph, {
            query: getSubgraphQuery(MOCK_ADDRESS_LOWER),
        });
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS_LOWER,
                stakeAmount: "csgte1",
            },
        });
    }));
    it("handles invalid verification attempt where address is not proper ether address", () => __awaiter(this, void 0, void 0, function* () {
        const communityStakingProvider = new communityStaking_1.CommunityStakingBronzeProvider();
        const verifiedPayload = yield communityStakingProvider.verify({
            address: "NOT_ADDRESS",
        });
        expect(mockedAxiosPost).toBeCalledWith(communityStaking_1.stakingSubgraph, {
            query: getSubgraphQuery("not_address"),
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {},
        });
    }));
    it("handles invalid subgraph response", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxiosPost.mockImplementationOnce((url, data) => {
            const query = data.query;
            if (url === communityStaking_1.stakingSubgraph && query.includes(MOCK_ADDRESS_LOWER)) {
                return new Promise((resolve) => {
                    resolve(invalidCommunityStakingResponse);
                });
            }
        });
        const communityStakingProvider = new communityStaking_1.CommunityStakingBronzeProvider();
        const verifiedPayload = yield communityStakingProvider.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockedAxiosPost).toBeCalledWith(communityStaking_1.stakingSubgraph, {
            query: getSubgraphQuery(MOCK_ADDRESS_LOWER),
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            error: ["Community Staking Bronze Provider verifyStake Error"],
        });
    }));
    it("handles invalid verification attempt where an exception is thrown", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxiosPost.mockImplementationOnce((url, data) => {
            throw Error("Community Staking Bronze Provider verifyStake Error");
        });
        const communityStakingProvider = new communityStaking_1.CommunityStakingBronzeProvider();
        const verifiedPayload = yield communityStakingProvider.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(mockedAxiosPost).toBeCalledWith(communityStaking_1.stakingSubgraph, {
            query: getSubgraphQuery(MOCK_ADDRESS_LOWER),
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            error: ["Community Staking Bronze Provider verifyStake Error"],
        });
    }));
});
describe("should return invalid payload", function () {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("when stake amount is below 1 GTC for Bronze", () => __awaiter(this, void 0, void 0, function* () {
        jest.clearAllMocks();
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "500000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingBronzeProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({ valid: false });
    }));
    it("when stake amount is below 10 GTC for Silver", () => __awaiter(this, void 0, void 0, function* () {
        jest.clearAllMocks();
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "5000000000000000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingSilverProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({ valid: false });
    }));
    it("when stake amount is below 100 GTC for Gold", () => __awaiter(this, void 0, void 0, function* () {
        jest.clearAllMocks();
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "40000000000000000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingGoldProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({ valid: false });
    }));
});
describe("should return valid payload", function () {
    it("when stake amount above 1 GTC for Bronze", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "2000000000000000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingBronzeProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({
            valid: true,
            record: { address: MOCK_ADDRESS_LOWER, stakeAmount: "csgte1" },
        });
    }));
    it("when stake amount above 10 GTC for Silver", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "15000000000000000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingSilverProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({
            valid: true,
            record: { address: MOCK_ADDRESS_LOWER, stakeAmount: "csgte10" },
        });
    }));
    it("when stake amount above 100 GTC for Gold", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "500000000000000000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingGoldProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({
            valid: true,
            record: { address: MOCK_ADDRESS_LOWER, stakeAmount: "csgte100" },
        });
    }));
    it("when stake amount is equal to 1 GTC for Bronze", () => __awaiter(this, void 0, void 0, function* () {
        jest.clearAllMocks();
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "1000000000000000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingBronzeProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({
            valid: true,
            record: { address: MOCK_ADDRESS_LOWER, stakeAmount: "csgte1" },
        });
    }));
    it("when stake amount is equal to 10 GTC for Silver", () => __awaiter(this, void 0, void 0, function* () {
        jest.clearAllMocks();
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "10000000000000000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingSilverProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({
            valid: true,
            record: { address: MOCK_ADDRESS_LOWER, stakeAmount: "csgte10" },
        });
    }));
    it("when stake amount is equal to 100 GTC for Gold", () => __awaiter(this, void 0, void 0, function* () {
        jest.clearAllMocks();
        mockedAxiosPost.mockImplementation(() => __awaiter(this, void 0, void 0, function* () {
            return generateSubgraphResponse(MOCK_ADDRESS_LOWER, "100000000000000000000");
        }));
        const communitystaking = new communityStaking_1.CommunityStakingGoldProvider();
        const communitystakingPayload = yield communitystaking.verify({
            address: MOCK_ADDRESS_LOWER,
        });
        expect(communitystakingPayload).toMatchObject({
            valid: true,
            record: { address: MOCK_ADDRESS_LOWER, stakeAmount: "csgte100" },
        });
    }));
});
//# sourceMappingURL=communityStaking.test.js.map