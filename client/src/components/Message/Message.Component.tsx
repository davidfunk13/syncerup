import React, { useState } from 'react';
import IMessageProps from './Message.Types';

import './Message.css'

const Message = ({ message, username }: IMessageProps) => {
    let isMe = false;

    if (message.username === username) {
        isMe = true;
    }

    return (
        <div className={"message-container"}>
            <div className={`username ${isMe ? 'text-right' : 'text-left'}`}>{message.username}:</div> <div className={`message ${isMe ? 'me' : 'you'}`}>{message.message}</div>
        </div>
    );
};

export default Message;