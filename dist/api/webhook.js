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
exports.default = handler;
const telegramHandler_1 = __importDefault(require("./telegramHandler"));
const googleHandler_1 = __importDefault(require("./googleHandler"));
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = req.url;
        if (path === '/webhook') {
            return (0, telegramHandler_1.default)(req, res);
        }
        if (path === '/check') {
            return (0, googleHandler_1.default)(req, res);
        }
        return res.status(404).send('🔍 Not Found');
    });
}
