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
const gitpoap_1 = require("../gitpoap");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";
const validResponse = {
    data: [
        {
            gitPoapId: 3261,
            name: "GitPOAP: 2022 Test Contributor",
            year: 2022,
            description: "A description",
            repositories: ["gitpoap/gitpoap-hackathon-devconnect-2022"],
            earnedAt: "2022-05-18",
            mintedAt: "2022-05-18",
        },
        {
            gitPoapId: 6781,
            name: "GitPOAP: 2022 EthereumJS Contributor",
            year: 2022,
            description: "A description",
            repositories: ["ethereumjs/ethereumjs-monorepo", "ethereumjs/ultralight"],
            earnedAt: "2022-07-13",
            mintedAt: "2022-07-13",
        },
        {
            gitPoapId: 20,
            name: "GitPOAP: 2021 Wagyu Installer Contributor",
            year: 2021,
            description: "A description",
            repositories: ["stake-house/wagyu-installer"],
            earnedAt: "2021-08-10",
            mintedAt: "2022-04-07",
        },
    ],
};
const emptyResponse = {
    data: [],
};
describe("Attempt verification", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("handles valid verification attempt", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(void 0, void 0, void 0, function* () {
            if (url.includes(MOCK_ADDRESS)) {
                return Promise.resolve(validResponse);
            }
            return Promise.resolve(validResponse);
        }));
        const gitpoap = new gitpoap_1.GitPOAPProvider();
        const verifiedPayload = yield gitpoap.verify({
            address: MOCK_ADDRESS,
        });
        expect(verifiedPayload).toEqual({
            valid: true,
            record: {
                gitpoaps: validResponse.data.map((gitpoap) => gitpoap.gitPoapId).join(","),
            },
        });
    }));
    it("should return invalid if the user doesn't have any GitPOAPs", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url) => __awaiter(void 0, void 0, void 0, function* () {
            if (url.includes(MOCK_ADDRESS)) {
                return Promise.resolve(emptyResponse);
            }
            return Promise.resolve(emptyResponse);
        }));
        const gitpoap = new gitpoap_1.GitPOAPProvider();
        const verifiedPayload = yield gitpoap.verify({
            address: MOCK_ADDRESS,
        });
        expect(verifiedPayload).toEqual({
            valid: false,
            record: {
                gitpoaps: undefined,
            },
        });
    }));
});
//# sourceMappingURL=gitpoap.test.js.map