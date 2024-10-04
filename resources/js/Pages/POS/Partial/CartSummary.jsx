import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import { ListItem, TextField, Divider, Typography } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";

import { useCart } from '../CartContext';

export default function CartSummary() {
    const { cartState, cartTotal, totalQuantity } = useCart();
    const [discount, setDiscount] = useState(0);

    const handleDiscountChange = (event) => {
        const inputDiscount = event.target.value;
        const newDiscount = inputDiscount !== "" ? parseInt(inputDiscount) : 0;
        setDiscount(newDiscount);
    };

    return (
        <List sx={{ width: "100%", bgcolor: "background.paper", mt: "1rem" }}>
            <ListItem
                secondaryAction={
                    <TextField
                        sx={{ width: "150px" }}
                        id="txtDiscount"
                        // label="Discount"
                        type="number"
                        name="discount"
                        value={discount}
                        onChange={handleDiscountChange}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                }
            >
                <ListItemText primary="Discount" />
            </ListItem>

            <Divider
                sx={{
                    borderBottom: "2px dashed",
                    borderColor: "grey.500",
                    my: "1.5rem",
                }}
            />
            <ListItem
                secondaryAction={
                    <Typography variant="h5" color="initial">
                        {cartState.length} | Qty. {totalQuantity}
                    </Typography>
                }
            >
                <ListItemText primary="Total Items" />
            </ListItem>
            <ListItem
                secondaryAction={
                    <Typography variant="h5" color="initial">
                        Rs.{(cartTotal-discount).toFixed(2)}
                    </Typography>
                }
            >
                <ListItemText primary="Total" />
            </ListItem>
        </List>
    );
}
