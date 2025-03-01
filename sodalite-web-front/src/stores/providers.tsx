import { useState, ReactNode } from "react";
import { UserContext, ThemeContext, ServerContext } from "./stores";

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState("John Doe");
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState("light");
    const [chroma, setChroma] = useState<string>("#ff0000"); 
    return <ThemeContext.Provider value={{ theme, setTheme, chroma, setChroma }}>{children}</ThemeContext.Provider>;
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
