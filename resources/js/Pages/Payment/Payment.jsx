import * as React from "react";
import { useState, useEffect } from "react";
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
    Chip,
} from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import dayjs from "dayjs";
import Select2 from "react-select";
import numeral from "numeral";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomPagination from "@/Components/CustomPagination";

const columns = (handleRowClick) => [
    { field: "id", headerName: "ID", width: 80,
        renderCell: (params) => {
            return params.value.toString().padStart(4, "0");
        },
    },
    { field: "transaction_type", headerName: "Type", width: 100,
        renderCell: (params) => {
            return params.value.toUpperCase();
        },
    },
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
    { field: "note", headerName: "Note", width: 100 },    
    { field: "amount", headerName: "Total Amount", width: 120, align:'right',headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
     },
    
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

export default function Payment({ payments, transactionType, contacts }) {
    const [dataPayments, setDataPayments] = useState(payments);
    const [paymentSelect, setPaymentSelect] = useState(transactionType);
    const [paymentMethod, setPaymentMethod] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedContact, setSelectedContact] = useState("");
    const [totalAmount, setTotalAmount] = useState(0)
    const handleRowClick = () => {};

    const refreshPayments = (url) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["payments"], // Only reload specified properties
            onSuccess: (response) => {
                setDataPayments(response.props.payments);
            },
        };
        router.get(url,{
            contact_id: selectedContact?.id,
            payment_method: paymentMethod,
            start_date: startDate,
            end_date: endDate,
        },
        options);
    };

    const handleSelectPayments = (type) => {
        setPaymentSelect(type);
        if (type == "sales") router.get("/payments/sales?page=1");
        if (type == "purchases") router.get("/payments/purchases?page=1");
    };

    const handleContactChange = (selectedOption) => {
        setSelectedContact(selectedOption);
    };

    useEffect(() => {
        const total = Object.values(dataPayments.data).reduce((accumulator, current) => {
            return accumulator + parseFloat(current.amount);
        }, 0);
        setTotalAmount(total);
    }, [dataPayments]);

    return (
        <AuthenticatedLayout>
            <Head title="Payments" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
                justifyContent={"center"}
                size={12}
            >
                <FormControl sx={{ minWidth: "210px" }}>
                    <InputLabel>Select payments</InputLabel>
                    <Select
                        value={paymentSelect}
                        label="Select payments"
                        onChange={(e) => handleSelectPayments(e.target.value)}
                        required
                        name="payment_type"
                    >
                        <MenuItem value={"sales"}>Sales Payment</MenuItem>
                        <MenuItem value={"purchases"}>
                            Purchase Payment
                        </MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: "240px" }}>
                    <Select2
                        className="w-full"
                        placeholder="Select a contact..."
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                height: "55px",
                            }),
                        }}
                        options={contacts} // Options to display in the dropdown
                        onChange={handleContactChange} // Triggered when an option is selected
                        isClearable // Allow the user to clear the selected option
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                    ></Select2>
                </FormControl>

                <FormControl sx={{ minWidth: "210px" }}>
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

                <FormControl>
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

                <FormControl>
                    <TextField
                        label="End Date"
                        name="end_date"
                        placeholder="End Date"
                        fullWidth
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </FormControl>

                <Button
                    variant="contained"
                    onClick={() => refreshPayments(window.location.pathname)}
                    sx={{ height: "100%" }}
                >
                    <FindReplaceIcon />
                </Button>
            </Grid>

            <Box
                className="py-6 w-full"
                sx={{ display: "grid", gridTemplateColumns: "1fr", height:520}}
            >
                <DataGrid
                    rows={dataPayments?.data}
                    columns={columns(handleRowClick)}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    hideFooter
                />
            </Box>
            <Grid size={12} container justifyContent={'end'}>
            <Chip size="large" label={'Total:'+numeral(totalAmount).format('0,0.00')} color="primary" />
                <CustomPagination
                    dataLinks={dataPayments?.links}
                    refreshTable={refreshPayments}
                    dataLastPage={dataPayments?.last_page}
                ></CustomPagination>
            </Grid>
        </AuthenticatedLayout>
    );
}
