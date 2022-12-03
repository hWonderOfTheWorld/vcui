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
exports.SnapshotVotesProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const snapshotProposalsProvider_1 = require("./snapshotProposalsProvider");
class SnapshotVotesProvider {
    constructor(options = {}) {
        this.type = "SnapshotVotesProvider";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = payload.address.toLocaleLowerCase();
            let valid = false, verifiedPayload = {
                votedOnGTETwoProposals: false,
            };
            try {
                verifiedPayload = yield checkForSnapshotVotes(snapshotProposalsProvider_1.snapshotGraphQLDatabase, address);
                valid = address && verifiedPayload.votedOnGTETwoProposals ? true : false;
            }
            catch (e) {
                return { valid: false };
            }
            return Promise.resolve({
                valid: valid,
                record: valid
                    ? {
                        address: address,
                        hasVotedOnGTE2SnapshotProposals: String(valid),
                    }
                    : undefined,
            });
        });
    }
}
exports.SnapshotVotesProvider = SnapshotVotesProvider;
const checkForSnapshotVotes = (url, address) => __awaiter(void 0, void 0, void 0, function* () {
    let votedOnGTETwoProposals = false;
    let result;
    try {
        result = yield axios_1.default.post(url, {
            query: `
        query Votes {
          votes (
            where: {
              voter: "${address}"
            }
          ) {
            proposal {
              id
            }
            space {
              id
            }
          }
        }`,
        });
    }
    catch (e) {
        const error = e;
        throw `The following error is being thrown: ${error.response.data.message}`;
    }
    const votes = result.data.data.votes;
    if (votes.length >= 2) {
        votedOnGTETwoProposals = true;
    }
    return {
        votedOnGTETwoProposals,
    };
});
//# sourceMappingURL=snapshotVotesProvider.js.map