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
Object.defineProperty(exports, "__esModule", { value: true });
const brightid_1 = require("../Providers/brightid");
const brightid_2 = require("../procedures/brightid");
const brightid_sdk_1 = require("brightid_sdk");
jest.mock("brightid_sdk", () => ({
    verifyContextId: jest.fn(),
    sponsor: jest.fn(),
}));
describe("Attempt BrightId", () => {
    const did = "did:pkh:eip155:1:0x0";
    const nonUniqueResponse = {
        unique: false,
        app: "Gitcoin",
        context: "Gitcoin",
        contextIds: ["sampleContextId"],
    };
    const validVerificationResponse = {
        unique: true,
        app: "Gitcoin",
        context: "Gitcoin",
        contextIds: ["sampleContextId"],
    };
    const invalidVerificationResponse = {
        status: 400,
        statusText: "Not Found",
        data: {
            error: true,
            errorNum: 2,
            errorMessage: "Not Found",
            contextIds: ["sampleContextId"],
            code: 400,
        },
    };
    const validSponsorshipResponse = {
        status: "success",
        statusReason: "successfulStatusReason",
    };
    const invalidSponsorshipResponse = {
        status: 404,
        statusText: "Not Found",
        data: {
            error: true,
            errorNum: 12,
            errorMessage: "Passport app is not found.",
            code: 404,
        },
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("Handles Verification", () => {
        it("valid BrightId did as contextId verification attempt, returns valid true, verifies if user has Meet status and verified contextId", () => __awaiter(void 0, void 0, void 0, function* () {
            brightid_sdk_1.verifyContextId.mockResolvedValue(validVerificationResponse);
            const result = yield new brightid_1.BrightIdProvider().verify({
                proofs: {
                    did,
                },
            });
            expect(brightid_sdk_1.verifyContextId).toBeCalledTimes(1);
            expect(brightid_sdk_1.verifyContextId).toBeCalledWith("Gitcoin", did);
            expect(result).toMatchObject({
                valid: true,
                record: {
                    contextId: "sampleContextId",
                    meets: "true",
                },
            });
        }));
        it("invalid BrightId did as contextId verification attempt, returns valid false and record undefined", () => __awaiter(void 0, void 0, void 0, function* () {
            brightid_sdk_1.verifyContextId.mockResolvedValue(invalidVerificationResponse);
            const result = yield new brightid_1.BrightIdProvider().verify({
                proofs: {
                    did,
                },
            });
            expect(brightid_sdk_1.verifyContextId).toBeCalledTimes(1);
            expect(result).toMatchObject({
                valid: false,
                record: undefined,
            });
        }));
        it("thrown error from BrightId did as contextId verification attempt, returns valid false", () => __awaiter(void 0, void 0, void 0, function* () {
            brightid_sdk_1.verifyContextId.mockRejectedValue("Thrown Error");
            const result = yield new brightid_1.BrightIdProvider().verify({
                proofs: {
                    did,
                },
            });
            expect(brightid_sdk_1.verifyContextId).toBeCalledTimes(1);
            expect(result).toMatchObject({
                valid: false,
            });
        }));
        it("user is sponsored but did not attend a connection party, returns valid false and record undefined", () => __awaiter(void 0, void 0, void 0, function* () {
            brightid_sdk_1.verifyContextId.mockResolvedValue(nonUniqueResponse);
            const result = yield new brightid_1.BrightIdProvider().verify({
                proofs: {
                    did,
                },
            });
            expect(brightid_sdk_1.verifyContextId).toBeCalledTimes(1);
            expect(result).toMatchObject({
                valid: false,
                record: undefined,
            });
        }));
    });
    describe("Handles Sponsorship", () => {
        it("successful attempt", () => __awaiter(void 0, void 0, void 0, function* () {
            brightid_sdk_1.sponsor.mockResolvedValue(validSponsorshipResponse);
            const result = yield (0, brightid_2.triggerBrightidSponsorship)(did);
            expect(brightid_sdk_1.sponsor).toBeCalledTimes(1);
            expect(brightid_sdk_1.sponsor).toBeCalledWith(process.env.BRIGHTID_PRIVATE_KEY || "", "Gitcoin", did);
            expect(result).toMatchObject({
                valid: true,
                result: validSponsorshipResponse,
            });
        }));
        it("unsuccessful attempt", () => __awaiter(void 0, void 0, void 0, function* () {
            brightid_sdk_1.sponsor.mockResolvedValue(invalidSponsorshipResponse);
            const result = yield (0, brightid_2.triggerBrightidSponsorship)(did);
            expect(brightid_sdk_1.sponsor).toBeCalledTimes(1);
            expect(brightid_sdk_1.sponsor).toBeCalledWith(process.env.BRIGHTID_PRIVATE_KEY || "", "Gitcoin", did);
            expect(result).toMatchObject({
                valid: false,
                result: invalidSponsorshipResponse,
            });
        }));
        it("error thrown from an unsuccessful attempt", () => __awaiter(void 0, void 0, void 0, function* () {
            brightid_sdk_1.sponsor.mockRejectedValue("Thrown Error");
            const result = yield (0, brightid_2.triggerBrightidSponsorship)(did);
            expect(brightid_sdk_1.sponsor).toBeCalledTimes(1);
            expect(brightid_sdk_1.sponsor).toBeCalledWith(process.env.BRIGHTID_PRIVATE_KEY || "", "Gitcoin", did);
            expect(result).toMatchObject({
                valid: false,
                error: "Thrown Error",
            });
        }));
    });
});
//# sourceMappingURL=brightid.test.js.map