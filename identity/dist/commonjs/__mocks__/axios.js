var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MOCK_CHALLENGE_VALUE = "this is a challenge";
const MOCK_CHALLENGE_CREDENTIAL = {
    credentialSubject: {
        challenge: "this is a challenge",
    },
};
const MOCK_CHALLENGE_RESPONSE_BODY = {
    credential: MOCK_CHALLENGE_CREDENTIAL,
};
const MOCK_VERIFY_RESPONSE_BODY = {
    credential: { type: ["VerifiableCredential"] },
    record: {
        type: "test",
        address: "0xmyAddress",
    },
};
const clearAxiosMocks = () => {
    post.mockClear();
};
const post = jest.fn((url, data) => __awaiter(this, void 0, void 0, function* () {
    if (url.endsWith("/challenge")) {
        return {
            data: MOCK_CHALLENGE_RESPONSE_BODY,
        };
    }
    if (url.endsWith("/verify")) {
        return {
            data: MOCK_VERIFY_RESPONSE_BODY,
        };
    }
    throw Error("This endpoint is not set up!");
}));
module.exports = {
    post,
    clearAxiosMocks,
    MOCK_CHALLENGE_VALUE,
    MOCK_CHALLENGE_CREDENTIAL,
    MOCK_CHALLENGE_RESPONSE_BODY,
    MOCK_VERIFY_RESPONSE_BODY,
};
//# sourceMappingURL=axios.js.map