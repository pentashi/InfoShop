import React, { createContext, useState } from 'react';

// Create SharedContext
export const SharedContext = createContext();

// SharedProvider component
export const SharedProvider = ({ children }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);  // Shared customer state
    const [selectedVendor, setSelectedVendor] = useState(null);  // Shared Vendor state

    return (
      <SharedContext.Provider value={{selectedCustomer, setSelectedCustomer, selectedVendor, setSelectedVendor,}}>
        {children}
      </SharedContext.Provider>
    );
  };