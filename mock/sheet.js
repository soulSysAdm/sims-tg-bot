const fs = require('fs')
const path = require('path')

const DATA_PATH = path.join(__dirname, 'sheet-data.json')

// Инициализируем sheetData из файла (если он есть)
let sheetData = []

if (fs.existsSync(DATA_PATH)) {
  try {
    const fileContent = fs.readFileSync(DATA_PATH, 'utf-8')
    sheetData = JSON.parse(fileContent)
    console.log('[INIT] Loaded sheetData from file.')
  } catch (e) {
    console.error('[ERROR] Failed to parse sheetData.json:', e)
  }
}

function getSheetData() {
  return sheetData
}

function setSheetData(newData) {
  sheetData.splice(0, sheetData.length, ...newData)
  fs.writeFileSync(DATA_PATH, JSON.stringify(sheetData, null, 2), 'utf-8')
  console.log('[SAVE] sheetData written to file.')
}

module.exports = {
  getSheetData,
  setSheetData,
}
