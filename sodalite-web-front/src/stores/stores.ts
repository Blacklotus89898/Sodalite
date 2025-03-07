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



// Define the interface for the Profile state
export interface ProfileState {
    favoriteApp: string[];
    username: string;
    theme: string;
    chroma: string;
    streak: number;
  }
  
  // Define the default profile state
  
  // Create the Profile Context
  export const ProfileContext = createContext<{
    profile: ProfileState;
    setProfile: React.Dispatch<React.SetStateAction<ProfileState>>;
  }>({
    profile: {
        favoriteApp: [],
        username: '',
        theme: '',
        chroma: '',
        streak: 0,
    },
    setProfile: () => {},
  });


export  interface StreakContextProps {
    streak: number;
    heatmap: { [date: string]: number };
    activityDates: string[];
    setActivityDates: React.Dispatch<React.SetStateAction<string[]>>;
  }
  
export  const StreakContext = createContext<StreakContextProps | undefined>(undefined);
  