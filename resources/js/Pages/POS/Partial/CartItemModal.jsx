import React, { useState, useContext, useEffect, useRef} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    IconButton,
    TextField,
    Grid2 as Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from "@mui/material/InputAdornment";

import { useSales } from "@/Context/SalesContext";
import { SharedContext } from "@/Context/SharedContext";

export default function CartItemModal() {
    const [showCost, setShowCost] = React.useState(false);
    const handleClickShowCost = () => setShowCost((show) => !show);

    const { updateCartItem } = useSales();
    const { cartItemModalOpen, setCartItemModalOpen, selectedCartItem, setSelectedCartItem } = useContext(SharedContext);
    const [formState, setFormState] = useState({
        id:'',
        batch_id: "",
        quantity: "",
        cost: "",
        price: "",
        batch_number:"",
        name:'',
        discount:0,
    });

    const handleClose = () => {
        setSelectedCartItem(null);
        setCartItemModalOpen(false);
    };

    const handleAddToCartSubmit = async (event) => {
        event.preventDefault();
        updateCartItem(formState)
        handleClose()
    };

    // Update selectedBatch when products change
    useEffect(() => {

        if(selectedCartItem){
            setFormState((prevState) => ({
                ...prevState,
                batch_id: selectedCartItem.batch_id,
                cost: selectedCartItem.cost,
                price: selectedCartItem.price,
                batch_number:selectedCartItem.batch_number,
                name:selectedCartItem.name,
                id:selectedCartItem.id,
                quantity:selectedCartItem.quantity,
            }));
        }

    }, [selectedCartItem]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update other fields (e.g., quantity, cost, price)
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={cartItemModalOpen}
                disableRestoreFocus
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    component: "form",
                    onSubmit: handleAddToCartSubmit,
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"EDIT CART"}
                </DialogTitle>
                <IconButton
                    aria-label="close"              
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <Grid container spacing={2}>
                    <input
                                type="hidden"
                                name="batch_number"
                                value={formState.batch_number}
                            />
                            <input
                                type="hidden"
                                name="name"
                                value={formState.name}
                            />
                            <input
                                type="hidden"
                                name="id"
                                value={formState.id}
                            />

                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="quantity"
                                label="Quantity"
                                variant="outlined"
                                value={formState.quantity}
                                onChange={handleInputChange}
                                sx={{
                                    mt: "0.5rem",
                                    input: { fontSize: "1rem" },
                                }}
                                required
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                                autoFocus
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
                        </Grid>
                        
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="price"
                                label="Price"
                                variant="outlined"
                                required
                                value={formState.price}
                                onChange={handleInputChange}
                                sx={{
                                    mt: "0.5rem",
                                    input: { fontSize: "1rem" },
                                }}
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    input: {
                                        startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="discount"
                                label="Discount"
                                variant="outlined"
                                required
                                value={formState.discount}
                                onChange={handleInputChange}
                                sx={{
                                    mt: "0.5rem",
                                    input: { fontSize: "1rem" },
                                }}
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    input: {
                                        startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type={showCost ? 'number' : 'password'}
                                disabled={showCost ? false:true}
                                name="cost"
                                label="Cost"
                                variant="outlined"
                                required
                                value={formState.cost}
                                onChange={handleInputChange}
                                sx={{
                                    mt: "0.5rem",
                                    input: { fontSize: "1rem" },
                                }}
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    input: {
                                        startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                        endAdornment: <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle cost visibility"
                                          onClick={handleClickShowCost}
                                          edge="end"
                                        >
                                          {showCost ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>,
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ paddingY: "10px", fontSize: "1.2rem" }}
                        type="submit"
                        // onClick={handleClose}
                    >
                        UPDATE CART
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
