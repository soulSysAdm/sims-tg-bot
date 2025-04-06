// // === 📦 Google Sheets Trigger Endpoint ===
// import { allowedUsers } from '../globals/index.js'
// import { delaySeconds, getTimeInUkraine } from '../assets/dateFormat.js'
// import { sendTelegramMessage } from '../telegram/index.js'
// import { repeatSheet } from '../google/index.js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function googleHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
  try {

    res.status(200).json({ message: '✅ Google trigger received!' })

  } catch (err) {
    console.error('❌ Ошибка обработки Google запроса:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}
