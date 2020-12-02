const users = [];

function addUser({ id, name, room }) {
    //parse input of room and name
    const roomFormatted = room.trim().toLowerCase();
    const nameFormatted = room.trim().toLowerCase();

    //see if theres any existing users
    const existingUsers = users.filter((user) => user.name === nameFormatted && user.room === roomFormatted);

    if (!name || !room) {
        return { error: 'Name and room are required' }
    }

    //if there are, reject, and return and error message.
    if (existingUsers.length) {
        return { error: 'This user already exists.' };
    }

    // if the user doesnt yet exist, push to user array.
    const newUser = { id, name, room };

    users.push(newUser);

    return { newUser };
}

function removeUser(id) {
    return users.filter(user => user.id !== id);
}

function getUser(id) {
    return users.filter((user) => user.id === id);
}

function getUsersInRoom(room) {
    return users.filter(user => user.room === room);
}

function recieveMessage(socket, message) {
    socket.emit('notification', { message: 'message recieved', data: message })
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, recieveMessage };