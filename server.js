const express = require('express');

const app = express();

const server = require('http').createServer(app);

const PORT = process.env.PORT | 3001;

const cors = require('cors');

app.use(cors());

app.use(express.json());

const options = {
    cors: {
        origin: '*'
    }
};

const io = require('socket.io')(server, options);

function recieveMessage (socket, message) {
    socket.emit('notification', { message: 'message recieved', data: message })
}

io.on('connection', socket => {
    socket.emit('notification', { message: 'connected' });

    socket.on('message', data => recieveMessage(socket, data));

    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
    })
});

server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
});