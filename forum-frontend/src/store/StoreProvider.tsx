import { createContext, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

export const ThemeContext = createContext<any>(null);
export const UserContext = createContext<any>(null);
export const SocketContext = createContext<any>(null);
export const socket = socketIOClient(SOCKET_URL);

const StoreProvider: React.FC = ({children}): JSX.Element => {
    const [theme, setTheme] = useState<string>('dark');
    const [user, setUser] = useState<any>({
        role: '',
        notifications: []
    });

    useEffect(()=> {
        setUser(JSON.parse(sessionStorage.getItem("currentUser") || "null"))
    },[]);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
                <UserContext.Provider value={{user, setUser}}>
                    <SocketContext.Provider value={socket}>
                        {children}
                    </SocketContext.Provider>
                </UserContext.Provider>
        </ThemeContext.Provider>

    )
}

export default StoreProvider;