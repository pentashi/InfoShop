import { useReducer, useEffect, useMemo } from 'react';

// Define a generic cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const cart = [...state];
      const existingProductIndex = cart.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.batch_number === action.payload.batch_number
      );

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity =
          parseFloat(cart[existingProductIndex].quantity) + 1;
      } else {
        const productToAdd = { ...action.payload, quantity: action.payload.quantity };
        cart.push(productToAdd);
      }

      return cart;
    }

    case 'REMOVE_FROM_CART': {
      return state.filter(
        (item) =>
          !(item.id === action.payload.id && item.batch_number === action.payload.batch_number)
      );
    }

    case 'UPDATE_PRODUCT_QUANTITY': {
      const cart = [...state];
      const existingProductIndex = cart.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.batch_number === action.payload.batch_number
      );

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = action.payload.newQuantity;
        if (action.payload.newQuantity <= 0) {
          cart.splice(existingProductIndex, 1);
        }
      }

      return cart;
    }

    case 'EMPTY_CART': {
      return [];
    }

    default:
      return state;
  }
};

// Custom hook for cart logic, common for both sales and purchase contexts
const useCartBase = (initialStateKey) => {
  const persistedState = localStorage.getItem(initialStateKey);
  const [cartState, dispatch] = useReducer(cartReducer, persistedState ? JSON.parse(persistedState) : []);

  const addToCart = (item, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: {...item, quantity} });
  };

  const removeFromCart = (product) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: product, // product should contain at least id and batch_number
    });
  };

  const updateProductQuantity = (itemId, batchNumber, newQuantity) => {
    dispatch({
      type: 'UPDATE_PRODUCT_QUANTITY',
      payload: { id: itemId, batch_number: batchNumber, newQuantity },
    });
  };

  const emptyCart = () => {
    dispatch({ type: 'EMPTY_CART' });
  };

  useEffect(() => {
    localStorage.setItem(initialStateKey, JSON.stringify(cartState));
  }, [cartState, initialStateKey]);

  return { cartState, addToCart, removeFromCart, updateProductQuantity, emptyCart };
};

export default useCartBase;
