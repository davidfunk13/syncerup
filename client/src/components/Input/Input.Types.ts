import { Dispatch, SetStateAction } from "react";

export default interface IInputProps {
    message: string
    sendMessage: (event: { preventDefault: () => void; }) => void
    setMessage: Dispatch<SetStateAction<string>>
}