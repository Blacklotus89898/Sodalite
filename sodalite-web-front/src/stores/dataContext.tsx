import React, { useContext } from 'react';

export interface DataContextType {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const DataContext = React.createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error('useData must be used within a DataContextProvider');
    }
    return context;
  };