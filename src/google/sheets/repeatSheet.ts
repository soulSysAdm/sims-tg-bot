import { getTelegramMessages, readSheet } from '../index'
import { sendTelegramMessage } from '../../telegram'
import type { AllowedUser } from '../../types'

let ALLOWED_USERS: AllowedUser[]

if (process.env.VERCEL) {
  ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]')
} else {
  const dotenv = require('dotenv')
  dotenv.config()
  ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]')
}

export async function repeatSheet(chatId: number) {
  try {
    const sheetData = await readSheet()
    const { validMessages, unValidMessages } = getTelegramMessages(sheetData)
    const allowedUsersIds = ALLOWED_USERS.map((user) => user.id)
    // for (const chatId of allowedUsersIds) {
      for (const message of unValidMessages) {
        await sendTelegramMessage(chatId, message)
      }
      for (const message of validMessages) {
        await sendTelegramMessage(chatId, message)
      }
    // }
  } catch (error) {
    console.error('❌ Ошибка repeatSheet:', error.message)
  }
}
