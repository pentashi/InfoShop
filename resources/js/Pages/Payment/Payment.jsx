import * as React from "react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import {
    Button,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import dayjs from "dayjs";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomPagination from "@/Components/CustomPagination";

const columns = (handleRowClick) => [
    { field: "id", headerName: "ID", width: 80 },
    { field: "contact_name", headerName: "Customer Name", width: 200 },
    {
        field: "reference_id",
        headerName: "Reference",
        width: 120,
        renderCell: (params) => {
            if (params.value === null) {
                return "N/A"; // Or any other suitable message for null values
            }
            return "#" + params.value.toString().padStart(4, "0");
        },
    },
    { field: "payment_method", headerName: "Payment Method", width: 150 },
    { field: "amount", headerName: "Total Amount", width: 120 },
    { field: "transaction_type", headerName: "Transaction Type", width: 200 },
    {
        field: "transaction_date",
        headerName: "Date",
        width: 100,
        renderCell: (params) => {
            // Format the date to 'YYYY-MM-DD'
            return dayjs(params.value).format("YYYY-MM-DD");
        },
    },
];

export default function Payment({ payments, transactionType }) {
    const [paymentsView, setPaymentsView] = useState(payments.data);
    const [paymentSelect, setPaymentSelect] = useState(transactionType);
    const [paymentMethod, setPaymentMethod] = useState("All");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleRowClick = () => {};

    const refreshPayments = () => {};

    const handleSelectPayments = (type) => {
        setPaymentSelect(type);
        if (type == "sales") router.get("/payments/sales?page=1");
        if (type == "purchases") router.get("/payments/purchases?page=1");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payments" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
            >
                <Grid size={12} container justifyContent="end">
                <FormControl sx={{ ml: "0.5rem", minWidth: "200px" }}>
                        <InputLabel>Select payments</InputLabel>
                        <Select
                            value={paymentSelect}
                            label="Select payments"
                            onChange={(e) =>
                                handleSelectPayments(e.target.value)
                            }
                            required
                            name="payment_type"
                        >
                            <MenuItem value={"sales"}>Sales Payment</MenuItem>
                            <MenuItem value={"purchases"}>
                                Purchase Payment
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ ml: "0.5rem", minWidth: "200px" }}>
                        <InputLabel>Select Payment Method</InputLabel>
                        <Select
                            value={paymentMethod}
                            label="Select Payment Method"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                            name="payment_method"
                        >
                            <MenuItem value={"All"}>All</MenuItem>
                            <MenuItem value={"Cash"}>Cash</MenuItem>
                            <MenuItem value={"Cheque"}>Cheque</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ ml: "0.5rem", minWidth: "200px" }}>
                        <TextField
                            label="Start Date"
                            name="start_date"
                            placeholder="Start Date"
                            fullWidth
                            type="date"
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </FormControl>
                    <Button variant="contained" onClick={refreshPayments}>
                        <RefreshIcon />
                    </Button>
                </Grid>

                <Box
                    className="py-6 w-full"
                    sx={{ display: "grid", gridTemplateColumns: "1fr" }}
                >
                    <DataGrid
                        rows={paymentsView}
                        columns={columns(handleRowClick)}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                    />
                </Box>
            </Grid>
            <CustomPagination
                dataLinks={payments.links}
                dataLastPage={payments.last_page}
            ></CustomPagination>
        </AuthenticatedLayout>
    );
}
