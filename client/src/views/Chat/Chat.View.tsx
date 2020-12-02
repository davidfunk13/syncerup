import React, { useEffect, useState } from 'react';
import IChatProps from './Chat.Types';
import io, { Socket } from 'socket.io-client';
import { joinRoom } from '../../utils/userFunctions';
import { useHistory } from 'react-router-dom';
import { User } from '../../App.Types';
// import { connectionString } from '../../utils/connectionString';
import checkLocalStorage from '../../utils/checkUserStorage';

const socket = io();

const initialUserState: User = { username: undefined, room: undefined };

const Chat = ({ }: IChatProps) => {
    const [user, setUser] = useState<User>(initialUserState);

    const history = useHistory();

    function newSession() {
        localStorage.removeItem('user');

        history.push('/');
    }

    useEffect(() => {
        socket.on('notification', (notification: any) => console.log({ notification }));

        const userStorage: User = checkLocalStorage('user');

        if (!userStorage) {
            return history.push('/');
        }

        setUser(userStorage);

        if (userStorage.username && userStorage.room) {
            return joinRoom(socket, userStorage)
        }

        console.error('either user or room is blank');

        history.push('/');

        //cleanup
        return () => {
            setUser(initialUserState);
            socket.off('notification');
        }
    }, []);

    return (
        <div className="join-container">
            <button onClick={newSession}>New Session</button>
            <h1>Chat</h1>
            <div className="room-info">
                <p>Username: {user.username}</p>
                <p>Room: {user.room}</p>
            </div>
            {/* {user ? <ChatBox /> : <p>Loading...</p>} */}
        </div>
    );
};

export default Chat;