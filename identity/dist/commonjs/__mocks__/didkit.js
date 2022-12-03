const keyToDID = jest.fn(() => Promise.resolve("did:key:PUBLIC_KEY"));
const keyToVerificationMethod = jest.fn(() => Promise.resolve("did:key:PUBLIC_KEY#PUBLIC_KEY"));
const issueCredential = jest.fn((credential) => Promise.resolve(JSON.stringify(Object.assign(Object.assign({}, JSON.parse(credential)), { proof: {} }))));
const verifyCredential = jest.fn(() => Promise.resolve(JSON.stringify({
    checks: [],
    warnings: [],
    errors: [],
})));
const clearDidkitMocks = () => {
    keyToDID.mockClear();
    keyToVerificationMethod.mockClear();
    issueCredential.mockClear();
    verifyCredential.mockClear();
};
module.exports = {
    keyToDID,
    keyToVerificationMethod,
    issueCredential,
    verifyCredential,
    clearDidkitMocks,
};
//# sourceMappingURL=didkit.js.map