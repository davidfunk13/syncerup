import React, { useEffect, useState } from 'react';
import IChatProps from './Chat.Types';
import io from 'socket.io-client';
import { joinRoom } from '../../utils/userFunctions';
import { useHistory } from 'react-router-dom';
import { User } from '../../App.Types';
import checkLocalStorage from '../../utils/checkUserStorage';
import Input from '../../components/Input/Input.Component';

const socket = io();

const initialUserState: User = { username: undefined, room: undefined };

const Chat = ({ }: IChatProps) => {
    const [user, setUser] = useState<User>(initialUserState);
    const [message, setMessage] = useState<string>('');

    const history = useHistory();

    function newSession() {
        localStorage.removeItem('user');

        history.push('/');
    }

    function sendMessage(event: { preventDefault: () => void; }) {
        event.preventDefault();

        socket.emit('userSendMessage', message, () => setMessage(''));
    }

    useEffect(() => {
        console.log('mount');

        socket.on('notification', (notification: any) => console.log(notification));
        socket.on('serverMessage', ({ user, message }: any) => console.log({ user, message }));
        socket.on('roomInfo', ({ type, room, users }: any) => console.log({ type, room, users }));
        socket.on('broadcastMessage', ({ type, user, message }: any) => console.log({ type, user, message }));

        const userStorage: User = checkLocalStorage('user');

        if (userStorage) {
            if (userStorage.username && userStorage.room) {
                setUser(userStorage);
                return joinRoom(socket, userStorage)
            }
        }

        history.push('/');

        return () => {
            console.log('cleanup');

            setUser(initialUserState);
            socket.off('notification');
            socket.off('serverMessage');
            socket.off('roomInfo');
        };

    }, []);

    return (
        <div className="join-container">
            <button onClick={newSession}>New Session</button>
            <h1>Chat</h1>
            <div className="room-info">
                <p>Username: {user.username}</p>
                <p>Room: {user.room}</p>
            </div>
            <Input message={message} sendMessage={sendMessage} setMessage={setMessage} />
            {/* {user ? <ChatBox /> : <p>Loading...</p> } */}
        </div>
    );
};

export default Chat;