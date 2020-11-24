const express = require('express');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http);

const PORT = process.env.PORT || 3001;

app.use(express.json());

io.on('connection', socket => {
    socket.emit('message', "connected")
});

http.listen(PORT, () => {
    console.log(`Application server listening on port ${PORT}`);
});