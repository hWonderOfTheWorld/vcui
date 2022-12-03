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
const gnosisSafe_1 = require("../gnosisSafe");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const MOCK_ADDRESS = "0xcF314CE817E25b4F784bC1f24c9A79A525fEC50f";
const validResponseList = ["safe-1", "safe-2", "safe-3"];
beforeEach(() => {
    jest.clearAllMocks();
});
describe("Verification succeeds", function () {
    it("when valid response is received from the gnosis safe API endpoint", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: {
                    safes: validResponseList,
                },
            });
        });
        const gnosisSafeProvider = new gnosisSafe_1.GnosisSafeProvider();
        const gnosisSafePayload = yield gnosisSafeProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${gnosisSafe_1.gnosisSafeApiEndpoint}owners/${MOCK_ADDRESS}/safes`);
        expect(gnosisSafePayload).toEqual({
            valid: true,
            record: {
                address: MOCK_ADDRESS,
            },
        });
    }));
});
describe("Verification fails", function () {
    it("when an empty list is received from the gnosis safe API", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: {
                    safes: [],
                },
            });
        });
        const gnosisSafeProvider = new gnosisSafe_1.GnosisSafeProvider();
        const gnosisSafePayload = yield gnosisSafeProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${gnosisSafe_1.gnosisSafeApiEndpoint}owners/${MOCK_ADDRESS}/safes`);
        expect(gnosisSafePayload).toEqual({
            valid: false,
            error: ["Unable to find any safes owned by the given address"],
        });
    }));
    it("when no list of safes is received from the gnosis safe API", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: {},
            });
        });
        const gnosisSafeProvider = new gnosisSafe_1.GnosisSafeProvider();
        const gnosisSafePayload = yield gnosisSafeProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${gnosisSafe_1.gnosisSafeApiEndpoint}owners/${MOCK_ADDRESS}/safes`);
        expect(gnosisSafePayload).toEqual({
            valid: false,
            error: ["Unable to find any safes owned by the given address"],
        });
    }));
    it("when the HTTP status code is not 200", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            return Promise.resolve({
                status: 400,
                statusText: "Bad Request",
                data: {
                    result: { list: validResponseList },
                    status: "success",
                },
            });
        });
        const gnosisSafeProvider = new gnosisSafe_1.GnosisSafeProvider();
        const gnosisSafePayload = yield gnosisSafeProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${gnosisSafe_1.gnosisSafeApiEndpoint}owners/${MOCK_ADDRESS}/safes`);
        expect(gnosisSafePayload).toEqual({
            valid: false,
            error: [`HTTP Error '400'. Details: 'Bad Request'.`],
        });
    }));
    it("when the HTTP request throws", () => __awaiter(this, void 0, void 0, function* () {
        axios_1.default.get.mockImplementation(() => {
            throw "something bad happened";
        });
        const gnosisSafeProvider = new gnosisSafe_1.GnosisSafeProvider();
        const gnosisSafePayload = yield gnosisSafeProvider.verify({
            address: MOCK_ADDRESS,
        });
        expect(axios_1.default.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith(`${gnosisSafe_1.gnosisSafeApiEndpoint}owners/${MOCK_ADDRESS}/safes`);
        expect(gnosisSafePayload).toEqual({
            valid: false,
            error: ["something bad happened"],
        });
    }));
});
//# sourceMappingURL=gnosisSafe.test.js.map