import React, { useState, useContext, useMemo} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    IconButton,
    TextField,
    Grid2 as Grid,
    Divider,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from "@mui/material/InputAdornment";
import { router } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

import Menu from "@mui/material/Menu";

export default function PaymentsCheckoutDialog({
    useCart,
    open,
    setOpen,
    selectedContact,
    formData,
    is_sale=false,
}) {
    const { cartState, cartTotal, emptyCart, totalProfit } = useCart();

    const [discount, setDiscount] = useState(0);
    const [amount, setAmount] = useState((cartTotal - discount))
    const [payments, setPayments] = useState([])

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openPayment = Boolean(anchorEl);
    const handlePaymentClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePaymentClose = () => {
        setAnchorEl(null);
    };

    const handleDiscountChange = (event) => {
        const inputDiscount = event.target.value;
        const newDiscount =
            inputDiscount !== "" ? parseFloat(inputDiscount) : 0;
        setDiscount(newDiscount);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const submittedFormData = new FormData(event.currentTarget);
        let formJson = Object.fromEntries(submittedFormData.entries());
        // formData = Object.fromEntries(formData);
        formJson.cartItems = cartState;
        formJson.contact_id = selectedContact.id;
        formJson.payments = payments;

        let url='/pos/checkout';
        if(!is_sale){
            formJson = {...formJson, ...formData} //Form data from the POS / Purchase form
            url="/purchase/store" 
        }
        else formJson.profit_amount = totalProfit
        axios
        .post(url, formJson)
        .then((resp) => {
            Swal.fire({
                title: "Success!",
                text: resp.data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            emptyCart(); //Clear the cart from the Context API
            setDiscount(0);
            if(!is_sale) router.visit("/purchases");
            setOpen(false)
        })
        .catch((error) => {
            console.error("Submission failed with errors:", error);
            console.log(formJson);
        });
    };

     // Function to handle the addition of a payment
     const addPayment = (paymentMethod) => {
        if (amount) {
            const newPayment = { payment_method: paymentMethod, amount: parseFloat(amount) };
            setPayments([...payments, newPayment]);

            setAmount(0); // Clear the amount input after adding
        }
        handlePaymentClose()
    };

    // Memoize the total amount to avoid recalculating it on every render unless 'payments' changes
    const amountRecieved = useMemo(() => {
        return payments.reduce((sum, payment) => sum + payment.amount, 0);
    }, [payments]); // Only re-calculate when 'payments' changes

    // Function to remove a payment
    const deletePayment = (index) => {
        const newPayments = payments.filter((_, i) => i !== index);
        setPayments(newPayments);
    };

    return (
        <React.Fragment>
            {console.log(is_sale)}
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    component: "form",
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle id="alert-dialog-title">ADD PAYMENTS</DialogTitle>
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
                        <Grid size={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={"Sub total"}
                                type="number"
                                name="sub_total"
                                value={cartTotal}
                                slotProps={{
                                    input: {
                                        style: { textAlign: "center" },
                                        placeholder: "Total",
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Rs.
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                fullWidth
                                type="number"
                                name="discount"
                                label="Discount"
                                variant="outlined"
                                value={discount}
                                onChange={handleDiscountChange}
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

                        <Grid size={4}>
                       
                        <TextField
                                fullWidth
                                type="number"
                                name="net_total"
                                label="Amount to pay"
                                variant="outlined"
                                sx={{input:{fontWeight:'bold'}}}
                                value={(cartTotal-discount).toFixed(2)}
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
                                        readOnly: true,
                                    },
                                }}
                            />
         
                        </Grid>
                        <Grid size={12} sx={{mt:'1rem'}}>
                       
                        <TextField
                                fullWidth
                                type="number"
                                name="amount"
                                label="Amount"
                                variant="outlined"
                                value={amount}
                                onChange={(e)=>setAmount(e.target.value)}
                                onFocus={(event) => {
                                    event.target.select();
                                }}
                                sx={{input:{fontSize:'1.4rem'}}}
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
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    id="payment-positioned-button"
                                                    aria-controls={
                                                        openPayment
                                                            ? "payment-menu"
                                                            : undefined
                                                    }
                                                    aria-haspopup="true"
                                                    aria-expanded={openPayment ? "true" : undefined}
                                                    onClick={handlePaymentClick}
                                                    variant="contained"
                                                > PAYMENT</Button>
                                                <Menu
                                                    id="payment-menu"
                                                    aria-labelledby="payment-positioned-button"
                                                    anchorEl={anchorEl}
                                                    open={openPayment}
                                                    onClose={handlePaymentClose}
                                                    anchorOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                    transformOrigin={{
                                                        vertical: "top",
                                                        horizontal: "right",
                                                    }}
                                                >
                                                    <MenuItem onClick={() => addPayment('Cash')}>
                                                        CASH
                                                    </MenuItem>
                                                    <MenuItem onClick={() => addPayment('Cheque')}>
                                                        CHEQUE
                                                    </MenuItem>
                                                    <MenuItem onClick={() => addPayment('Credit')}>
                                                        CREDIT
                                                    </MenuItem>
                                                </Menu>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{py:'0.5rem'}}></Divider>

                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {payments.map((payment, index) => {
                const labelId = `checkbox-list-label-${index}`;

                return (
                    <React.Fragment key={index}>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" onClick={() => deletePayment(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton role={undefined} dense>
                                {/* Displaying the payment method and amount */}
                                <ListItemText primary={payment.payment_method} />
                                <ListItemText id={labelId} primary={`Rs.${payment.amount}`} />
                            </ListItemButton>
                        </ListItem>
                        {/* Only show Divider between items */}
                        {index < payments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                );
            })}
                    </List>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label={"Note"}
                        name="note"
                        multiline
                        sx={{ mt: "1rem" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ paddingY: "15px", fontSize: "1.5rem" }}
                        type="submit"
                        // onClick={handleClose}
                        disabled={amountRecieved - (cartTotal - discount) < 0} //amountRecieved-(cartTotal-discount)
                    >
                        PAY
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
