export default async function googleHandler(req, res) {
    // console.log('📥 Запрос от Google Apps Script:', getTimeInUkraine())
    try {
        res.status(200).json({ message: '✅ Google trigger received!' });
    }
    catch (err) {
        console.error('❌ Ошибка обработки Google запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}
