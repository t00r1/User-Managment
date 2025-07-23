// - Хелперы
const { hashedPassword, generateJWT, comparePassword } = require('../utils/helpers')

// - Модели
const User = require('../models/User')

// - Регистрация
exports.registration = async (req, res) => {

    try {
        const { fullName, dayOfBirth, email, password, role } = req.body

        // - Проверка email
        const candidate = await User.findOne({ email: email })

        if (candidate) return res.status(409).json({ message: 'Аккаунт с таким email уже существует' })

        // - Хеширование пароля
        const passwordHash = await hashedPassword(password, 11)

        // - Роль
        const userRole = role || 'user'

        // - Создание нового пользователя
        await new User({
            fullName: fullName,
            dayOfBirth: new Date(dayOfBirth),
            email: email,
            password: passwordHash,
            role: userRole
        }).save()

        console.log(`[+] Зарегистрирован пользователь: ${email}`)

        res.status(200).json({ message: 'Регистрация прошла успешно!' })

    } catch (err) {
        console.error(`[-] Ошибка регистрации: ${err.message}`)
        res.status(500).json({ message: 'Ошибка сервера при регистрации' })
    }

}

// - Авторизация
exports.authorization = async (req, res) => {

    try {
        const { email, password } = req.body

        // - Проверка пользователя
        const user = await User.findOne({ email: email })

        if (!user) return res.status(401).json({ message: 'Некорректный email или пароль' })

        // - Проверка пароля
        const isValidPassword = await comparePassword(password, user.password)

        if (!isValidPassword) return res.status(401).json({ message: 'Некорректный email или пароль' })

        // - Проверка активности пользователя
        if (!user.isActive) return res.status(403).json({ message: 'Ваша учетная запись заблокирована' })

        // - Генерация JWT-токена
        const token = generateJWT(user._id, email, user.role)

        return res.status(200).json({ token, message: `Добро пожаловать, ${user.fullName}!` })

    } catch (err) {
        console.error(`[-] Ошибка при авторизации: ${err.message}`)
        res.status(500).json({ message: 'Ошибка сервера при авторизации' })
    }

}