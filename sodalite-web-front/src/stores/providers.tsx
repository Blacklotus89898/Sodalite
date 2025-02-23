import { useState, ReactNode } from "react";
import { UserContext, ThemeContext, ServerContext } from "./stores";

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState("John Doe");
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState("light");
    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const ServerProvider = ({ children }: { children: ReactNode }) => {
    const [address, setAddressState] = useState<{ [key: string]: string }>({
        websocketServer: 'ws://192.168.0.103:8080', // Example default address
        fileServer: 'http://192.168.0.103:8081', // Another example default address
    });
    const setAddress = (key: string, address: string) => setAddressState((prev) => ({ ...prev, [key]: address }));
    return <ServerContext.Provider value={{ address, setAddress }}>{children}</ServerContext.Provider>;
};

// Wrapping the app
export const AppProviders = ({ children }: { children: ReactNode }) => (
    <ServerProvider>
        <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
        </UserProvider>
    </ServerProvider>
);
