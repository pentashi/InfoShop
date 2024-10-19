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
    expense_date: new Date().toISOString().substring(0, 10), // Today's date in 'YYYY-MM-DD' format
    description: '',
    store_id:1,
};

export default function ExpenseDialog({
    open,
    setOpen,
    stores,
}) {

    const [expensesForm, setPaymentFormState] = useState(initialPaymentFormState);

    const handleClose = () => {
        setOpen(false);
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setPaymentFormState({
            ...expensesForm,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const submittedFormData = new FormData(event.currentTarget);
        let formJson = Object.fromEntries(submittedFormData.entries());

        let url='/expense';

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
                <DialogTitle id="alert-dialog-title">ADD EXPENSE</DialogTitle>
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
                    <Grid container size={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label={"Description"}
                        name="description"
                        multiline
                        value={expensesForm.note}
                        onChange={handleFieldChange}
                        sx={{mb:'1.5rem'}}
                        required
                    />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                        <TextField
                                fullWidth
                                type="number"
                                name="amount"
                                label="Amount"
                                variant="outlined"
                                autoFocus
                                sx={{input:{fontWeight:'bold'}}}
                                value={expensesForm.amount}
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

                           <Grid size={6}>
                            <TextField
                                label="Date"
                                name="expense_date"
                                fullWidth
                                type="date"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                value={expensesForm.expense_date}
                                onChange={handleFieldChange}
                                required
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormControl sx={{ width:'100%', mt:'0.6rem' }}>
                                <InputLabel>Store</InputLabel>
                                <Select
                                    value={expensesForm.store_id}
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
                    </Grid>

                    <Divider sx={{py:'0.5rem'}}></Divider>

                    
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ paddingY: "15px", fontSize: "1.5rem" }}
                        type="submit"
                        disabled={expensesForm.amount == 0 }
                    >
                        ADD EXPENSE
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
