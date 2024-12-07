import React, { useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography } from "@mui/material";
import { usePage } from "@inertiajs/react";

import { useSales as useCart } from "@/Context/SalesContext";
import { SharedContext } from "@/Context/SharedContext";
import productplaceholder from "@/Pages/Product/product-placeholder.webp";

export default function ProductItem({ product }) {
    const return_sale = usePage().props.return_sale;
    const { name, price, image_url, quantity } = product;
    const { addToCart } = useCart();
    const { setCartItemModalOpen, setSelectedCartItem } = useContext(SharedContext);

    return (
        <Card
            onClick={() => {

                if(return_sale){
                    product.quantity = -1
                }
                else product.quantity = 1;

                addToCart(product, product.quantity);
                setSelectedCartItem(product);
                setCartItemModalOpen(true);
            }}
            sx={{height:'100%'}}
        >
            <CardMedia
                sx={{ height: 120 }}
                image={image_url ? image_url : productplaceholder}
                title={name}
            />
            <CardContent sx={{ paddingBottom: "10px!important" }}>
                <Typography
                    variant="p"
                    component="div"
                    className="text-center"
                    sx={{ lineHeight: "1.2rem" }}
                >
                    {name}
                    {/* - ({quantity}) */}
                </Typography>
                <div className="flex justify-center mt-1">
                    <p className="font-extrabold">RS.{price}</p>
                </div>
            </CardContent>
        </Card>
    );
}
