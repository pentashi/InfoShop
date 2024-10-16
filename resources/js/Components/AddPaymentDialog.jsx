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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import Swal from "sweetalert2";

const initialPaymentFormState = {
    amount: 0,
    payment_method: 'Cash',
    transaction_date: new Date().toISOString().substring(0, 10), // Today's date in 'YYYY-MM-DD' format
    note: '',
};

export default function AddPaymentDialog({
    open,
    setOpen,
    selectedContact,
    selectedTransaction=null,
    amountLimit,
    is_customer=false,
}) {

    const [paymentForm, setPaymentFormState] = useState(initialPaymentFormState);

    const handleClose = () => {
        setOpen(false);
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setPaymentFormState({
            ...paymentForm,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const submittedFormData = new FormData(event.currentTarget);
        let formJson = Object.fromEntries(submittedFormData.entries());
        formJson.contact_id = selectedContact

        if(selectedTransaction){
            formJson.transaction_id = selectedTransaction.id
            formJson.store_id = selectedTransaction.store_id
        }

        console.log(formJson)
        let url='/customer-transaction';
        if(!is_customer) url="/vendor-transaction" 

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
            setOpen(false)
        })
        .catch((error) => {
            console.error("Submission failed with errors:", error);
            console.log(formJson);
        });
    };

    return (
        <React.Fragment>
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
                                type="number"
                                name="amount"
                                label="Amount"
                                variant="outlined"
                                sx={{input:{fontWeight:'bold'}}}
                                value={paymentForm.amount}
                                onChange={handleFieldChange}
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
                        <FormControl sx={{ minWidth: 120, width:'100%' }}>
                            <Select
                                name="payment_method"
                                value={paymentForm.payment_method}
                                onChange={handleFieldChange}
                            >
                                <MenuItem value={'Cash'}>Cash</MenuItem>
                                <MenuItem value={'Cheque'}>Cheque</MenuItem>
                                <MenuItem value={'Account'}>Account</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>

                        <Grid size={4}>
                            <TextField
                                label="Date"
                                name="transaction_date"
                                fullWidth
                                type="date"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                value={paymentForm.transaction_date}
                                onChange={handleFieldChange}
                                required
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{py:'0.5rem'}}></Divider>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label={"Note"}
                        name="note"
                        multiline
                        sx={{ mt: "1rem" }}
                        value={paymentForm.note}
                        onChange={handleFieldChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ paddingY: "15px", fontSize: "1.5rem" }}
                        type="submit"
                        // onClick={handleClose}
                        disabled={paymentForm.amount == 0 || paymentForm.amount > amountLimit}
                    >
                        ADD PAYMENT
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
