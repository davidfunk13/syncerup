import React, { createRef, Fragment, useEffect } from 'react';
import IMessagesProps from './Messages.Types';

import './Messages.css';
import Message from '../Message/Message.Component';
import { UserStorage } from '../../App.Types';

const Messages = ({ messages }: IMessagesProps) => {
    const bottomRef = createRef<any>();

    function scrollToBottom() {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const user: UserStorage = JSON.parse(localStorage.getItem('user') as unknown as string);

    useEffect(() => {
        scrollToBottom();
    }, [bottomRef]);

    return (
        <div className={'messages-container'}>
            {messages.map(message => {
                return (
                    <Message username={user.username} message={message} />
                )
            })}
            <div ref={bottomRef} />
        </div>
    );
};

export default Messages;