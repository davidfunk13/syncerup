const app = require('express')();

const server = require('http').createServer(app);

const path = require('path');

const { getUsersInRoom, recieveMessage, addUser, getUser, removeUser } = require('./utils/userFunctions');

const PORT = process.env.PORT || 3001;

app.use(require('express').json());

const options = { cors: { origin: '*' } };

const io = require('socket.io')(server, options);

io.on('connection', socket => {
    // socket.emit('notification', { message: 'connected' });

    //listen for join
    socket.on('joinRoom', ({ username, room, uuid }, cb) => {
        // add user to active users, return if err
        const { error, user } = addUser({ id: socket.id, username, room, uuid });

        if (error) {
            return cb(error);
        }

        console.log(user)
        //join listed room;
        socket.join(user.room);

        //send admin message to user;
        socket.emit('serverMessage', { type: 'serverMessage', user: 'server', message: `Welcome to room ${user.room}, ${user.username}.` });

        // send message to everyone else in the room except user
        socket.broadcast.to(user.room).emit('serverMessage', { type: 'serverMessage', user: 'server', message: `${user.username} has joined the room.` });

        // send to everyone in the room including user;
        io.to(user.room).emit('roomInfo', { type: 'roomInfo', room: user.room, users: getUsersInRoom(user.room) });

        cb();
    });

    socket.on('userSendMessage', ({ message }, cb) => {
        //send a users message to everyone in the room
        let user = getUser(socket.id)[0];

        console.log({ message, user });

        io.to(user.room).emit('broadcastMessage', { type: 'broadcastMessage', user: user.name, message: message });

        cb();
    });

    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('serverMessage', { user: 'server', message: `${user.name} left.` });
            io.to(user.room).emit('roomInfo', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
});

if (process.env.NODE_ENV === 'production') {
    app.use(require('express').static(path.join(__dirname, '../client/build/')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
};

server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});
