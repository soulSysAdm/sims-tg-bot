"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const telegramHandler_1 = __importDefault(require("./telegramHandler"));
const googleHandler_1 = __importDefault(require("./googleHandler"));
async function handler(req, res) {
    const path = req.url;
    if (path === '/webhook') {
        return (0, telegramHandler_1.default)(req, res);
    }
    if (path === '/check') {
        return (0, googleHandler_1.default)(req, res);
    }
    return res.status(404).send('🔍 Not Found');
}
