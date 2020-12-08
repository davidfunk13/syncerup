import React, { useEffect } from 'react';
import IMessagesProps from './Messages.Types';

const Messages = ({ messages }: IMessagesProps) => {

    return (
        <div className={'messages-conatainer'}>
            {messages.map(message => {
                return <p>{message.username}:{message.message}</p>
            })}
        </div>
    );
};

export default Messages;