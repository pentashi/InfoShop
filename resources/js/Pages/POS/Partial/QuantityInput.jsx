import React, { useState, useEffect } from 'react';
import './QuantityInput.css'; // Import your CSS file
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { useCart } from '../../../Context/CartContext';

const QuantityInput = ({cartItem}) => {
  const { cartState, updateProductQuantity } = useCart();

  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [inputValue, setInputValue] = useState(cartItem.quantity);
  const min = 0;
  const max = 9999;

  useEffect(() => {
    setQuantity(cartItem.quantity);
    setInputValue(cartItem.quantity);
  }, [cartState]);                                                                


  const handleQuantityChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
        const newQuantity = Math.max(min, Math.min(value, max));
        setQuantity(newQuantity);
        setInputValue(newQuantity);
        updateProductQuantity(cartItem.id, cartItem.batch_number, newQuantity);
    } else {
        setInputValue(min);
        updateProductQuantity(cartItem.id, cartItem.batch_number, min);
    }
  };

  const decreaseValue = () => {
    const newQuantity = Math.max(quantity - 1, min);
    setQuantity(newQuantity);
    setInputValue(newQuantity);
    updateProductQuantity(cartItem.id, cartItem.batch_number, newQuantity);
  };

  const increaseValue = () => {
    const newQuantity = Math.min(quantity + 1, max);
    setQuantity(newQuantity);
    setInputValue(newQuantity);
    updateProductQuantity(cartItem.id, cartItem.batch_number, newQuantity);
  };

  return (
    <div className="quantity">
      <button type='button' className="minus" aria-label="Decrease" onClick={decreaseValue} disabled={quantity <= min}>
        <RemoveIcon></RemoveIcon>
      </button>
      <input
        type="number"
        className="input-box"
        step='0.01'
        value={inputValue}
        min={min}
        max={max}
        onChange={handleQuantityChange}
      />
      <button type='button' className="plus" aria-label="Increase" onClick={increaseValue} disabled={quantity >= max}>
       <AddIcon></AddIcon>
      </button>
    </div>
  );
};

export default QuantityInput;
