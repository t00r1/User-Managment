// - Импорт модулей
const jwt = require('jsonwebtoken')

// - Модели
const User = require('../models/User')

exports.loggedIn = function (roles) {
    return function (req, res, next) {

        try {
            // - Проверка заголовка authorization
            const authHeader = req.headers['authorization']

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Вы не авторизованы' })
            }

            const token = authHeader.split(' ')[1]

            // - Декодирование JWT-токена
            const payload= jwt.verify(token, process.env.SECRET_KEY)

            // - Проверка роли
            if (!roles.includes(payload.role)) return res.status(403).json({ message: 'У вас нет доступа' })

            req.user = payload

            next()

        } catch (err) {
            console.error(`[-] Ошибка сервера: ${err.message}`)

            if (err.name == 'TokenExpiredError') return res.status(401).json({ message: 'Токен истек, необходима повторная авторизация' })
            if (err.name == 'JsonWebTokenError') return res.status(401).json({ message: 'Некорректный токен' })

            return res.status(500).json({ message: 'Ошибка сервера' })
        }

    }
}