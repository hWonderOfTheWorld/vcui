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
const App_Bindings_1 = require("../App-Bindings");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const validResponse = { data: { response: { valid: true } } };
const invalidResponse = { data: { response: { valid: false } } };
describe("BrightidPlatform", () => {
    it("should be able to verify a contextId", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            switch (url) {
                case `${(_a = process.env.NEXT_PUBLIC_PASSPORT_PROCEDURE_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/*?$/, "")}/brightid/verifyContextId`:
                    return validResponse;
                default:
                    return {
                        status: 404,
                    };
            }
        }));
        const platform = new App_Bindings_1.BrightidPlatform();
        const result = yield platform.handleVerifyContextId("did:brightid:0x123");
        expect(result).toBe(true);
    }));
    it("should be able to get a provider payload", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.post.mockImplementation((url) => __awaiter(void 0, void 0, void 0, function* () {
            var _b, _c;
            switch (url) {
                case `${(_b = process.env.NEXT_PUBLIC_PASSPORT_PROCEDURE_URL) === null || _b === void 0 ? void 0 : _b.replace(/\/*?$/, "")}/brightid/verifyContextId`:
                    return invalidResponse;
                case `${(_c = process.env.NEXT_PUBLIC_PASSPORT_PROCEDURE_URL) === null || _c === void 0 ? void 0 : _c.replace(/\/*?$/, "")}/brightid/sponsor`:
                    return validResponse;
                default:
                    return {
                        status: 404,
                    };
            }
        }));
        const result = yield new App_Bindings_1.BrightidPlatform().getProviderPayload({
            state: "string",
            window: {
                open: jest.fn(),
            },
            screen: {
                width: 1,
                height: 1,
            },
            userDid: "string",
            callbackUrl: "string",
            waitForRedirect: () => __awaiter(void 0, void 0, void 0, function* () {
                return Promise.resolve({
                    state: "brightId",
                });
            }),
        });
        expect(result).toEqual({ code: "success", sessionKey: "brightId" });
    }));
});
//# sourceMappingURL=App-Bindings.test.js.map