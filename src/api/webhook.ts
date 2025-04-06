// === 🤖 Telegram Webhook Handler ===
import type { VercelRequest, VercelResponse } from '@vercel/node'
import telegramHandler from './telegramHandler.js'
import googleHandler from './googleHandler.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url

  if (path === '/webhook') {
    return telegramHandler(req, res)
  }

  if (path === '/check') {
    return googleHandler(req, res)
  }

  return res.status(404).send('🔍 Not Found')
}
