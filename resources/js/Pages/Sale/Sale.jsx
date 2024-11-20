import * as React from "react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import { Button, Box, IconButton, TextField, MenuItem, Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Select2 from "react-select";
import numeral from "numeral";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddPaymentDialog from "@/Components/AddPaymentDialog";
import ViewDetailsDialog from "@/Components/ViewDetailsDialog";
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
    {
        field: "invoice_number",
        headerName: "No",
        width: 150,
        renderCell: (params) => {
            // Format the date to 'YYYY-MM-DD'
            return "#" + params.value.toString().padStart(4, "0");
        },
    },
    {
        field: "name", headerName: "Customer Name", width: 200,
        renderCell: (params) => (
            <Tooltip title={'' + params.row.balance} arrow>
                <Button>{params.value}</Button>
            </Tooltip>
        ),
    },
    {
        field: "discount", headerName: "Discount", width: 80, align: 'right', headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    {
        field: "total_amount", headerName: "Total", width: 120, align: 'right', headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    {
        field: "amount_received",
        headerName: "Received",
        width: 130, align: 'right', headerAlign: 'right',
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
        width: 100, align: 'right', headerAlign: 'right',
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
                    onClick={() => handleRowClick(params.row, "view_details")}
                >
                    <VisibilityIcon />
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

    const [searchTerms, setSearchTerms] = useState({
        start_date: dayjs().format("YYYY-MM-DD"),
        end_date: dayjs().format("YYYY-MM-DD"),
        store: 0,
        contact: '',
        status: 'all',
        query: '',
    });

    const handleRowClick = (sale, action) => {
        setSelectedTransaction(sale);
        if (action == "add_payment") {
            const amountLimit =
                parseFloat(sale.total_amount) -
                parseFloat(sale.amount_received);
            setSelectedContact(sale.contact_id);
            setAmountLimit(amountLimit);
            setPaymentModalOpen(true);
        } else if (action == "view_details") {
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
            url, { ...searchTerms, contact_id: searchTerms.contact?.id },
            options
        );
    };

    const handleSearchChange = (input) => {
        if (input?.target) {
            // Handle regular inputs (e.g., TextField)
            const { name, value } = input.target;
            setSearchTerms((prev) => ({ ...prev, [name]: value }));
        } else {
            // Handle Select2 inputs (e.g., contact selection)
            setSearchTerms((prev) => ({
                ...prev,
                contact: input, // Store selected contact or null
            }));
        }
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
                    <Grid size={{ xs: 12, sm: 3 }}>
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
                            onChange={(selectedOption) => handleSearchChange(selectedOption)}
                            isClearable // Allow the user to clear the selected option
                            getOptionLabel={(option) => option.name + ' | ' + option.balance}
                            getOptionValue={(option) => option.id}
                        ></Select2>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            value={searchTerms.status}
                            label="Status"
                            onChange={handleSearchChange}
                            name="status"
                            select
                            fullWidth
                        >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={"completed"}>Completed</MenuItem>
                            <MenuItem value={"pending"}>Pending</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 2 }}>
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
                            value={searchTerms.start_date}
                            onChange={handleSearchChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, sm: 2 }}>
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
                            value={searchTerms.end_date}
                            onChange={handleSearchChange}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            value={searchTerms.query}
                            label="Search"
                            onChange={handleSearchChange}
                            name="query"
                            fullWidth
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // Prevents form submission if inside a form
                                    refreshSales(window.location.pathname); // Trigger search on Enter
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 1 }}>
                        <Button variant="contained" type="submit" fullWidth onClick={() => refreshSales(window.location.pathname)} size="large">
                            <FindReplaceIcon />
                        </Button>
                    </Grid>

                </Grid>

            <Box
                className="py-6 w-full"
                sx={{ display: "grid", gridTemplateColumns: "1fr", height:520}}
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
            <ViewDetailsDialog
                open={viewPaymentsModalOpen}
                setOpen={setViewPaymentsModalOpen}
                type={"sale"}
                selectedTransaction={selectedTransaction?.id}
            />
        </AuthenticatedLayout>
    );
}
