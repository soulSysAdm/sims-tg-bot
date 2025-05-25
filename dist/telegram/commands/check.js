"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCheckCommand = handleCheckCommand;
const dateFormat_1 = require("../../assets/dateFormat");
const google_1 = require("../../google");
const index_1 = require("../index");
let ALLOWED_USERS;
if (process.env.VERCEL) {
    ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]');
}
else {
    const dotenv = require('dotenv');
    dotenv.config();
    ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]');
}
async function handleCheckCommand(userName) {
    console.log('📥 Запрос от Google Apps Script:', (0, dateFormat_1.getTimeInUkraine)());
    const allowedUsersIds = ALLOWED_USERS.map((user) => user.id);
    try {
        for (const chatId of allowedUsersIds) {
            await (0, index_1.sendTelegramMessage)(chatId, `**${userName}** Использовал команду "/check" для запроса данных с таблицы`);
        }
        await (0, google_1.repeatSheet)();
    }
    catch (err) {
        console.error('❌ Ошибка обработки Google запроса:', err);
    }
}
