const app = require('express')();

const server = require('http').createServer(app);

const path = require('path');

const {
    SOCKET_CONNECT,
    USER_JOIN_ROOM,
    SERVER_BROADCAST_USER_JOIN,
    SERVER_BROADCAST_USER_LEAVE,
    SERVER_BROADCAST_USER_MESSAGE,
    SERVER_BROADCAST_ROOM_INFO,
    USER_SEND_MESSAGE,
    SOCKET_DISCONNECT,
    SERVER_MESSAGE_USER_JOIN,
} = require('./emitterTypes');

const {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom,
    recieveMessage,
} = require('./utils/userFunctions');

const PORT = process.env.PORT || 3001;

app.use(require('express').json());

const options = {
    cors: {
        origin: '*',
    },
};

const io = require('socket.io')(server, options);

io.on(SOCKET_CONNECT, socket => {

    //listen for join
    socket.on(USER_JOIN_ROOM, ({ username, room, uuid }, cb) => {

        // add user to active users, return if err
        const { error, user } = addUser({
            id: socket.id,
            username,
            room,
            uuid
        });

        if (error) {
            return cb(error);
        }

        //join listed room;
        socket.join(user.room);

        //send admin message to user on Join;
        socket.emit(SERVER_MESSAGE_USER_JOIN, {
            type: SERVER_MESSAGE_USER_JOIN,
            user: 'server',
            message: `Welcome to room ${user.room}, ${user.username}.`
        });

        // send message to everyone else in the room (expect user ) saying user joined
        socket.broadcast.to(user.room).emit(SERVER_BROADCAST_USER_JOIN, {
            type: SERVER_BROADCAST_USER_JOIN,
            user: 'server',
            message: `${user.username} has joined the room.`
        });

        // send room info to everyone in the room including user;
        io.to(user.room).emit(SERVER_BROADCAST_ROOM_INFO, {
            type: SERVER_BROADCAST_ROOM_INFO,
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        cb();
    });

    socket.on(USER_SEND_MESSAGE, ({ message }, cb) => {
        //send a users message to everyone in the room
        let user = getUser(socket.id)[0];

        io.to(user.room).emit(SERVER_BROADCAST_USER_MESSAGE, {
            type: SERVER_BROADCAST_USER_MESSAGE,
            user: user.name, message: message
        });

        cb();
    });

    socket.on(SOCKET_DISCONNECT, () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit(SERVER_BROADCAST_USER_LEAVE, {
                user: 'server',
                message: `${user.name} left.`
            });

            io.to(user.room).emit(SERVER_BROADCAST_ROOM_INFO, {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
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
