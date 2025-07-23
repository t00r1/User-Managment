const router = require('express').Router()

const authController = require('../controllers/auth-controller')

// - Регистрация
router.post('/api/auth/register', authController.registration)
// - Авторизация
router.post('/api/auth/login', authController.authorization)

module.exports = router