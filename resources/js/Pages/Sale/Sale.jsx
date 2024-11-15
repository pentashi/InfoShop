import * as React from "react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import { Button, Box, IconButton, FormControl, TextField, InputLabel, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import PaymentsIcon from "@mui/icons-material/Payments";
import Select2 from "react-select";
import numeral from "numeral";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddPaymentDialog from "@/Components/AddPaymentDialog";
import ViewPaymentDetailsDialog from "@/Components/ViewPaymentDetailsDialog";
import CustomPagination from "@/Components/CustomPagination";

const columns = (handleRowClick) => [
    {
        field: "id",
        headerName: "ID",
        width: 80,
        renderCell: (params) => {
            // Format the date to 'YYYY-MM-DD'
            return "#" + params.value.toString().padStart(4, "0");
        },
    },
    { field: "name", headerName: "Customer Name", width: 200,
        renderCell: (params) => (
            <Tooltip title={''+params.row.balance} arrow>
                <Button>{params.value}</Button>
            </Tooltip>
        ),
     },
    { field: "discount", headerName: "Discount", width: 100, align:'right',headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    { field: "total_amount", headerName: "Total", width: 120, align:'right',headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    {
        field: "amount_received",
        headerName: "Amount Received",
        width: 140, align:'right',headerAlign: 'right',
        renderCell: (params) => (
            <Button
                onClick={() => handleRowClick(params.row, "add_payment")}
                variant="text"
                fullWidth
                sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                    justifyContent: "flex-end",
                }}
            >
                {numeral(params.value).format('0,0.00')}
            </Button>
        ),
    },
    {
        field: "change",
        headerName: "Change",
        width: 100, align:'right',headerAlign: 'right',
        renderCell: (params) => {
            const change = params.row.amount_received - params.row.total_amount;
            return numeral(change).format('0,0.00');
        },
    },
    // { field: 'profit_amount', headerName: 'Profit Amount', width: 120 },
    { field: "status", headerName: "Status", width: 100 },
    {
        field: "sale_date",
        headerName: "Date",
        width: 100,
    },
    {
        field: "action",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
            <>
                <Link href={"/reciept/" + params.row.id}>
                    <IconButton color="primary">
                        <PrintIcon />
                    </IconButton>
                </Link>
                <IconButton
                    sx={{ ml: "0.3rem" }}
                    color="primary"
                    onClick={() => handleRowClick(params.row, "view_payments")}
                >
                    <PaymentsIcon />
                </IconButton>
            </>
        ),
    },
];

export default function Sale({ sales, contacts }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [viewPaymentsModalOpen, setViewPaymentsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [amountLimit, setAmountLimit] = useState(0);
    const [dataSales, setDataSales] = useState(sales);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("all");
    const [selectedFilterContact, setSelectedFilterContact] = useState(null)

    const handleRowClick = (sale, action) => {
        setSelectedTransaction(sale);
        if (action == "add_payment") {
            const amountLimit =
                parseFloat(sale.total_amount) -
                parseFloat(sale.amount_received);
            setSelectedContact(sale.contact_id);
            setAmountLimit(amountLimit);
            setPaymentModalOpen(true);
        } else if (action == "view_payments") {
            setViewPaymentsModalOpen(true);
        }
    };

    const refreshSales = (url) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["sales"], // Only reload specified properties
            onSuccess: (response) => {
                setDataSales(response.props.sales);
            },
        };
        router.get(
            url,
            {
                start_date: startDate,
                end_date: endDate,
                contact_id: selectedFilterContact?.id,
                status: status,
            },
            options
        );
    };

    const handleContactChange = (selectedOption) => {
      setSelectedFilterContact(selectedOption);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sales" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent={"end"}
                sx={{ width: "100%" }}
                size={12}
            >
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

                <FormControl sx={{ minWidth: "200px" }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        label="Status"
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        name="status"
                    >
                        <MenuItem value={"all"}>All</MenuItem>
                        <MenuItem value={"completed"}>Completed</MenuItem>
                        <MenuItem value={"pending"}>Pending</MenuItem>
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
                <Button variant="contained" onClick={()=>refreshSales(window.location.pathname)} size="large">
                    <FindReplaceIcon />
                </Button>
            </Grid>

            <Box
                className="py-6 w-full"
                sx={{ display: "grid", gridTemplateColumns: "1fr" }}
            >
                <DataGrid
                    rows={dataSales.data}
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
            <Grid size={12} container justifyContent={"end"}>
                <CustomPagination
                    dataLinks={dataSales?.links}
                    refreshTable={refreshSales}
                    dataLastPage={dataSales?.last_page}
                ></CustomPagination>
            </Grid>

            <AddPaymentDialog
                open={paymentModalOpen}
                setOpen={setPaymentModalOpen}
                selectedTransaction={selectedTransaction}
                selectedContact={selectedContact}
                amountLimit={amountLimit}
                is_customer={true}
                refreshTable={refreshSales}
            />
            <ViewPaymentDetailsDialog
                open={viewPaymentsModalOpen}
                setOpen={setViewPaymentsModalOpen}
                type={"sale"}
                selectedTransaction={selectedTransaction?.id}
            />
        </AuthenticatedLayout>
    );
}
