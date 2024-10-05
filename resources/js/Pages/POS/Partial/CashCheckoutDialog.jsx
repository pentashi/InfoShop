import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Box, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from '@mui/material/InputAdornment';
import axios from "axios";
import Swal from "sweetalert2";

import { useCart } from '@/Context/CartContext';
import { SharedContext } from "@/Context/SharedContext";

export default function CashCheckoutDialog({ disabled }) {
    const { cartState, cartTotal, totalProfit, emptyCart } = useCart();
    const {selectedCustomer} = useContext(SharedContext); 

    const [discount, setDiscount] = useState(0);
    const [amountRecieved, setAmountRecieved]=useState(0);

    const handleDiscountChange = (event) => {
        const inputDiscount = event.target.value;
        const newDiscount = inputDiscount !== "" ? parseFloat(inputDiscount) : 0;
        setDiscount(newDiscount);
    };


    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        formJson.cartItems = cartState;
        formJson.profit_amount = totalProfit;
        formJson.payment_method = 'Cash'
        formJson.customer_id = selectedCustomer.id

        axios.post('/pos/checkout', formJson)
        .then((resp) => {
            console.log(resp);
            Swal.fire({
                title: "Success!",
                text: resp.data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            emptyCart() //Clear the cart from the Context API
            setAmountRecieved(0)
            setDiscount(0)
            setOpen(false);
        })
        .catch((error) => {
            console.error("Submission failed with errors:", error);
            console.log(formJson);
        });
    };

    return (
        <React.Fragment>
            <Button
                variant="contained"
                color="success"
                sx={{ mr: "0.5rem", paddingY: "15px", flexGrow: "1" }}
                size="large"
                endIcon={<PaymentsIcon />}
                onClick={handleClickOpen}
                disabled={disabled}
            >
                CASH
            </Button>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                  }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Cash Checkout"}
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
                <TextField 
                        id="txtAmount"
                        fullWidth
                        autoFocus
                        variant="outlined"
                        label={'Amount Recieved'}
                        type="number"
                        name="amount_recieved"
                        onFocus={event => {
                            event.target.select();
                          }}
                        onChange={(e)=>{setAmountRecieved(e.target.value)}}
                        sx={{ input: {textAlign: "center", fontSize:'2rem'},}}
                        value={amountRecieved}
                        slotProps={{
                            input: {
                                style: { textAlign: 'center' },
                                placeholder:'Amount Recieved',
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                            },
                        }}
                />

                <TextField
                        fullWidth
                        id="txtDiscount"
                        // label="Discount"
                        type="number"
                        name="discount"
                        label="Discount"
                        variant="outlined"
                        value={discount}
                        sx={{ mt: "2rem", input: {textAlign: "center", fontSize:'2rem'},}}
                        onChange={handleDiscountChange}
                        onFocus={event => {
                            event.target.select();
                          }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                            input:{
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                            }
                        }}
                    />

                    <Box className="flex items-center">
                    <TextField
                        id="txtTotal"
                        fullWidth
                        label="Payable Amount"
                        variant="outlined"
                        name="total"
                        value={(cartTotal-discount).toFixed(2)}
                        sx={{ mt: "2rem", input: {textAlign: "center", fontSize:'2rem'},}}
                        slotProps={{
                            input: {
                                readOnly: true,
                                style: { textAlign: 'center' },
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                            },
                        }}
                    />
                    
                    <TextField
                        id="txtChange"
                        fullWidth
                        label="Change"
                        variant="outlined"
                        name="change_amount"
                        sx={{ mt: "2rem", ml:'1rem', input: {textAlign: "center", fontSize:'2rem'} }}
                        value={(amountRecieved-(cartTotal-discount)).toFixed(2)}//Change calculation
                        slotProps={{
                            input: {
                                readOnly: true,
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                            },
                        }}
                    />
                    </Box>

                    <TextField 
                        fullWidth
                        variant="outlined"
                        label={'Note'}
                        name="note"
                        multiline
                        sx={{ mt:'2rem',}}
                    />
 
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ paddingY: "15px", fontSize: "1.5rem" }}
                        type="submit"
                        // onClick={handleClose}
                        disabled={(amountRecieved - (cartTotal - discount)) < 0} //amountRecieved-(cartTotal-discount) 
                    >
                        PAY
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
