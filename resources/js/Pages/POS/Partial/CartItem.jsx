import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import {Avatar, Box, Typography, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuantityInput from './QuantityInput';

import { useCart } from '../../../Context/CartContext';


export default function CartItems() {
  const { cartState, removeFromCart } = useCart();
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {cartState.map((item) => (
        <React.Fragment key={item.id + item.batch_number}>
            
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar variant="rounded" sx={{ width: 50, height: 50 }} alt={item.name} src={'/storage/'+item.image_url} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="h5"
                  sx={{ fontWeight: 'bold' }}  // Makes the text bold
                >
                  {item.name}
                </Typography>
              }
              sx={{ml:'10px'}}
              secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    Rs.{item.price} X {item.quantity} = <b>Rs.{(item.price * item.quantity).toFixed(2)}</b>
                    <br></br>
                  </Typography>
              }
            />
            <Box className="flex flex-row">
              <div className="relative w-full flex flex-row">
              <QuantityInput cartItem={item}></QuantityInput>
              <IconButton aria-label="delete" color='error' sx={{ml:'8px'}} onClick={() => removeFromCart(item)}>
                <DeleteIcon />
                </IconButton>
              </div>
            </Box>
          </ListItem>
          
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}
