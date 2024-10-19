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
    Select,
    InputLabel,
    FormControl,
    MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import Swal from "sweetalert2";

const initialPaymentFormState = {
    amount: 0,
    payment_method: 'Cash',
    transaction_date: new Date().toISOString().substring(0, 10), // Today's date in 'YYYY-MM-DD' format
    note: '',
    store_id:1,
};

export default function AddPaymentDialog({
    open,
    setOpen,
    selectedContact,
    selectedTransaction=null,
    amountLimit,
    is_customer=false,
    stores=null,
    refreshTable
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

        if(selectedTransaction !== null ){
            formJson.transaction_id = selectedTransaction.id
            formJson.store_id = selectedTransaction.store_id
        }

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
            refreshTable(window.location.pathname)
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
                                autoFocus
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
                        <InputLabel>Payment Method</InputLabel>
                            <Select
                                name="payment_method"
                                value={paymentForm.payment_method}
                                onChange={handleFieldChange}
                                label="Payment Method"
                            >
                                <MenuItem value={'Cash'}>Cash</MenuItem>
                                <MenuItem value={'Cheque'}>Cheque</MenuItem>
                                {selectedTransaction===null &&(
                                    <MenuItem value={'Account'}>Account</MenuItem>
                                )}
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

                        {(selectedTransaction===null || amountLimit === undefined) && (
                            <Grid size={12}>
                                <FormControl sx={{ width:'100%', mt:'0.6rem' }}>
                                    <InputLabel>Store</InputLabel>
                                    <Select
                                        value={paymentForm.store_id}
                                        label="Store"
                                        onChange={handleFieldChange}
                                        required
                                        name="store_id"
                                    >
                                        {stores?.map((store) => (
                                            <MenuItem key={store.id} value={store.id}>
                                                {store.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
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
                        disabled={paymentForm.amount == 0 || (amountLimit !== undefined && paymentForm.amount > amountLimit)}
                    >
                        ADD PAYMENT
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
