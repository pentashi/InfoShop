import React, { useState, useContext, useEffect } from "react";
import {
    IconButton, MenuItem,
    TextField, FormControl, InputLabel, Select,
    Grid2 as Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import Swal from "sweetalert2";

export default function QuantityModal({
    modalOpen,
    setModalOpen,
    selectedStock,
    products,
    setProducts,
    stores,
}) {

    const initialFormState = {
        batch_id: "",
        stock_id:'',
        quantity: 0,
        reason:'',
        store_id:1,
    }

    const [formState, setFormState] = useState(initialFormState);

    const handleClose = () => {
        setModalOpen(false)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        formJson.stock_id = formState.stock_id;
        formJson.batch_id = formState.batch_id;
        formJson.store_id = formState.store_id;

        const response = await axios.post('/quantity/store', formJson);

        if (response.status === 200 || response.status === 201) {

            // Use map to update the product inside the products array
            // const updatedProducts = products.map((product) => {
            //     // Check if this is the product we want to update
            //     if (product.batch_id === formState.batch_id) {
            //         // Return the updated product with new values from formState
            //         return {
            //             ...product, // Keep other fields the same
            //             cost: parseFloat(formState.cost).toFixed(2),
            //         };
            //     }
            //     // Return the product as is if it doesn't match the batch_id
            //     return product;
            // });

            // Update the products state with the updated product list
            // setProducts(updatedProducts);

            Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            handleClose();
        } else {
            console.error('Error: Response not successful', response);
        }
    };

    // Function to update form state based on a batch object
    const updateFormStateFromProduct = (stock) => {
        setFormState((prevState) => ({
            ...prevState,
            batch_id: stock.batch_id,
            stock_id: stock.stock_id,
        }));
    };

    // Update selectedBatch when products change
    useEffect(() => {

        if (selectedStock) {
            updateFormStateFromProduct(selectedStock); // Reuse the function to update state
        }

    }, [selectedStock]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update other fields (e.g., quantity, cost, price)
        setFormState((prevState) => {
            return {
                ...prevState,
                [name]: value, // For other inputs, update based on their name
            };
        });
    };

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    component: "form",
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{ alignItems: "center", display: "flex" }}
                >
                    {"QUANTITY ADJUSTMENT"}
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
                    <Grid
                        container
                        spacing={2}
                        sx={{ justifyContent: "center" }}
                        direction="row"
                    >
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                type="number"
                                name="quantity"
                                label="Quantity"
                                variant="outlined"
                                required
                                value={formState.quantity}
                                onChange={handleInputChange}
                                sx={{
                                    mt: "0.3rem",
                                    input: {
                                        fontSize: "1.3rem",
                                        textAlign: "center",
                                    },
                                }}
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
                        </Grid>
                        {formState.stock_id==null &&(
                            <Grid size={12} sx={{ mt: "0.6rem" }}>
                                <FormControl
                                    sx={{ minWidth: "200px", width: "100%" }}
                                >
                                    <InputLabel>Store</InputLabel>
                                    <Select
                                        value={formState.store_id}
                                        label="Store"
                                        onChange={handleInputChange}
                                        required
                                        name="store_id"
                                    >
                                        {stores.map((store) => (
                                            <MenuItem
                                                key={store.id}
                                                value={store.id}
                                            >
                                                {store.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        <Grid size={12} sx={{ mt: "0.6rem" }}>
                            <TextField
                                fullWidth
                                name="reason"
                                label="Reason"
                                variant="outlined"
                                required
                                value={formState.reason}
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
                        {"UPDATE QUANTITY"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
