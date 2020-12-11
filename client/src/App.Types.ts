export type User = {
    id?: string
    username?: string
    room?: string
};

export type Message = {
    username: string
    message: string
}

export type UserStorage = {
    username: string
    room: string
}