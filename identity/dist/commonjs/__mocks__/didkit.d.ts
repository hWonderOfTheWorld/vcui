export const keyToDID: jest.Mock<Promise<string>, []>;
export const keyToVerificationMethod: jest.Mock<Promise<string>, []>;
export const issueCredential: jest.Mock<Promise<string>, [credential?: any]>;
export const verifyCredential: jest.Mock<Promise<string>, []>;
export function clearDidkitMocks(): void;
