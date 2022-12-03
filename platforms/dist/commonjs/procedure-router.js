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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const twitterOAuth = __importStar(require("./Twitter/procedures/twitterOauth"));
const brightid_1 = require("./Brightid/procedures/brightid");
const path_1 = __importDefault(require("path"));
exports.router = (0, express_1.Router)();
exports.router.post("/twitter/generateAuthUrl", (req, res) => {
    const { callback } = req.body;
    if (callback) {
        const state = twitterOAuth.getSessionKey();
        const client = twitterOAuth.initClient(callback, state);
        const data = {
            state,
            authUrl: twitterOAuth.generateAuthURL(client, state),
        };
        res.status(200).send(data);
    }
    else {
        res.status(400);
    }
});
exports.router.post("/brightid/sponsor", (req, res) => {
    const { contextIdData } = req.body;
    if (contextIdData) {
        return void (0, brightid_1.triggerBrightidSponsorship)(contextIdData).then((response) => {
            return res.status(200).send({ response });
        });
    }
    else {
        res.status(400);
    }
});
exports.router.post("/brightid/verifyContextId", (req, res) => {
    const { contextIdData } = req.body;
    if (contextIdData) {
        return void (0, brightid_1.verifyBrightidContextId)(contextIdData).then((response) => {
            return res.status(200).send({ response });
        });
    }
    else {
        res.status(400);
    }
});
exports.router.get("/brightid/information", (req, res) => {
    const staticPath = process.env.CURRENT_ENV === "development"
        ? "src/static/bright-id-template.html"
        : "iam/src/static/bright-id-template.html";
    res.sendFile(path_1.default.resolve(process.cwd(), staticPath));
});
//# sourceMappingURL=procedure-router.js.map