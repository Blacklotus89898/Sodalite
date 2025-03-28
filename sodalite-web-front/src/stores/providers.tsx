import { useState, ReactNode, useEffect } from "react";
import { UserContext, ThemeContext, ServerContext, ProfileContext, ProfileState, StreakContext, EventContext, LogContext, LogType } from "./stores";

// User Provider Component -- not used in the example
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string>("John Doe");
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

// Event Provider Component 
export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<{ [key: string]: boolean }>({
        header: false,
        lsidebar: true,
        rsidebar: false,
    });

    const setEvent = (key: string, value: boolean) => {
        setEvents((prev) => ({ ...prev, [key]: value }));
    };

    return <EventContext.Provider value={{ events, setEvent }}>{children}</EventContext.Provider>;
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
        websocketServer: 'ws://192.168.0.111:8080', // Example default address
        fileServer: 'http://127.0.0.1:8081', // Another example default address
    });

    const setAddress = (key: string, address: string) =>
        setAddressState((prev) => ({ ...prev, [key]: address }));

    return <ServerContext.Provider value={{ address, setAddress }}>{children}</ServerContext.Provider>;
};

// Profile Provider Component
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentProfile, setCurrentProfile] = useState<ProfileState>(
        // Default profile state (optional - if you want to initialize with defaults)
        {
            username: "John Doe",
            servers: {
                websocketServer: "ws://192.168.0.103:8080",
                fileServer: "http://192.168.0.103:8081",
            },
            streak: 0,
            activityDates: [],
            theme: "dark",
            chroma: "#00ced1"
        }
    );

    // Load the profile from localStorage or API on initial render
    useEffect(() => {
        const savedProfile = localStorage.getItem('profile');
        if (savedProfile) {
            try {
                setCurrentProfile(JSON.parse(savedProfile));
            } catch (error) {
                console.error('Error parsing saved profile:', error);
            }
        }
    }, []);

    // Save the profile to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('profile', JSON.stringify(currentProfile));
    }, [currentProfile]);

    return (
        <ProfileContext.Provider value={{ currentProfile, setCurrentProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};
export const StreakProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activityDates, setActivityDates] = useState<string[]>([]);
    const [streak, setStreak] = useState<number>(0);
    const [heatmap, setHeatmap] = useState<{ [date: string]: number }>({});

    useEffect(() => {
        const today = new Date().setHours(0, 0, 0, 0);
        let currentStreak = 0;
        const streakData: { [date: string]: number } = {};

        for (let i = activityDates.length - 1; i >= 0; i--) {
            const activityDate = new Date(activityDates[i]).setHours(0, 0, 0, 0);
            if (activityDate === today - currentStreak * 86400000) {
                currentStreak++;
            } else {
                break;
            }
        }

        activityDates.forEach(date => {
            streakData[date] = (streakData[date] || 0) + 1;
        });

        setStreak(currentStreak);
        setHeatmap(streakData);
    }, [activityDates]);

    return (
        <StreakContext.Provider value={{ streak, heatmap, activityDates, setActivityDates }}>
            {children}
        </StreakContext.Provider>
    );
};


export const LogProvider = ({ children }: { children: ReactNode }) => {
    const [logs, setLogs] = useState<LogType[]>([]);
    const addLogs = (newLogs: LogType[]) => setLogs((prev) => [...prev, ...newLogs]);
    return <LogContext.Provider value={{ logs, addLogs }}>{children}</LogContext.Provider>;
}

// May consider a modular state to add to a plugin context

// Wrapping all providers together
export const AppProviders = ({ children }: { children: ReactNode }) => (
    <LogProvider>
        <EventProvider>
            <StreakProvider>
                <ProfileProvider>
                    <ServerProvider>
                        <UserProvider>
                            <ThemeProvider>{children}</ThemeProvider>
                        </UserProvider>
                    </ServerProvider>
                </ProfileProvider>
            </StreakProvider>
        </EventProvider>
    </LogProvider>
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
