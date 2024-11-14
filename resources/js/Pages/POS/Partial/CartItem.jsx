import React, { useContext} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import {Avatar, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuantityInput from './QuantityInput';
import CartItemModal from './CartItemModal';

import { useSales as useCart } from '@/Context/SalesContext';
import { SharedContext } from "@/Context/SharedContext";
import productplaceholder from "@/Pages/Product/product-placeholder.webp";

export default function CartItems() {
  const { cartState, removeFromCart } = useCart();
  const { setCartItemModalOpen, setSelectedCartItem } = useContext(SharedContext);

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {cartState.map((item) => (
        <React.Fragment key={item.id + item.batch_number}>
          <ListItem alignItems="center" sx={{padding:{sm:1, xs:0}, paddingY:1}}>
            <ListItemAvatar sx={{display:{xs:'none', sm:'block'}}}>
              <Avatar variant="rounded" sx={{ width: 50, height: 50 }} alt={item.name} src={item.image_url?item.image_url:productplaceholder} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="h5"
                  sx={{ fontWeight: 'bold', cursor:'pointer', fontSize:{sm:'1rem', xs:'0.9rem'} }}  // Makes the text bold
                  className='hover:underline'
                  onClick={()=>{setSelectedCartItem(item); setCartItemModalOpen(true);}}
                >
                  {item.name}
                </Typography>
              }
              sx={{ml:'10px'}}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    Rs.{(item.price-item.discount).toFixed(2)} X {item.quantity} = <b>Rs.{((item.price-item.discount) * item.quantity).toFixed(2)}</b>
                    <br></br>
                  </Typography>
                  </>
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
      <CartItemModal/>
    </List>
  );
}
