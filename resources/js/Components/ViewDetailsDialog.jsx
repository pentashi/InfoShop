import React, { useState, useContext, useMemo, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    IconButton,
    Grid2 as Grid,
    Divider,
    Table, TableHead, TableBody, TableRow, TableCell,
    Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentsIcon from '@mui/icons-material/Payments';

export default function ViewDetailsDialog({
    open,
    setOpen,
    selectedTransaction = null,
    type = 'sale',
}) {
    const [tabValue, setTabValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Custom TabPanel component
    const TabPanel = ({ children, value, index }) => {
        return value === index ? <Box sx={{ padding: 0 }}>{children}</Box> : null;
    };

    const [payments, setPayments] = useState([]);
    const [items, setItems] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    const fetchDetails = async (type) => {
        try {
            const response = await axios.post(`/getorderdetails/${type}`, { transaction_id: selectedTransaction });
            setPayments(response.data.payments);
            setItems(response.data.items);
        } catch (error) {
            console.error('Error fetching payments: ', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchDetails(type); 
        }
    }, [open]);

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">VIEW DETAILS</DialogTitle>
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
                <DialogContent sx={{paddingY:'5px'}}>
                    <Tabs value={tabValue} onChange={handleChange} aria-label="icon label tabs example">
                        <Tab icon={<InventoryIcon />} iconPosition="start" label="ITEMS" />
                        <Tab icon={<PaymentsIcon />} iconPosition="start" label="PAYMENTS" />
                    </Tabs>

                    <TabPanel value={tabValue} index={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Cost</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(items) &&
                                    items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.name} {item.batch_number !== null && ` | ${item.batch_number}`}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{parseFloat(item.unit_price).toFixed(2)}</TableCell>
                                            <TableCell>{parseFloat(item.unit_cost).toFixed(2)}</TableCell>
                                            <TableCell>{parseFloat(item.discount).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TabPanel>

                    {/* TabPanel for PAYMENTS Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(payments) &&
                                    payments.map((payment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{payment.payment_method}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                            <TableCell>{payment.transaction_date}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TabPanel>
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
