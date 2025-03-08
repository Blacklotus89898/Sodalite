// should be called context.ts

import { createContext } from 'react';
// Store for Theme
type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
    chroma: string;
    setChroma: (chroma: string) => void;
};

// Initialize context with `undefined` as before
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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



// Define the interface for the actual profile data
export interface ProfileState {
  username: string;
  servers: {
    [key: string]: string;
  };
  streak: number;
  activityDates: string[];
  theme: string;
  chroma: string;
}

// Define the interface for the profile context (which includes the state + updater)
interface ProfileContextType {
  currentProfile: ProfileState;
  setCurrentProfile: (profile: ProfileState) => void;
}

// Default profile state (optional - if you want to initialize with defaults)
const defaultProfile: ProfileState = {
  username: "John Doe",
  servers: {
    websocketServer: "ws://192.168.0.103:8080",
    fileServer: "http://192.168.0.103:8081"
  },
  streak: 0,
  activityDates: [],
  theme: "dark",
  chroma: "#00ced1"
};

// Create the Profile Context
export const ProfileContext = createContext<ProfileContextType>({
  currentProfile: defaultProfile,
  setCurrentProfile: () => {},
});


export  interface StreakContextProps {
    streak: number;
    heatmap: { [date: string]: number };
    activityDates: string[];
    setActivityDates: React.Dispatch<React.SetStateAction<string[]>>;
  }
  
export  const StreakContext = createContext<StreakContextProps | undefined>(undefined);
  