import React, { useState, useContext, useMemo, useEffect} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    IconButton,
    Grid2 as Grid,
    Divider,
    Table, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";


export default function ViewPaymentDetailsDialog({
    open,
    setOpen,
    selectedTransaction=null,
    type='sale',
}) {
    const [payments, setPayments] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchPayments = async (type) => {
            try {
                const response = await axios.post(`/getpayments/${type}`, { transaction_id: selectedTransaction });
                setPayments(response.data.payments);
            } catch (error) {
                console.error('Error fetching payments: ', error);
            }
        };

        // Call the API with the desired type (e.g., 'purchases' or 'sales')
        fetchPayments(type); // You can pass 'purchases' or 'sales' based on your requirements
    }, [selectedTransaction]);

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">PAYMENTS</DialogTitle>
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
                <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{fontWeight:'bold'}}>Payment Method</TableCell>
                    <TableCell sx={{fontWeight:'bold'}}>Amount</TableCell>
                    <TableCell sx={{fontWeight:'bold'}}>Payment Date</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Array.isArray(payments) && payments.map((payment, index) => (
                    <TableRow key={index}>
                        <TableCell>{payment.payment_method}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.transaction_date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
