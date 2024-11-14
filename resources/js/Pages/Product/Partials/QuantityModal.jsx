import React, { useState, useContext, useEffect } from "react";
import {
    IconButton, MenuItem,
    TextField, FormControl, InputLabel, Select,
    Grid2 as Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";
import { usePage } from "@inertiajs/react";

export default function QuantityModal({
    modalOpen,
    setModalOpen,
    selectedStock,
    refreshProducts,
    stores,
}) {
    const auth = usePage().props.auth.user;
    const initialFormState = {
        batch_id: "",
        stock_id:'',
        quantity: 0,
        reason:'',
        store_id:auth.store_id ?? 1,
    }

    const [formState, setFormState] = useState(initialFormState);
    const [loading, setLoading] = useState(false)
    const handleClose = () => {
        setModalOpen(false)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        formJson.stock_id = formState.stock_id;
        formJson.batch_id = formState.batch_id;
        formJson.store_id = formState.store_id;

        axios
        .post('/quantity/store', formJson)
        .then((response) => {
            refreshProducts();
            Swal.fire({
                title: "Success!",
                text: response.data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            setFormState(initialFormState);
            handleClose();
        })
        .catch((error) => {
            let errorMessage = "An unknown error occurred."; // Default error message

            if (error.response && error.response.data) {
                // Check for multiple errors in `error.response.data.errors`
                if (error.response.data.errors) {
                    errorMessage = Object.values(error.response.data.errors)
                        .flat() // Flatten nested arrays
                        .join(' | '); // Join messages with a separator
                } else {
                    // Fallback to a single error message or a default message
                    errorMessage = error.response.data.error || error.response.data.message || errorMessage;
                }
            }

            Swal.fire({
                title: "Failed!",
                text: errorMessage,
                icon: "error",
                showConfirmButton: true,
            });
            console.error('Error:', error);
        })
        .finally(() => {
            setLoading(false); // Reset loading state
        });
    };

    // Function to update form state based on a batch object
    const updateFormStateFromProduct = (stock) => {
        setFormState((prevState) => ({
            ...prevState,
            batch_id: stock.batch_id,
            stock_id: stock.stock_id,
            store_id:stock.store_id??auth.store_id,
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
                                autoFocus
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
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ paddingY: "10px", fontSize: "1.2rem" }}
                        type="submit"
                        disabled={loading}
                    >
                        {"UPDATE QUANTITY"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
