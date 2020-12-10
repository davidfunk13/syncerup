import React, { createRef, useEffect } from 'react';
import IMessagesProps from './Messages.Types';

import './Messages.css';

const Messages = ({ messages }: IMessagesProps) => {
    const bottomRef = createRef<any>();

    function scrollToBottom() {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [bottomRef]);

    return (
        <div className={'messages-container'}>
            {messages.map(message => {
                return <p>{message.username}: {message.message}</p>
            })}
            <div ref={bottomRef} />
        </div>
    );
};

export default Messages;