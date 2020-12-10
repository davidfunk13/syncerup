import React, { useEffect, useState } from 'react';
import IChatProps from './Chat.Types';
import io from 'socket.io-client';
import { joinRoom } from '../../utils/userFunctions';
import { useHistory } from 'react-router-dom';
import { User } from '../../App.Types';
import checkLocalStorage from '../../utils/checkUserStorage';
import Input from '../../components/Input/Input.Component';
import Messages from '../../components/Messages/Messages.Component';
import emitterTypes from '../../utils/emitterTypes';

const socket = io();

const initialUserState: User = {
    username: undefined,
    room: undefined,
    uuid: undefined,
};

const Chat = ({ }: IChatProps) => {
    const [user, setUser] = useState<User>(initialUserState);

    const [message, setMessage] = useState<string>('');

    const [messages, setMessages] = useState<{ type: string, username: string, message: string }[]>([]);

    const history = useHistory();

    function newSession() {
        localStorage.removeItem('user');

        history.push('/');
    }

    function sendMessage(event: { preventDefault: () => void; }) {
        event.preventDefault();

        socket.emit(emitterTypes.USER_SEND_MESSAGE, { message, user }, () => setMessage(''));
    }

    useEffect(() => {
        console.log('mount');

        socket.on(emitterTypes.SERVER_BROADCAST_ROOM_INFO,
            ({ type, room, users }: any) => console.log({ type, room, users })
        );

        socket.on(emitterTypes.SERVER_BROADCAST_USER_JOIN,
            ({ type, username, message }: any) => setMessages(messages => [...messages, { type, username, message }])
        );

        socket.on(emitterTypes.SERVER_BROADCAST_USER_LEAVE,
            ({ type, username, room, message }: any) => setMessages(messages => [...messages, { type, username, room, message }])
        );

        socket.on(emitterTypes.SERVER_BROADCAST_USER_MESSAGE,
            ({ type, username, message }: any) => {
                const item = { type, username, message };
                setMessages(messages => [...messages, item]);
            }
        );

        const userStorage: User = checkLocalStorage('user');

        if (userStorage) {
            if (userStorage.username && userStorage.room && userStorage.uuid) {
                setUser(userStorage);

                return joinRoom(socket, userStorage)
            }
        }

        history.push('/');

        return () => {
            console.log('cleanup');
            socket.off(emitterTypes.USER_SEND_MESSAGE);
            socket.off(emitterTypes.SERVER_BROADCAST_USER_MESSAGE);
            socket.off(emitterTypes.SERVER_BROADCAST_ROOM_INFO);
            socket.disconnect();
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
            <Messages messages={messages} />
            <Input message={message} sendMessage={sendMessage} setMessage={setMessage} />
            {/* {user ? <ChatBox /> : <p>Loading...</p> } */}
        </div>
    );
};

export default Chat;