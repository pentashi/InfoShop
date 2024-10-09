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

import { usePurchase } from "@/Context/PurchaseContext";

export default function AddToPurchase({
    products,
    addToPurchaseOpen,
    setAddToPurchaseOpen,
}) {
    const { addToCart } = usePurchase();
    const [isSelectBatch, setIsSelectBatch] = useState(true);
    const [formState, setFormState] = useState({
        id:'',
        batch_id: "",
        quantity: "",
        cost: "",
        price: "",
        batch_number:"",
        name:'',
        new_batch:'',
    });

    const handleClose = () => {
        setAddToPurchaseOpen(false);
    };

    const handleAddToCartSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries(formData.entries())

        if(!isSelectBatch){
            const response = await axios.post('/storebatch', formJson);

            if (response.status === 200) {
                // Override formJson.batch_id with the response data
                formJson.batch_id = response.data.batch_id; // Adjust the property name based on your response
                formJson.batch_number = formJson.new_batch;

                // Optionally log the modified formJson
                console.log('Updated Form JSON:', formJson);

                // You can now proceed with using the modified formJson
                addToCart(formJson, formJson.quantity); // Uncomment to use this function

                // Reset the form and close the modal (if applicable)
                event.target.reset();
                handleClose();
            } else {
                console.error('Error: Response not successful', response);
            }
        }
        else{
            addToCart(formJson,formJson.quantity)
            event.target.reset()
            handleClose()
        }
    };

    // Update selectedBatch when products change
    useEffect(() => {
        if (Array.isArray(products)) {
            // Select the first product by default if products is an array
            setFormState((prevState) => ({
                ...prevState,
                batch_id: products.length > 0 ? products[0].batch_id : "",
                cost: products.length > 0 ? products[0].cost : "",
                price: products.length > 0 ? products[0].price : "",
                batch_number:products.length > 0 ? products[0].batch_number : "",
                name:products.length > 0 ? products[0].name : "",
                id:products.length > 0 ? products[0].id : "",
            }));
        } else if (products) {
            // If products is a single object, select that batch
            setFormState((prevState) => ({
                ...prevState,
                batch_id: products.batch_id,
                cost: products.cost,
                price: products.price,
                batch_number:products.batch_number,
                name:products.name,
                id:products.id,
            }));
        }

    }, [products]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Handle batch change separately to update cost and price based on the selected batch
        if (name === "batch_id") {
            // Find the product based on the selected batch
            const selectedProduct = Array.isArray(products)
                ? products.find((product) => product.batch_id === value)
                : products;

            if (selectedProduct) {
                // Update batch, cost, and price when the batch changes
                setFormState((prevState) => ({
                    ...prevState,
                    batch_id: selectedProduct.batch_id,
                    cost: selectedProduct.cost,
                    price: selectedProduct.price,
                    batch_number:selectedProduct.batch_number,
                    name:selectedProduct.name,
                    id:selectedProduct.id,
                }));
            }
        } else {
            // Update other fields (e.g., quantity, cost, price)
            setFormState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const toggleInputType = () => {
        setIsSelectBatch((prev) => !prev); // Toggle between select and input text field
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
                                name="name"
                                value={formState.name}
                            />
                            <input
                                type="hidden"
                                name="id"
                                value={formState.id}
                            />

                        <Grid size={6}>
                            <FormControl fullWidth sx={{ mt: "0.5rem" }}>
                                <TextField
                                    select={isSelectBatch}
                                    label={isSelectBatch ? "Batch" : "New Batch"}
                                    name={isSelectBatch ? "batch_id" : "new_batch"} // Different name for new batch input
                                    value={isSelectBatch ? formState.batch_id : formState.new_batch}
                                    required
                                    onChange={handleInputChange}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                        input: {
                                            endAdornment: 
                                            <InputAdornment position="end" sx={{cursor:'pointer'}} onClick={toggleInputType}>
                                            {isSelectBatch ? (<span className="hover:underline text-sky-500">ADD</span>) : (<span className="hover:underline text-amber-800">BACK</span>)}
                                            </InputAdornment>,
                                            sx: { pr: '12px !important' }
                                        },
                                        select:{
                                            IconComponent: () => null, // This removes the arrow icon
                                        }
                                    }}
                                >
                                    {Array.isArray(products) ? (
                                        products.map((product) => (
                                            <MenuItem
                                                key={product.batch_id}
                                                value={product.batch_id}
                                            >
                                                {product.batch_number}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem
                                            key={products.batch_id}
                                            value={products.batch_id}
                                        >
                                            {products.batch_number}
                                        </MenuItem>
                                    )}
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="quantity"
                                label="Quantity"
                                variant="outlined"
                                autoFocus
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
                                        // startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
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
                        ADD TO CART
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
