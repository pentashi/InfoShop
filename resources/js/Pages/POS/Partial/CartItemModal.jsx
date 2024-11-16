import React, { useState, useContext, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, TextField, Grid2 as Grid, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

import { useSales } from "@/Context/SalesContext";
import { SharedContext } from "@/Context/SharedContext";

export default function CartItemModal() {
    const [showCost, setShowCost] = React.useState(false);
    const handleClickShowCost = () => setShowCost((show) => !show);
    const focusInputRef = useRef(null);

    const { updateCartItem } = useSales();
    const {
        cartItemModalOpen,
        setCartItemModalOpen,
        selectedCartItem,
        setSelectedCartItem,
    } = useContext(SharedContext);
    const [formState, setFormState] = useState({
        id: "",
        batch_id: "",
        quantity: 1,
        cost: "",
        price: "",
        batch_number: "",
        name: "",
        discount: 0,
        commission:0,
        account_number:'',
    });

    const handleClose = () => {
        setSelectedCartItem(null);
        setCartItemModalOpen(false);
    };

    const handleAddToCartSubmit = async (event) => {
        event.preventDefault();
        updateCartItem(formState);
        handleClose();
    };

    // Update selectedBatch when products change
    useEffect(() => {
        if (selectedCartItem) {
            setFormState((prevState) => ({
                ...prevState,
                batch_id: selectedCartItem.batch_id,
                cost: selectedCartItem.cost,
                price: selectedCartItem.price,
                batch_number: selectedCartItem.batch_number,
                name: selectedCartItem.name,
                id: selectedCartItem.id,
                quantity: selectedCartItem.quantity,
                slug: selectedCartItem.slug,
                category_name: selectedCartItem.category_name,
                discount: selectedCartItem.discount,
                commission: selectedCartItem.commission,
                additional_commission: selectedCartItem.additional_commission,
                account_number:selectedCartItem.account_number,
            }));
        }
    }, [selectedCartItem]);

    useEffect(() => {
        focusInputRef.current?.focus();
    }, [focusInputRef.current]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update other fields (e.g., quantity, cost, price)
        setFormState((prevState) => {
            let newState = {
                ...prevState,
                [name]: value, // Update the value of the field being changed
            };

            // If slug is "reload", we need to calculate the cost based on the price and commission
            if (prevState.slug === "reload") {
                if (name === "price" || name === "commission") {
                    // Recalculate the cost if price or commission changes
                    const calculatedCost = parseFloat(newState.price) - parseFloat(newState.commission) || 0;
                    newState.cost = calculatedCost; // Update the cost field
                }
            }
            return newState;
        });
    };

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={cartItemModalOpen}
                // disableRestoreFocus={true}
                autoFocus={true}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    component: "form",
                    onSubmit: handleAddToCartSubmit,
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {formState.slug === "reload" && formState.category_name
                        ? formState.category_name
                        : "EDIT CART"}
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
                        <input type="hidden" name="id" value={formState.id} />

                        <Grid size={6}>
                            {formState.slug !== "reload" ? (
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="quantity"
                                    label="Quantity"
                                    variant="outlined"
                                    value={formState.quantity}
                                    onChange={handleInputChange}
                                    inputRef={focusInputRef}
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
                                ) : (
                                <TextField
                                    fullWidth
                                    autoFocus
                                    type="text"
                                    name="account_number"
                                    label="Account Number"
                                    variant="outlined"
                                    value={formState.account_number}
                                    inputRef={focusInputRef}
                                    onChange={handleInputChange}
                                    sx={{
                                        mt: "0.5rem",
                                        input: { fontSize: "1rem" },
                                    }}
                                    required
                                    onFocus={(event) => {
                                        event.target.select();
                                    }}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                />
                            )}
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
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Rs.
                                            </InputAdornment>
                                        ),
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
                                    display:
                                        formState?.slug === "reload"
                                            ? "none"
                                            : "block",
                                }}
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Rs.
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            {formState.slug === "reload" && (
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="commission"
                                    label="Commission"
                                    variant="outlined"
                                    required
                                    value={formState.commission}
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
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    Rs.
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type={showCost ? "number" : "password"}
                                disabled={showCost ? false : true}
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
                                        readOnly: formState.slug === "reload", //Make cost un editable if reload enabled
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Rs.
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle cost visibility"
                                                    onClick={
                                                        handleClickShowCost
                                                    }
                                                    edge="end"
                                                >
                                                    {showCost ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
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
