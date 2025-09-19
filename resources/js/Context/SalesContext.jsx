import React, { createContext, useContext, useMemo, useState } from 'react';
import useCartBase from './useCartBase';

const SalesContext = createContext();

const SalesProvider = ({ children, cartType = 'sales_cart' }) => {

  const { cartState, addToCart, removeFromCart, updateProductQuantity, emptyCart, updateCartItem, holdCart, setHeldCartToCart, removeHeldItem } = useCartBase(cartType);

  const { cartTotal, totalQuantity, totalProfit } = useMemo(() => {
    return cartState.reduce(
      (acc, item) => {
        const quantity = Number(item.quantity)
        const cost = Number(item.cost)
        const unitPrice = Number(item.price);
        const unitDiscount = Number(item.discount || 0);
        const flatDiscount = Number(item.flat_discount || 0);

        const discountedUnitPrice = unitPrice - unitDiscount;
        const itemTotal = discountedUnitPrice * quantity - flatDiscount;
        const itemProfit = (discountedUnitPrice - cost) * quantity - flatDiscount;

        acc.cartTotal += itemTotal;
        acc.totalQuantity += quantity;
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
        updateCartItem,
        holdCart,
        setHeldCartToCart,
        removeHeldItem,
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
