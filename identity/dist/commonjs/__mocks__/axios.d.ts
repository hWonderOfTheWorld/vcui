export const post: jest.Mock<Promise<{
    data: {
        credential: {
            credentialSubject: {
                challenge: string;
            };
        };
    };
} | {
    data: {
        credential: {
            type: string[];
        };
        record: {
            type: string;
            address: string;
        };
    };
}>, [url?: any, data?: any]>;
export function clearAxiosMocks(): void;
export const MOCK_CHALLENGE_VALUE: "this is a challenge";
export namespace MOCK_CHALLENGE_CREDENTIAL {
    namespace credentialSubject {
        const challenge: string;
    }
}
export namespace MOCK_CHALLENGE_RESPONSE_BODY {
    export { MOCK_CHALLENGE_CREDENTIAL as credential };
}
export namespace MOCK_VERIFY_RESPONSE_BODY {
    namespace credential {
        const type: string[];
    }
    namespace record {
        const type_1: string;
        export { type_1 as type };
        export const address: string;
    }
}
