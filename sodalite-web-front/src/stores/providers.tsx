import { useState, ReactNode, useEffect } from "react";
import { UserContext, ThemeContext, ServerContext, ProfileContext, ProfileState } from "./stores";

// User Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string>("John Doe");
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// Theme Provider Component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<string>("light");
    const [chroma, setChroma] = useState<string>("#ff0000");
    return <ThemeContext.Provider value={{ theme, setTheme, chroma, setChroma }}>{children}</ThemeContext.Provider>;
};

// Server Provider Component
export const ServerProvider = ({ children }: { children: ReactNode }) => {
    const [address, setAddressState] = useState<{ [key: string]: string }>({
        websocketServer: 'ws://192.168.0.103:8080', // Example default address
        fileServer: 'http://192.168.0.103:8081', // Another example default address
    });

    const setAddress = (key: string, address: string) =>
        setAddressState((prev) => ({ ...prev, [key]: address }));

    return <ServerContext.Provider value={{ address, setAddress }}>{children}</ServerContext.Provider>;
};

// Profile Provider Component
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<ProfileState>({
        favoriteApp: [],
        username: '',
        theme: 'light', // default theme is light
        chroma: '#4caf50', // default chroma color
        streak: 0,
    });

    // Load the profile from localStorage or API on initial render
    useEffect(() => {
        const savedProfile = localStorage.getItem('profile');
        if (savedProfile) {
            try {
                setProfile(JSON.parse(savedProfile));
            } catch (error) {
                console.error('Error parsing saved profile:', error);
            }
        }
    }, []);

    // Save the profile to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('profile', JSON.stringify(profile));
    }, [profile]);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

// Wrapping all providers together
export const AppProviders = ({ children }: { children: ReactNode }) => (
    <ProfileProvider>
        <ServerProvider>
            <UserProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </UserProvider>
        </ServerProvider>
    </ProfileProvider>
);



// Improve with
// import { createContext, useReducer, ReactNode, useContext, Dispatch } from 'react';

// // Define the initial state and action types
// type State = {
//   user: string;
//   theme: string;
//   address: { [key: string]: string };
// };

// const initialState: State = {
//   user: 'John Doe',
//   theme: 'light',
//   address: {
//     websocketServer: 'ws://192.168.0.103:8080',
//     fileServer: 'http://192.168.0.103:8081',
//   },
// };

// type Action =
//   | { type: 'SET_USER'; payload: string }
//   | { type: 'SET_THEME'; payload: string }
//   | { type: 'SET_ADDRESS'; payload: { key: string; address: string } };

// // Create a reducer function
// const reducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case 'SET_USER':
//       return { ...state, user: action.payload };
//     case 'SET_THEME':
//       return { ...state, theme: action.payload };
//     case 'SET_ADDRESS':
//       return {
//         ...state,
//         address: { ...state.address, [action.payload.key]: action.payload.address },
//       };
//     default:
//       return state;
//   }
// };

// // Create the context
// const GlobalContext = createContext<{
//   state: State;
//   dispatch: Dispatch<Action>;
// }>({ state: initialState, dispatch: () => undefined });

// export const GlobalProvider = ({ children }: { children: ReactNode }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   return (
//     <GlobalContext.Provider value={{ state, dispatch }}>
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// // Custom hooks to use the context
// export const useGlobalState = () => useContext(GlobalContext).state;
// export const useGlobalDispatch = () => useContext(GlobalContext).dispatch;

// // Wrapping the app
// export const AppProviders = ({ children }: { children: ReactNode }) => (
//   <GlobalProvider>{children}</GlobalProvider>
// );
