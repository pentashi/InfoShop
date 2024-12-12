import React, { useState, useContext, useMemo, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Menu from "@mui/material/Menu";
import {
    IconButton,
    TextField,
    Grid2 as Grid,
    Divider,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Table, TableBody, TableRow, TableCell,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import PercentIcon from '@mui/icons-material/Percent';
import PaymentsIcon from '@mui/icons-material/Payments';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import InputAdornment from "@mui/material/InputAdornment";
import { router } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";
import { usePage } from "@inertiajs/react";

export default function PaymentsCheckoutDialog({
    useCart,
    open,
    setOpen,
    selectedContact,
    formData,
    is_sale = false,
}) {
    const { cartState, cartTotal, emptyCart, totalProfit } = useCart();
    const return_sale = usePage().props.return_sale;
    const return_sale_id = usePage().props.sale_id;

    const [loading, setLoading] = useState(false);

    const [discount, setDiscount] = useState(0);
    const [amount, setAmount] = useState((cartTotal - discount))
    const [payments, setPayments] = useState([])
    const [amountReceived, setAmountReceived] = useState(0)

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
        setPayments([])
        setAmountReceived(0)
        setAmount(cartTotal - discount)
        setOpen(false);
    };

    useEffect(() => {
        setAmount(cartTotal - discount);
        setAmountReceived(payments.reduce((sum, payment) => sum + payment.amount, 0));
        setAmount(cartTotal - discount)
    }, [])

    useEffect(() => {
        setAmountReceived(payments.reduce((sum, payment) => sum + payment.amount, 0));
    }, [payments])

    const handleSubmit = (event) => {
        event.preventDefault();

        if (loading) return;
        setLoading(true);

        const submittedFormData = new FormData(event.currentTarget);
        let formJson = Object.fromEntries(submittedFormData.entries());
        // formData = Object.fromEntries(formData);
        formJson.cartItems = cartState;
        formJson.contact_id = selectedContact.id;
        formJson.payments = payments;
        formJson = { ...formJson, ...formData } //Form data from the POS / Purchase form
        formJson.profit_amount = totalProfit - discount

        formJson.return_sale = return_sale;
        formJson.return_sale_id = return_sale_id;

        let url = '/pos/checkout';
        if (!is_sale) { url = "/purchase/store" }
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
                setPayments([])
                if (!is_sale) router.visit("/purchases");
                setOpen(false)
            })
            .catch((error) => {
                const errorMessages = JSON.stringify(error.response, Object.getOwnPropertyNames(error));
                Swal.fire({
                    title: "Failed!",
                    text: errorMessages,
                    icon: "error",
                    showConfirmButton: true,
                });
                console.log(error);
            }).finally(() => {
                setLoading(false); // Reset submitting state
            });
    };

    // Function to handle the addition of a payment
    const addPayment = (paymentMethod) => {
        const netTotal = cartTotal - discount
        const balance = amountReceived + parseFloat(amount)
        if (netTotal < balance) {
            alert('Payment cannot be exceeded the total amount')
        }
        else if (amount) {
            const newPayment = { payment_method: paymentMethod, amount: parseFloat(amount) };
            setPayments([...payments, newPayment]);
            const newBalance = netTotal - balance;
            setAmount(newBalance > 0 ? newBalance : 0); // Clear the amount input after adding
        }
        handlePaymentClose()
    };


    // Function to remove a payment
    const deletePayment = (index) => {
        const newPayments = payments.filter((_, i) => i !== index);
        setPayments(newPayments);
    };

    const discountPercentage = () => {
        if (discount < 0 || discount > 100) {
            alert("Discount must be between 0 and 100");
            return;
        }
        const discountAmount = (cartTotal * discount) / 100;
        setDiscount(discountAmount);
    }

    return (
        <>
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
                    <Grid container spacing={2} alignItems={'center'}>
                        {/* <Grid size={4}>
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
                        </Grid> */}
                        <Grid size={6}>
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
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton color="primary" onClick={discountPercentage}>
                                                    <PercentIcon fontSize="small"></PercentIcon>
                                                </IconButton>
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
                                name="net_total"
                                label="Total"
                                variant="outlined"
                                sx={{ input: { fontWeight: 'bold', } }}
                                value={(cartTotal - discount).toFixed(2)}
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

                        <Grid container size={12} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                            <Grid size={12} sx={{ mt: '1rem' }}>

                                <TextField
                                    autoFocus
                                    fullWidth
                                    type="number"
                                    name="amount"
                                    label="Amount"
                                    variant="outlined"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    onFocus={(event) => {
                                        event.target.select();
                                    }}
                                    sx={{ input: { fontSize: '1.4rem' } }}
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

                            <Grid size={12} spacing={1} container justifyContent={'center'}>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    startIcon={<PaymentsIcon />}
                                    onClick={() => addPayment('Cash')}
                                    color="success"
                                >
                                    CASH
                                </Button>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    startIcon={<PauseCircleOutlineIcon />}
                                    onClick={() => addPayment('Credit')}
                                    color="error"
                                >
                                    CREDIT
                                </Button>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    startIcon={<CreditCardIcon />}
                                    onClick={() => addPayment('Cheque')}
                                >
                                    CHEQUE
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider sx={{ py: '0.5rem' }}></Divider>

                    <Table sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <TableBody>
                            {payments.map((payment, index) => (
                                <TableRow key={index}>
                                    {/* Display Payment Method Icon */}
                                    <TableCell sx={{ padding: '5px 16px' }}>
                                        {payment.payment_method === 'Cash' && <PaymentsIcon />}
                                        {payment.payment_method === 'Cheque' && <CreditCardIcon />}
                                        {payment.payment_method === 'Credit' && <PauseCircleOutlineIcon />}
                                        
                                    </TableCell>

                                    <TableCell>
                                    <strong>{payment.payment_method}</strong>
                                    </TableCell>
                                    {/* Display Payment Amount */}
                                    <TableCell align="right">
                                        <strong>Rs. {(payment.amount).toFixed(2)}</strong>
                                    </TableCell>
                                    {/* Action Button to delete payment */}
                                    <TableCell align="center">
                                        <IconButton edge="end" color="error" onClick={() => deletePayment(index)}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label={"Note"}
                        name="note"
                        multiline
                        sx={{ mt: "1rem" }}
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ paddingY: "15px", fontSize: "1.5rem" }}
                        type="submit"
                        // onClick={handleClose}
                        disabled={amountReceived - (cartTotal - discount) < 0 || loading || amountReceived > (cartTotal - discount)} //amountReceived-(cartTotal-discount)
                    >
                        {loading ? 'Loading...' : 'PAY'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
