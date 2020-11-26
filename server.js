const express = require('express');

const app = express();

const cors = require('cors');

const server = require('http').createServer(app);

const PORT = process.env.PORT | 3001;

const corsOptions = {
    origin: [`https://davidfunk13.github.io/`, `http://localhost:3001`],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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

server.listen(PORT, function () {
    console.log('Server listening on port ' + PORT)
});

app.get('/*', (req, res) => {
    res.send({ message: 'api is live.' })
})
