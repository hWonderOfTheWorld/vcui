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
exports.SnapshotProposalsProvider = exports.snapshotGraphQLDatabase = void 0;
const axios_1 = __importDefault(require("axios"));
exports.snapshotGraphQLDatabase = "https://hub.snapshot.org/graphql";
class SnapshotProposalsProvider {
    constructor(options = {}) {
        this.type = "SnapshotProposalsProvider";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = payload.address.toLocaleLowerCase();
            let valid = false, verifiedPayload = {
                proposalHasVotes: false,
            };
            try {
                verifiedPayload = yield checkForSnapshotProposals(exports.snapshotGraphQLDatabase, address);
                valid = address && verifiedPayload.proposalHasVotes ? true : false;
            }
            catch (e) {
                return { valid: false };
            }
            return {
                valid: valid,
                record: valid
                    ? {
                        address: address,
                        hasGT1SnapshotProposalsVotedOn: String(valid),
                    }
                    : undefined,
            };
        });
    }
}
exports.SnapshotProposalsProvider = SnapshotProposalsProvider;
const checkForSnapshotProposals = (url, address) => __awaiter(void 0, void 0, void 0, function* () {
    let proposalHasVotes = false;
    let result;
    try {
        result = yield axios_1.default.post(url, {
            query: `
        query Proposals {
          proposals (
            where: {
              author: "${address}"
            }
          ) {
            id
            scores_total
            author
          }
        }`,
        });
    }
    catch (e) {
        const error = e;
        throw `The following error is being thrown: ${error.response.data.message}`;
    }
    const proposals = result.data.data.proposals;
    if (proposals.length > 0) {
        const proposalCheck = proposals.findIndex((proposal) => proposal.scores_total > 0);
        proposalHasVotes = proposalCheck === -1 ? false : true;
    }
    return {
        proposalHasVotes,
    };
});
//# sourceMappingURL=snapshotProposalsProvider.js.map