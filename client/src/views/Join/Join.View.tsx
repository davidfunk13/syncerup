import { useEffect, useState } from 'react';
import IJoinProps from './Join.Types';
import { useHistory } from 'react-router-dom';

import './Join.css';

const Join = ({ }: IJoinProps) => {
    const [username, setUsername] = useState<string>('');
    const [room, setRoom] = useState<string>('');

    const history = useHistory();

    function submitJoinForm(event: any): void {
        event.preventDefault();

        localStorage.setItem('user', JSON.stringify({ username, room }));
        history.push('/chat');
    };

    useEffect(() => {
        return () => {
            setUsername('');
            setRoom('');
        }
    }, []);

    return (
        <div className="join-container">
            <h1>Join a Room</h1>
            <form onSubmit={submitJoinForm}>
                <label>Username:</label>
                <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label>Room:</label>
                <input required type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
                <input className="submit-button" type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Join;