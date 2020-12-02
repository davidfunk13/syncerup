const app = require('express')();

const server = require('http').createServer(app);

const path = require('path');

const PORT = process.env.PORT || 3001;

app.use(require('express').json());

const options = {
    cors: {
        origin: '*'
    }
};

const io = require('socket.io')(server, options);

function recieveMessage(socket, message) {
    socket.emit('notification', { message: 'message recieved', data: message })
}

io.on('connection', socket => {
    socket.emit('notification', { message: 'connected' });

    socket.on('message', data => recieveMessage(socket, data));

    socket.on('joinRoom', ({ username, room }) => recieveMessage(socket, ({ username, room })));

    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
    })
});

if (process.env.NODE_ENV === 'production') {
    //if you have weird errors with storing images etc in static dir this is why. back out a dir.
    app.use(require('express').static("client/build"));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
};

server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
});
