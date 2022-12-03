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
const discord_1 = require("../Providers/discord");
const axios_1 = __importDefault(require("axios"));
jest.mock("axios");
const mockedAxios = axios_1.default;
const validDiscordUserResponse = {
    data: {
        user: {
            id: "268473310986240001",
            username: "Discord",
            avatar: "f749bb0cbeeb26ef21eca719337d20f1",
            discriminator: "0001",
            public_flags: 131072,
        },
    },
    status: 200,
};
const validCodeResponse = {
    data: {
        access_token: "762165719dhiqudgasyuqwt6235",
    },
    status: 200,
};
const code = "ABC123_ACCESSCODE";
beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.post.mockImplementation((url, data, config) => __awaiter(void 0, void 0, void 0, function* () {
        return validCodeResponse;
    }));
    mockedAxios.get.mockImplementation((url, config) => __awaiter(void 0, void 0, void 0, function* () {
        return validDiscordUserResponse;
    }));
});
describe("Attempt verification", function () {
    it("handles valid verification attempt", () => __awaiter(this, void 0, void 0, function* () {
        const discord = new discord_1.DiscordProvider();
        const discordPayload = yield discord.verify({
            proofs: {
                code,
            },
        });
        expect(mockedAxios.get).toBeCalledWith("https://discord.com/api/oauth2/@me", {
            headers: { Authorization: "Bearer 762165719dhiqudgasyuqwt6235" },
        });
        expect(discordPayload).toEqual({
            valid: true,
            record: {
                id: validDiscordUserResponse.data.user.id,
            },
        });
    }));
    it("should return invalid payload when unable to retrieve auth token", () => __awaiter(this, void 0, void 0, function* () {
        const logSpy = jest.spyOn(console, "error").mockImplementation();
        mockedAxios.post.mockImplementation((url, data, config) => __awaiter(this, void 0, void 0, function* () {
            return {
                status: 500,
            };
        }));
        const discord = new discord_1.DiscordProvider();
        const discordPayload = yield discord.verify({
            proofs: {
                code,
            },
        });
        expect(discordPayload).toMatchObject({ valid: false });
        expect(logSpy).toHaveBeenCalledWith("Error when verifying discord account for user:", undefined);
    }));
    it("should return invalid payload when there is no id in verifyDiscord response", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url, config) => __awaiter(this, void 0, void 0, function* () {
            return {
                data: {
                    id: undefined,
                    login: "my-login-handle",
                    type: "User",
                },
                status: 200,
            };
        }));
        const discord = new discord_1.DiscordProvider();
        const discordPayload = yield discord.verify({
            proofs: {
                code,
            },
        });
        expect(discordPayload).toMatchObject({ valid: false });
    }));
    it("should return invalid payload when a bad status code is returned by discord user api", () => __awaiter(this, void 0, void 0, function* () {
        mockedAxios.get.mockImplementation((url, config) => __awaiter(this, void 0, void 0, function* () {
            return {
                status: 500,
            };
        }));
        const discord = new discord_1.DiscordProvider();
        const discordPayload = yield discord.verify({
            proofs: {
                code,
            },
        });
        expect(discordPayload).toMatchObject({ valid: false });
    }));
});
//# sourceMappingURL=discord.test.js.map