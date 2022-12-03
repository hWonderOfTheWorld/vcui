"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getAddress = exports.getRPCProvider = void 0;
const providers_1 = require("@ethersproject/providers");
const DIDKit = __importStar(require("@spruceid/didkit-wasm"));
const credentials_1 = require("@gitcoin/passport-identity/dist/commonjs/src/credentials");
const ethers_1 = require("ethers");
const RPC_URL = process.env.RPC_URL;
const getRPCProvider = (payload) => {
    if (payload.jsonRpcSigner) {
        const signer = payload.jsonRpcSigner;
        return signer;
    }
    const rpcUrl = payload.rpcUrl || RPC_URL;
    const provider = new providers_1.StaticJsonRpcProvider(rpcUrl);
    return provider;
};
exports.getRPCProvider = getRPCProvider;
const getAddress = ({ address, signer, issuer }) => __awaiter(void 0, void 0, void 0, function* () {
    if (signer && signer.challenge && signer.signature) {
        const verified = yield (0, credentials_1.verifyCredential)(DIDKit, signer.challenge);
        if (verified && issuer === signer.challenge.issuer && address === signer.challenge.credentialSubject.address) {
            return ethers_1.utils.getAddress(ethers_1.utils.verifyMessage(signer.challenge.credentialSubject.challenge, signer.signature));
        }
    }
    return address;
});
exports.getAddress = getAddress;
//# sourceMappingURL=signer.js.map