import { createContext, useState } from "react";

export const ThemeContext = createContext<any>(null);
export const UserContext = createContext<any>(null);
export const SectionContext = createContext<any>(null);

interface SectionType {
    id: string;
    sectionName: string;
}

const StoreProvider: React.FC = ({children}): JSX.Element => {
    const [theme, setTheme] = useState<string>('dark');
    const [user, setUser] = useState<any>('');
    const [currentSectionName, setCurrentSectionName] = useState<SectionType>({id: '', sectionName: ''});

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <SectionContext.Provider value={{currentSectionName, setCurrentSectionName}}>
                <UserContext.Provider value={{user, setUser}}>
                    {children}
                </UserContext.Provider>
            </SectionContext.Provider>
        </ThemeContext.Provider>

    )
}

export default StoreProvider;