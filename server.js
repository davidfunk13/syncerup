const express = require('express');

const app = express();

const server = require('http').createServer(app);

const PORT = process.env.PORT | 3001;

const options = {
    cors: {
        origin: '*'
    }
};

const io = require('socket.io')(server, options);

function recieveMessage (socket, message) {
    socket.emit('notification', { message: 'message recieved', data: message })
}

server.listen(PORT, function () {
    console.log('Server listening on port ' + PORT)
});

io.on('connection', socket => {
    socket.emit('notification', { message: 'connected' });

    socket.on('message', data => recieveMessage(socket, data));

    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
    })
});

