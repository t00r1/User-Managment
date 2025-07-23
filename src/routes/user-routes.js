const router = require('express').Router()

const userController = require('../controllers/user-controller')
const userCheck = require('../middleware/auth-middleware')

// - Получение списка пользователей
router.get('/admin/users', userCheck.loggedIn(['admin']), userController.getListOfUsers)
// - Получение пользователя
router.get('/api/users/:userID', userCheck.loggedIn(['user', 'admin']), userController.getUser)
// - Блокировка пользователя
router.patch('/api/users/:userID/block', userCheck.loggedIn(['user', 'admin']), userController.blockUser)

module.exports = router