import React, { useState, useContext, useEffect } from "react";
import {
    IconButton,
    TextField, Switch, FormControlLabel,
    Grid2 as Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import Swal from "sweetalert2";

export default function BatchModal({
    batchModalOpen,
    setBatchModalOpen,
    selectedBatch,
    products,
    setProducts
}) {

    const initialFormState = {
        batch_id: "",
        quantity: "",
        cost: "",
        price: "",
        batch_number:"",
        expiry_date:'',
        is_active:true,
    }

    const [isNew, setIsNew] = useState(false)
    const [formState, setFormState] = useState(initialFormState);

    const handleClose = () => {
        setIsNew(false)
        updateFormStateFromBatch(selectedBatch)
        setBatchModalOpen(false)
    };

    const handleAddToCartSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        formJson.new_batch = formState.batch_number;

        let response;
        if(isNew) {response = await axios.post('/storebatch/', formJson);}
        else {response = await axios.post('/productbatch/'+formState.batch_id, formJson);}

        if (response.status === 200 || response.status === 201) {

            if(!isNew){
                // Use map to update the product inside the products array
                const updatedProducts = products.map((product) => {
                    // Check if this is the product we want to update
                    if (product.batch_id === formState.batch_id) {
                        // Return the updated product with new values from formState
                        return {
                            ...product, // Keep other fields the same
                            cost: parseFloat(formState.cost).toFixed(2),
                            price: parseFloat(formState.price).toFixed(2),
                            batch_number: formState.batch_number,
                            expiry_date: formState.expiry_date,
                            is_active: formState.is_active,
                        };
                    }
                    // Return the product as is if it doesn't match the batch_id
                    return product;
                });

                // Update the products state with the updated product list
                setProducts(updatedProducts);
            }

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
    const updateFormStateFromBatch = (batch) => {
        setFormState((prevState) => ({
            ...prevState,
            batch_id: batch.batch_id,
            cost: batch.cost,
            price: batch.price,
            batch_number: batch.batch_number,
            expiry_date: batch.expiry_date,
            is_active: batch.is_active === 1 ? true : false,
        }));
    };

    // Update selectedBatch when products change
    useEffect(() => {

        if (selectedBatch) {
            updateFormStateFromBatch(selectedBatch); // Reuse the function to update state
            setIsNew(false);
        }

    }, [selectedBatch]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update other fields (e.g., quantity, cost, price)
        setFormState((prevState) => {
            if (name === 'is_active') {
                return {
                    ...prevState,
                    is_active: e.target.checked, // Update is_active based on the checkbox state
                };
            } else {
                return {
                    ...prevState,
                    [name]: value, // For other inputs, update based on their name
                };
            }
        });
    };

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={batchModalOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    component: "form",
                    onSubmit: handleAddToCartSubmit,
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{ alignItems: "center", display: "flex" }}
                >
                    {isNew ? "NEW BATCH" : "EDIT BATCH"}

                    {!isNew && (
                        <Button
                            sx={{ ml: "1rem" }}
                            variant="contained"
                            color="success"
                            onClick={() => {
                                setIsNew(true);
                                setFormState(initialFormState);
                            }}
                        >
                            CREATE NEW BATCH
                        </Button>
                    )}
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
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                // type="number"
                                name="batch_number"
                                label="Batch Number"
                                variant="outlined"
                                autoFocus
                                value={formState.batch_number}
                                onChange={handleInputChange}
                                sx={{
                                    mt: "0.3rem",
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
                                    input: {
                                        // startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
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
                                    mt: "0.3rem",
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
                                        // startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type={"number"}
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
                                }}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type={"date"}
                                name="expiry_date"
                                label="Expiry Date"
                                variant="outlined"
                                value={formState.expiry_date}
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
                        <Grid
                            size={12}
                            sx={{ justifyContent: "center", mt: "1rem" }}
                            container
                            direction="row"
                        >
                            <FormControlLabel
                                value="1"
                                control={
                                    <Switch
                                        color="primary"
                                        name="is_active"
                                        onChange={handleInputChange}
                                        checked={formState.is_active}
                                    />
                                }
                                label="Is batch active? "
                                labelPlacement="top"
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
                        {isNew ? "SAVE BATCH" : "UPDATE BATCH"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
