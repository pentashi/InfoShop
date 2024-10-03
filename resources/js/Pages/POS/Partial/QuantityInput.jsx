import React, { useState, useEffect } from 'react';
import './QuantityInput.css'; // Import your CSS file
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const QuantityInput = ({cartItem,cartItems, updateProductQuantity}) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const min = 0;
  const max = 9999;

  useEffect(() => {
    updateButtonStates();
  }, [cartItems]);                                                                   

  const updateButtonStates = () => {
    setQuantity(cartItem.quantity)
  };

  const handleQuantityChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
        const newQuantity = Math.max(min, Math.min(value, max));
        setQuantity(newQuantity);
        updateProductQuantity(cartItem.id, cartItem.batch_number, newQuantity);
    } else {
        setQuantity(min);
        updateProductQuantity(cartItem.id, cartItem.batch_number, min);
    }
  };

  const decreaseValue = () => {
    setQuantity((prev) => {
        const newQuantity = Math.max(prev - 1, min);
        updateProductQuantity(cartItem.id, cartItem.batch_number, newQuantity);
        return newQuantity;
    });
  };

  const increaseValue = () => {
    setQuantity((prev) => {
        const newQuantity = Math.max(prev + 1, min);
        updateProductQuantity(cartItem.id, cartItem.batch_number, newQuantity);
        return newQuantity;
    });
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
        value={quantity}
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
