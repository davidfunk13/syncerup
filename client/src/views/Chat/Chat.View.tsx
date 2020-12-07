import React, { useEffect, useState } from 'react';
import IChatProps from './Chat.Types';
import io from 'socket.io-client';
import { joinRoom } from '../../utils/userFunctions';
import { useHistory } from 'react-router-dom';
import { User } from '../../App.Types';
import checkLocalStorage from '../../utils/checkUserStorage';
import Input from '../../components/Input/Input.Component';
import emitterTypes from '../../utils/emitterTypes';

const { SERVER_BROADCAST_ROOM_INFO, USER_SEND_MESSAGE } = emitterTypes;

const socket = io();

const initialUserState: User = { username: undefined, room: undefined, uuid: undefined };

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
        console.log(user)
        socket.emit(USER_SEND_MESSAGE,
            { message, user }, () => setMessage(''));
    }

    useEffect(() => {
        console.log('mount');

        socket.on(SERVER_BROADCAST_ROOM_INFO,
            ({ type, room, users }: any) => console.log({ type, room, users })
        );

        const userStorage: User = checkLocalStorage('user');

        if (userStorage) {
            if (userStorage.username && userStorage.room && userStorage.uuid) {
                setUser(userStorage);
                console.log({ userStorage })
                return joinRoom(socket, userStorage)
            }
        }

        history.push('/');

        return () => {
            console.log('cleanup');
            socket.off(USER_SEND_MESSAGE);
            socket.off(SERVER_BROADCAST_ROOM_INFO);

            setUser(initialUserState);
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