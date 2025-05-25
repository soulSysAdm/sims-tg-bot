import { getTimeInUkraine } from '../../assets/dateFormat'
import { repeatSheet } from '../../google'
import { sendTelegramMessage } from '../index'
import type { AllowedUser } from '../../types'

let ALLOWED_USERS: AllowedUser[]

if (process.env.VERCEL) {
  ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]')
} else {
  const dotenv = require('dotenv')
  dotenv.config()
  ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]')
}

export async function handleCheckCommand(userName: string) {
  console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
  const allowedUsersIds = ALLOWED_USERS.map((user) => user.id)
  try {
    for (const chatId of allowedUsersIds) {
      await sendTelegramMessage(
        chatId,
        `**${userName}** Использовал команду "/check" для запроса данных с таблицы`,
      )
    }
    await repeatSheet()
  } catch (err) {
    console.error('❌ Ошибка обработки Google запроса:', err)
  }
}
