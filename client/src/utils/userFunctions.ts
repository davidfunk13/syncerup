import { User } from "../App.Types";
import emitterTypes from './emitterTypes';

export function joinRoom(socket: any, user: User): void {
    if (!user) {
        return;
    }

    const { username, room } = user;

    socket.emit(emitterTypes.USER_JOIN_ROOM, { username, room }, (error: any) => {
        console.log('joined room');

        if (error) {
            return console.error(error);
        }
    });
};