const express = require('express');
const path = require('path');
const app = express();

// Раздаём npm пакеты из папки node_modules по запросу '/node_modules'
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
// Раздаём собранный билд из папки dist
app.use(express.static(path.join(__dirname, 'dist')));
// Скармливаем все маршруты на обработку клиенту, подсовывая index.html с сервера
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Запускаем сервер
const port = 1001;
app.listen(port);
console.log('Сервер работает на порту ' + port);