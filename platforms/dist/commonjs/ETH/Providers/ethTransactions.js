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
exports.requestEthData = exports.EthGTEOneTxnProvider = exports.FirstEthTxnProvider = exports.EthGasProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
class EthGasProvider {
    constructor(options = {}) {
        this.type = "EthGasProvider";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = payload.address.toLocaleLowerCase();
            const offsetCount = 500;
            let valid = false, ethData, verifiedPayload = {
                hasGTEHalfEthSpentGas: false,
            };
            try {
                ethData = yield (0, exports.requestEthData)(address, offsetCount);
                verifiedPayload = checkGasFees(ethData);
                valid = address && verifiedPayload.hasGTEHalfEthSpentGas ? true : false;
            }
            catch (e) {
                return { valid: false };
            }
            return {
                valid: valid,
                record: valid
                    ? {
                        address: address,
                        hasGTEHalfEthSpentGasSpentOnTheMainnet: String(valid),
                    }
                    : undefined,
            };
        });
    }
}
exports.EthGasProvider = EthGasProvider;
class FirstEthTxnProvider {
    constructor(options = {}) {
        this.type = "FirstEthTxnProvider";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = payload.address.toLocaleLowerCase();
            const offsetCount = 100;
            let valid = false, ethData, verifiedPayload = {
                hasGTE30DaysSinceFirstTxn: false,
            };
            try {
                ethData = yield (0, exports.requestEthData)(address, offsetCount);
                verifiedPayload = checkFirstTxn(ethData, address);
                valid = address && verifiedPayload.hasGTE30DaysSinceFirstTxn ? true : false;
            }
            catch (e) {
                return { valid: false };
            }
            return {
                valid: valid,
                record: valid
                    ? {
                        address: address,
                        hasGTE30DaysSinceFirstTxnOnTheMainnet: String(valid),
                    }
                    : undefined,
            };
        });
    }
}
exports.FirstEthTxnProvider = FirstEthTxnProvider;
class EthGTEOneTxnProvider {
    constructor(options = {}) {
        this.type = "EthGTEOneTxnProvider";
        this._options = {};
        this._options = Object.assign(Object.assign({}, this._options), options);
    }
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = payload.address.toLocaleLowerCase();
            const offsetCount = 100;
            let valid = false, ethData, verifiedPayload = {
                hasGTEOneEthTxn: false,
            };
            try {
                ethData = yield (0, exports.requestEthData)(address, offsetCount);
                verifiedPayload = checkForTxns(ethData, address);
                valid = address && verifiedPayload.hasGTEOneEthTxn ? true : false;
            }
            catch (e) {
                return { valid: false };
            }
            return {
                valid: valid,
                record: valid
                    ? {
                        address: address,
                        hasGTE1ETHTxnOnTheMainnet: String(valid),
                    }
                    : undefined,
            };
        });
    }
}
exports.EthGTEOneTxnProvider = EthGTEOneTxnProvider;
const requestEthData = (address, offsetCount) => __awaiter(void 0, void 0, void 0, function* () {
    const etherscanURL = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&page=1&offset=${offsetCount}&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    let etherscanRequestResponse;
    try {
        etherscanRequestResponse = yield axios_1.default.get(etherscanURL);
    }
    catch (e) {
        const error = e;
        throw `The GET request resulted in a status code ${etherscanRequestResponse.status} error. Message: ${error.response.data.message}`;
    }
    return etherscanRequestResponse.data;
});
exports.requestEthData = requestEthData;
const checkGasFees = (ethData) => {
    const gweiToEth = 0.000000001;
    const results = ethData.result;
    let hasGTEHalfEthSpentGas = false, totalGas = 0;
    for (let i = 0; i < results.length; i++) {
        const gasUsed = parseInt(results[i].gasUsed);
        if (totalGas + gasUsed > 500000000)
            break;
        totalGas += gasUsed;
    }
    if (totalGas * gweiToEth >= 0.5) {
        hasGTEHalfEthSpentGas = true;
    }
    return {
        hasGTEHalfEthSpentGas,
    };
};
const checkFirstTxn = (ethData, address) => {
    let hasGTE30DaysSinceFirstTxn = false;
    const results = ethData.result;
    if (ethData.result.length > 0) {
        const successfulFirstTxn = results.findIndex((result) => {
            const txnInMilliseconds = parseInt(result.timeStamp) * 1000;
            const todayInMilliseconds = new Date().getTime();
            const timeDifference = todayInMilliseconds - txnInMilliseconds;
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            return daysDifference >= 30 && result.isError === "0" && result.from.toLowerCase() === address;
        });
        successfulFirstTxn === -1 ? (hasGTE30DaysSinceFirstTxn = false) : (hasGTE30DaysSinceFirstTxn = true);
    }
    return {
        hasGTE30DaysSinceFirstTxn,
    };
};
const checkForTxns = (ethData, address) => {
    const results = ethData.result;
    let hasGTEOneEthTxn = false;
    if (results.length > 0) {
        const txnsCheck = results.findIndex((result) => result.isError === "0" && result.from.toLowerCase() === address);
        hasGTEOneEthTxn = txnsCheck === -1 ? false : true;
    }
    return {
        hasGTEOneEthTxn,
    };
};
//# sourceMappingURL=ethTransactions.js.map