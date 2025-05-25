"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeatSheet = repeatSheet;
const index_1 = require("../index");
const telegram_1 = require("../../telegram");
let ALLOWED_USERS;
if (process.env.VERCEL) {
    ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]');
}
else {
    const dotenv = require('dotenv');
    dotenv.config();
    ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]');
}
async function repeatSheet() {
    try {
        const sheetData = await (0, index_1.readSheet)();
        const { validMessages, unValidMessages } = (0, index_1.getTelegramMessages)(sheetData);
        const allowedUsersIds = ALLOWED_USERS.map((user) => user.id);
        for (const chatId of allowedUsersIds) {
            for (const message of unValidMessages) {
                await (0, telegram_1.sendTelegramMessage)(chatId, message);
            }
            for (const message of validMessages) {
                await (0, telegram_1.sendTelegramMessage)(chatId, message);
            }
        }
    }
    catch (error) {
        console.error('❌ Ошибка repeatSheet:', error.message);
    }
}
