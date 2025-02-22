import { createContext } from 'react';
// Store for Theme
export const ThemeContext = createContext<{ theme: string; setTheme: (theme: string) => void } | undefined>(undefined);

// Store for User Data
export const UserContext = createContext<{ user: string; setUser: (user: string) => void } | undefined>(undefined);

// Store for Server addresses
export const ServerContext = createContext<{
    address: { [key: string]: string };
    setAddress: (key: string, address: string) => void;
}>({
    address: {},
    setAddress: () => {},
});