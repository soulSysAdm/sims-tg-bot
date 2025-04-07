import { google, Auth } from 'googleapis'
import { JWT } from 'google-auth-library'
import { ID_KEY } from '../../constants'
import { getValidateArray } from '../../assets/validateData.js'
import { spreadsheetId, range } from '../../globals'
import type { SheetObject, SheetData } from '../../types'

let GOOGLE_CREDENTIALS: Record<string, any>

if (process.env.VERCEL) {
  GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}')
} else {
  // ✅ без top-level await, классика:
  const dotenv = require('dotenv')
  dotenv.config()
  GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}')
}

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

/**
 * Преобразует номер колонки в буквенный формат (1 → A, 27 → AA)
 */
const columnToLetter = (col: number): string => {
  let letter = ''
  while (col > 0) {
    let temp = (col - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    col = (col - temp - 1) / 26
  }
  return letter
}

/**
 * Преобразует данные Google Sheets в массив объектов
 */
const getSheetDataArray = (rows: unknown): SheetObject[] => {
  const rowsArray = getValidateArray(rows) as SheetData

  if (rowsArray.length < 2) {
    console.log('❌ Нет данных "rows"')
    return []
  }

  const headers = rowsArray[0]
  return rowsArray.slice(1).map((row, rowIndex) => {
    const obj: Record<string, any> = {}

    headers.forEach((key, i) => {
      obj[key as string] = row[i] ?? null
    })

    obj[ID_KEY] = rowIndex + 2
    // obj._sheetMeta = {
    //   row: rowIndex + 2,
    //   cols: headers.reduce((acc: Record<string, string>, key, i) => {
    //     acc[key as string] = columnToLetter(i + 1)
    //     return acc
    //   }, {}),
    // }

    return obj as SheetObject
  })
}

/**
 * Чтение данных из Google Sheets и возврат их в виде массива объектов
 */
export const readSheet = async (): Promise<SheetObject[]> => {
  const client = (await auth.getClient()) as JWT
  const sheets = google.sheets({ version: 'v4', auth: client })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  const rows = res.data.values
  return getSheetDataArray(rows)
}
