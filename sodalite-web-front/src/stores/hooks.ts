import { useContext } from "react";
import { ThemeContext, UserContext, ServerContext } from "./stores";

// Custom Hooks
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};

export const useServer = () => {
    const context = useContext(ServerContext);
    if (!context) throw new Error("useServer must be used within a ServerProvider");
    return context;
};
