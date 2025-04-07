"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSheet_1 = require("./google/utils/dataSheet");
const { setSheetData, getSheetData } = require('../mock/sheet.js');
// const getReadSheet = async (): Promise<SheetObject[]> => {
//   try {
//     return await readSheet()
//   } catch (error) {
//     console.error(error.message)
//   }
// }
const dataSheetFunc = async () => {
    // const dataSheet = await getReadSheet()
    const dataSheet = getSheetData();
    const messages = (0, dataSheet_1.getTelegramMessages)(dataSheet);
    console.log(messages);
};
dataSheetFunc().catch((err) => console.log(err));
