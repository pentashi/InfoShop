import React, { createContext, useState } from 'react';

// Create SharedContext
export const SharedContext = createContext();

// SharedProvider component
export const SharedProvider = ({ children }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);  // Shared customer state

    return (
      <SharedContext.Provider value={{selectedCustomer, setSelectedCustomer,}}>
        {children}
      </SharedContext.Provider>
    );
  };