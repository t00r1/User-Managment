const { credentials } = require('../config')
const { connectionString } = credentials.mongoDB

const mongoose = require('mongoose')

if (!connectionString) {
    console.error('[-] Отсутствует строка подключения к БД!')
    process.exit(1)
}

mongoose.connect(connectionString, {
    tls: true,
    tlsCAFile: 'root.crt',
}).then(() => console.log('[+] Соединение с БД успешно установлено'))
    .catch(err => console.log('[-] Произошла ошибка при подключении к БД: ' + err))

