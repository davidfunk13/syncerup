const users = [];

function addUser({ id, username, room, uuid }) {
    const user = { id, username, room, uuid };
    //parse input of room and name
    const roomFormatted = room.trim().toLowerCase();
    const nameFormatted = username.trim().toLowerCase();

    //see if theres any existing users
    const existingUsers = users.filter((user) => user.username === username && user.room === room);

    console.log({ existingUsers })

    if (!username || !room) {
        return { error: 'Name and room are required' }
    }

    //if there are, reject, and return and error message.
    if (existingUsers.length) {
        //if uuid is the same, 
        removeUser(existingUsers[0].id);
    }


    console.log(`adding user ${username} with socket id ${id} and uuid of ${uuid}`);
    // if the user doesnt yet exist, push to user array.
    users.push(user);

    return { user };
}

function removeUser(id, notifyUser) {
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex !== -1) {
        const newUserArr = users.splice(userIndex, 1);

        console.log(`removing user ${id}, new user array:`, newUserArr);
        return newUserArr;
    }

    console.log('not successfull or doesnt exist.');
}

function getUser(id) {
    return users.filter((user) => user.id === id);
}

function getUsersInRoom(room) {
    return users.filter(user => user.room === room);
}


module.exports = { addUser, removeUser, getUser, getUsersInRoom };