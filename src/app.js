// - Подгрузка переменных окружения
require('dotenv').config()

// - Импорт модулей
const express = require('express')

// - Роутеры
const authRouters = require('./routes/auth-routes')
const userRouters = require('./routes/user-routes')

const app = express()
const port = process.env.PORT || 3000

// - Подключение к БД
require('./db/db')

app.use(express.json())
app.use(authRouters)
app.use(userRouters)

app.listen(port, () => {
    console.log('[+] Сервис запущен: http://localhost:' + port)
})