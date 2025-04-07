import { readSheet } from './google'
import { getTelegramMessages } from './google/utils/dataSheet'
const { setSheetData, getSheetData } = require('../mock/sheet.js')

// const getReadSheet = async (): Promise<SheetObject[]> => {
//   try {
//     return await readSheet()
//   } catch (error) {
//     console.error(error.message)
//   }
// }

const dataSheetFunc = async (): Promise<void> => {
  // const dataSheet = await getReadSheet()
  const dataSheet = getSheetData()
  const messages = getTelegramMessages(dataSheet)
  console.log(messages)
}

dataSheetFunc().catch((err) => console.log(err))
