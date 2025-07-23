// - Импорт модулей
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// - Модели
const User = require('../models/User')

// - Хеширование пароля
const hashedPassword = async (password, salt) => {
    const hash = await bcrypt.hash(password, salt)

    return hash
}

// - Генерация JWT-токена
const generateJWT = (id, email, role) => {
    return jwt.sign({
        email: email,
        role: role,
        id: id
    }, process.env.SECRET_KEY, { expiresIn: '3h' })
}

// - Проверка пароля на валидность
const comparePassword = async (password, hashedPassword) => {
    const isValid = await bcrypt.compare(password, hashedPassword)

    return isValid
}

// - Верификация пользователя
// - Проверка на существование и прав пользователя (над которым совершаются определенные действия)
const verifyUserAccess = async (req) => {

    try {
        // - Текущий пользователь
        const currentUser = req.user
        // - ID пользователя над которым совершаются действия
        const userID = req.params.userID
        // - Проверка пользователя над которым совершаются действия
        const user = await User.findOne({ _id: userID })

        if (!user) {

            return {
                error: {
                    status: 404, message: 'Пользователь не найден'
                }
            }

        }

        // - Проверка прав текущего пользователя: либо админ либо сам пользователь
        if (currentUser.role != 'admin' && currentUser.id != userID) {

            return {
                error: {
                    status: 403, message: 'У вас недостачно прав'
                }
            }

        }

        return user

    } catch (err) {
        console.error(`[-] Ошибка при верификации пользователя: ${err.message}`)
    }

}

module.exports = {
    hashedPassword,
    generateJWT,
    comparePassword,
    verifyUserAccess
}