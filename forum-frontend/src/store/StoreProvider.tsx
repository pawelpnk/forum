import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext<any>(null);
export const UserContext = createContext<any>(null);

const StoreProvider: React.FC = ({children}): JSX.Element => {
    const [theme, setTheme] = useState<string>('dark');
    const [user, setUser] = useState<any>('');

    useEffect(()=> {
        setUser(JSON.parse(sessionStorage.getItem("currentUser") || "null"))
    },[]);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
                <UserContext.Provider value={{user, setUser}}>
                    {children}
                </UserContext.Provider>
        </ThemeContext.Provider>

    )
}

export default StoreProvider;