import React, { createContext, useContext, useMemo } from 'react';
import useCartBase from './useCartBase';

const SalesContext = createContext();

const SalesProvider = ({ children }) => {
  const { cartState, addToCart, removeFromCart, updateProductQuantity, emptyCart } = useCartBase('sales_cart');

  const { cartTotal, totalQuantity, totalProfit } = useMemo(() => {
    return cartState.reduce(
      (acc, item) => {
        const itemTotal = item.price * item.quantity;
        const itemProfit = (item.price - item.cost) * item.quantity;

        acc.cartTotal += itemTotal;
        acc.totalQuantity += item.quantity;
        acc.totalProfit += itemProfit;

        return acc;
      },
      { cartTotal: 0, totalQuantity: 0, totalProfit: 0 }
    );
  }, [cartState]);

  return (
    <SalesContext.Provider
      value={{
        cartState,
        cartTotal,
        totalQuantity,
        totalProfit,
        addToCart,
        removeFromCart,
        updateProductQuantity,
        emptyCart,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};

export { SalesProvider, useSales };
