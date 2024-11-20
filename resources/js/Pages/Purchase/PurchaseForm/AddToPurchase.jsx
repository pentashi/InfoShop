import React, { useState, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    IconButton,
    TextField,
    Grid2 as Grid,
    FormControl,
    MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import Swal from "sweetalert2";

import { usePurchase } from "@/Context/PurchaseContext";

export default function AddToPurchase({
    product,
    addToPurchaseOpen,
    setAddToPurchaseOpen,
}) {
    const { addToCart } = usePurchase();
    const [isSelectBatch, setIsSelectBatch] = useState(true);
    const [loading, setLoading] = useState(false)
    const [formState, setFormState] = useState([]);

    const handleClose = () => {
        setFormState([])
        setAddToPurchaseOpen(false);
    };

    const handleAddToCartSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;
        setLoading(true);

        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())

        if(!isSelectBatch){
            let url='/storebatch';

            axios
            .post(url, formJson)
            .then((resp) => {
                formJson.batch_id = resp.data.batch_id; // Adjust the property name based on your response
                formJson.batch_number = formJson.new_batch;

                Swal.fire({
                    title: "Success!",
                    text: resp.data.message,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
                addToCart(formJson, formJson.quantity);
                handleClose()
            })
            .catch((error) => {
                const errorMessages = Object.values(error.response.data.errors).flat().join(' | ');
                Swal.fire({
                    title: "Failed!",
                    text: errorMessages,
                    icon: "error",
                    showConfirmButton: true,
                });
                console.error(error);
            }).finally(() => {
                setLoading(false); // Reset submitting state
            });
        }
        else{
            addToCart(formJson,formJson.quantity)
            setLoading(false);
            handleClose()
        }
    };

    // Update selectedBatch when products change
    useEffect(() => {
       if (product) {
            const copyProduct = { ...product };
            if(copyProduct.product_type==='custom') copyProduct.name='';
            copyProduct.quantity = ''
            // If products is a single object, select that batch
            setFormState(copyProduct);
        }

    }, [product]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;        

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
                open={addToPurchaseOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    component: "form",
                    onSubmit: handleAddToCartSubmit,
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"ADD TO PURCHASE"}
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
                            name="batch_id"
                            value={formState.batch_id}
                        />
                        <input
                            type="hidden"
                            name="name"
                            value={formState.name}
                        />
                        <input type="hidden" name="id" value={formState.id} />
                        <input
                            type="hidden"
                            name="product_type"
                            value={formState.product_type}
                        />
                        {product.product_type !== "custom" && (
                            <Grid size={6}>
                                <TextField
                                    fullWidth
                                    label={"Batch"}
                                    value={formState.batch_number}
                                    required
                                    onChange={handleInputChange}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                        input: {
                                            sx: { pr: "12px !important" },
                                        },
                                    }}
                                    onFocus={(event) => {
                                        event.target.select();
                                    }}
                                />
                            </Grid>
                        )}
                        {product.product_type === "custom" && (
                            <Grid size={6}>
                                <TextField
                                    fullWidth
                                    label={"Description"}
                                    name={'name'}
                                    value={formState.name}
                                    required
                                    autoFocus={product.product_type === "custom"}
                                    onChange={handleInputChange}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                        input: {
                                            sx: { pr: "12px !important" },
                                        },
                                    }}
                                />
                            </Grid>
                        )}
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="quantity"
                                label="Quantity"
                                variant="outlined"
                                autoFocus={product.product_type !== "custom"}
                                value={formState.quantity}
                                onChange={handleInputChange}
                                sx={{
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
                                name="cost"
                                label="Cost"
                                variant="outlined"
                                required
                                value={formState.cost}
                                onChange={handleInputChange}
                                sx={{
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
                                type="number"
                                name="price"
                                label="Price"
                                variant="outlined"
                                required
                                value={formState.price}
                                onChange={handleInputChange}
                                sx={{
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
                        disabled={loading}
                    >
                        ADD TO CART
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
