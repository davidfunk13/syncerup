import { User } from "../App.Types";

export function joinRoom(socket: any, user: User): void {
    if (!user) {
        return;
    }

    const { username, room } = user;

    socket.emit('joinRoom', { username, room }, (error: any) => {
        console.log('joined room');

        if (error) {
            return console.error(error);
        }
    });
};