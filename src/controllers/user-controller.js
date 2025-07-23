// - Хелперы
const { verifyUserAccess } = require('../utils/helpers')

// - Модели
const User = require('../models/User')

// - Получение списка пользователей
exports.getListOfUsers = async (req, res) => {

    try {

        const users = await User.find()

        return res.status(200).json({ users })

    } catch (err) {
        console.error(`[-] Ошибка при получении списка пользователей: ${err.message}`)
        res.status(500).json({ message: 'Ошибка сервера при получении списка пользователей' })
    }

}

// - Блокировка пользователя
exports.blockUser = async (req, res) => {

    try {

        const result = await verifyUserAccess(req)

        if (result.error) {
            return res.status(result.error.status).json({ message: result.error.message })
        }

        const user = result

        if (!user.isActive) return res.status(409).json({ message: 'Пользователь уже заблокирован' })

        // - Блокировка пользователя
        user.isActive = false

        await user.save()

        return res.status(200).json({ message: 'Пользователь заблокирован!' })

    } catch (err) {
        console.error(`[-] Ошибка при блокировке пользователя: ${err.message}`)
        res.status(500).json({ message: 'Ошибка сервера при блокировке пользователя' })
    }

}

// - Получение пользователя
exports.getUser = async (req, res) => {

    try {
        const result = await verifyUserAccess(req)

        if (result.error) {
            return res.status(result.error.status).json({ message: result.error.message })
        }

        const user = result

        // - Отправка пользователя
        return res.status(200).json({ user })

    } catch (err) {
        console.error(`[-] Ошибка сервера при получении пользователя: ${err.message}`)
        res.status(500).json({ message: 'Ошибка сервера при получении пользователя' })
    }

}