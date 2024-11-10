import React,{useContext} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Typography } from '@mui/material';

import { useSales as useCart } from '@/Context/SalesContext';
import { SharedContext } from "@/Context/SharedContext";
import productplaceholder from "./../product-placeholder.webp";

export default function ProductItem({ product }) {
    const { name, price, image_url, quantity } = product;
    const { addToCart } = useCart();
    const { setCartItemModalOpen, setSelectedCartItem } = useContext(SharedContext);

  return (
    <Card 
    onClick={() => {addToCart(product); product.quantity=1; setSelectedCartItem(product); setCartItemModalOpen(true)}}
    >
        
      <CardMedia
        sx={{ height: 120 }}
        image={image_url?image_url:productplaceholder}
        title={name}
      />
      <CardContent sx={{paddingBottom:'10px!important'}}>
        <Typography variant="subtitle1" component="div" className='text-center' sx={{lineHeight:'1.2rem'}}>
            {name}
             {/* - ({quantity}) */}
        </Typography>
        <div className='flex justify-center mt-1'>
             <p className='font-extrabold'>RS.{price}</p>
        </div>
      </CardContent>
    </Card>
  );
}
