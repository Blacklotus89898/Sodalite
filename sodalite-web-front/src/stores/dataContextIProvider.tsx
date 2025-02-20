import React, { useState } from 'react';
import { DataContext, DataContextType } from './dataContext'; // Adjust the import path as necessary

const DataContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string>('Shared content');

  const value: DataContextType = {
    message,
    setMessage,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;