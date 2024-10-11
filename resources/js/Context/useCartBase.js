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

    case 'UPDATE_CART_ITEM': {
      const cart = [...state];
      const existingProductIndex = cart.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.batch_number === action.payload.batch_number
      );

      if (existingProductIndex !== -1) {
        const updatedItem = {
          ...cart[existingProductIndex],
          cost: action.payload.cost !== undefined ? action.payload.cost : cart[existingProductIndex].cost,
          price: action.payload.price !== undefined ? action.payload.price : cart[existingProductIndex].price,
          quantity: action.payload.quantity !== undefined ? action.payload.quantity : cart[existingProductIndex].quantity,
          discount: action.payload.discount !== undefined ? action.payload.discount : cart[existingProductIndex].discount
        };
        
        cart[existingProductIndex] = updatedItem;

        // Remove item if quantity becomes 0 or negative
        if (updatedItem.quantity <= 0) {
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

  const updateCartItem = (item) => {
    dispatch({
      type: 'UPDATE_CART_ITEM',
      payload: item,
    });
  };

  const emptyCart = () => {
    dispatch({ type: 'EMPTY_CART' });
  };

  useEffect(() => {
    localStorage.setItem(initialStateKey, JSON.stringify(cartState));
  }, [cartState, initialStateKey]);

  return { cartState, addToCart, removeFromCart, updateProductQuantity, emptyCart, updateCartItem };
};

export default useCartBase;
