"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSheet = void 0;
const googleapis_1 = require("googleapis");
const constants_1 = require("../../constants");
const validateData_js_1 = require("../../assets/validateData.js");
const globals_1 = require("../../globals");
let GOOGLE_CREDENTIALS;
if (process.env.VERCEL) {
    GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
}
else {
    // ✅ без top-level await, классика:
    const dotenv = require('dotenv');
    dotenv.config();
    GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
}
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: GOOGLE_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
/**
 * Преобразует номер колонки в буквенный формат (1 → A, 27 → AA)
 */
const columnToLetter = (col) => {
    let letter = '';
    while (col > 0) {
        let temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
    }
    return letter;
};
/**
 * Преобразует данные Google Sheets в массив объектов
 */
const getSheetDataArray = (rows) => {
    const rowsArray = (0, validateData_js_1.getValidateArray)(rows);
    if (rowsArray.length < 2) {
        console.log('❌ Нет данных "rows"');
        return [];
    }
    const headers = rowsArray[0];
    return rowsArray.slice(1).map((row, rowIndex) => {
        const obj = {};
        headers.forEach((key, i) => {
            obj[key] = row[i] ?? null;
        });
        obj[constants_1.ID_KEY] = rowIndex + 2;
        // obj._sheetMeta = {
        //   row: rowIndex + 2,
        //   cols: headers.reduce((acc: Record<string, string>, key, i) => {
        //     acc[key as string] = columnToLetter(i + 1)
        //     return acc
        //   }, {}),
        // }
        return obj;
    });
};
/**
 * Чтение данных из Google Sheets и возврат их в виде массива объектов
 */
const readSheet = async () => {
    const client = (await auth.getClient());
    const sheets = googleapis_1.google.sheets({ version: 'v4', auth: client });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: globals_1.spreadsheetId,
        range: globals_1.range,
    });
    const rows = res.data.values;
    return getSheetDataArray(rows);
};
exports.readSheet = readSheet;
