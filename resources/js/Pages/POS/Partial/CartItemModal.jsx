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
    const [formState, setFormState] = useState([]);

    const handleClose = () => {
        setSelectedCartItem(null);
        setFormState([]);
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
                ...selectedCartItem,
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
            let newState = { ...prevState };

            if (name === "fixed_commission") {
                // We store the percentage value of fixed_commission, but it's only used for calculation
                newState.meta_data = {
                    ...newState.meta_data,
                    fixed_commission: value,
                };
            } else {
                newState[name] = value; // Update fields outside of meta_data
            }

            // If product type is "reload", we need to calculate the cost based on the price and commission
            if (newState.product_type === "reload") {
                const fixedCommission = parseFloat(newState.meta_data?.fixed_commission) || 0;
                const price = parseFloat(newState.price) || 0;
                const additionalCommission = parseFloat(newState.additional_commission) || 0;
                const extraCommission = parseFloat(newState.extra_commission) || 0;
                const calculatedCommission = ((price - additionalCommission) * fixedCommission) / 100;
                const totalCommission = additionalCommission + extraCommission + calculatedCommission;
                newState.extra_commission = extraCommission;
                newState.commission = totalCommission;

                if (
                    name === "price" || name === "fixed_commission" || name === "extra_commission" || name ==='additional_commission'
                ) {
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
                    {formState.product_type === "reload"
                        ? "RELOAD"
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
                            {formState.product_type !== "reload" ? (
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
                        {formState.product_type === "reload" && (
                            <Grid size={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="additional_commission"
                                    label="Customer Commission"
                                    variant="outlined"
                                    required
                                    value={formState.additional_commission}
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
                        )}

                        {formState.product_type === "reload" && (
                            <Grid size={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="extra_commission"
                                    label="Extra Commission"
                                    variant="outlined"
                                    required
                                    value={formState.extra_commission}
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
                        )}
                        {formState.product_type === "reload" && (
                            <Grid size={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="fixed_commission"
                                    label="Fixed Commission"
                                    variant="outlined"
                                    required
                                    value={formState.meta_data.fixed_commission}
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
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    %
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            </Grid>
                        )}
                        {formState.product_type === "reload" && (
                            <Grid size={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="commission"
                                    label="Total Commission"
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
                                            readOnly:true
                                        },
                                    }}
                                />
                            </Grid>
                        )}
{formState.product_type !== "reload" && (
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
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Rs.
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Grid>
                        )}
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
                                        readOnly: formState.product_type === "reload", //Make cost un editable if reload enabled
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
