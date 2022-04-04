import { createContext, useState } from "react";

export const StoreContext = createContext<any>(null);

const StoreProvider: React.FC = ({children}): JSX.Element => {
    const [theme, setTheme] = useState<string>('dark');

    return (
        <StoreContext.Provider value={{theme, setTheme}}>
            {children}
        </StoreContext.Provider>

    )
}

export default StoreProvider;