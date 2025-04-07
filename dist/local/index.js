"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSheetData = exports.getSheetData = exports.sheetData = void 0;
const validateData_1 = require("../assets/validateData");
exports.sheetData = [];
const getSheetData = () => {
    return exports.sheetData;
};
exports.getSheetData = getSheetData;
const setSheetData = (newData) => {
    const newDataArray = (0, validateData_1.getValidateArray)(newData);
    exports.sheetData.splice(0, exports.sheetData.length, ...newDataArray);
};
exports.setSheetData = setSheetData;
