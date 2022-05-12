import { createContext, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

const darkTheme = {
    backgroundColor: 'black',
    textColor: 'text-light',
    border: 'border-white',
    colorMyMessage: 'bg-success',
    buttonNewOption: 'outline-light',
    buttonToLoginAndRegister: 'outline-dark',
    tableColor: 'dark'
}

const lightTheme = {
    backgroundColor: 'white',
    textColor: 'text-dark',
    border: 'border-dark',
    colorMyMessage: 'bg-light',
    buttonNewOption: 'outline-dark',
    buttonToLoginAndRegister: 'outline-light',
    tableColor: ''
}

export const ThemeContext = createContext<any>(null);
export const UserContext = createContext<any>(null);
export const SocketContext = createContext<any>(null);
export const socket = socketIOClient(SOCKET_URL);

const StoreProvider: React.FC = ({children}): JSX.Element => {
    const [theme, setTheme] = useState<object>(darkTheme);
    const [user, setUser] = useState<any>({
        role: '',
        notifications: []
    });

    useEffect(()=> {
        setUser(JSON.parse(sessionStorage.getItem("currentUser") || "null"))
    },[]);

    return (
        <ThemeContext.Provider value={{theme, setTheme, lightTheme, darkTheme}}>
                <UserContext.Provider value={{user, setUser}}>
                    <SocketContext.Provider value={socket}>
                        {children}
                    </SocketContext.Provider>
                </UserContext.Provider>
        </ThemeContext.Provider>

    )
}

export default StoreProvider;