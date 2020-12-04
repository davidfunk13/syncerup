import React from 'react';
import IInputProps from './Input.Types';

const Input = ({ message, sendMessage, setMessage }: IInputProps) => {
    return (
        <form>
            <input onChange={({ target: { value } }) => setMessage(value)} value={message} placeholder={'Message'} type="text" />
            <button onClick={(e) => sendMessage(e)}>Send</button>
        </form >
    );
};

export default Input;