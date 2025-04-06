"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = telegramHandler;
// : Promise<VercelResponse>
async function telegramHandler(req, res) {
    try {
        console.log('Telegram Handler started 1');
        res.status(200).send('ok');
    }
    catch (error) {
        console.error('❌ Ошибка основного webhook:', error);
        res.status(500).send('Ошибка сервера');
    }
}
