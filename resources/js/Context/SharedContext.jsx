import React, { createContext, useState } from 'react';

// Create SharedContext
export const SharedContext = createContext();

// SharedProvider component
export const SharedProvider = ({ children }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);  // Shared customer state
    const [selectedVendor, setSelectedVendor] = useState(null);  // Shared Vendor state

    const [cartItemModalOpen, setCartItemModalOpen] = useState(false)
    const [selectedCartItem, setSelectedCartItem] = useState(null)

    return (
        <SharedContext.Provider
            value={{
                selectedCustomer,
                setSelectedCustomer,
                selectedVendor,
                setSelectedVendor,
                cartItemModalOpen,
                setCartItemModalOpen,
                selectedCartItem,
                setSelectedCartItem
            }}
        >
            {children}
        </SharedContext.Provider>
    );
  };