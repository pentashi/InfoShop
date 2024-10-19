import * as React from "react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head,router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import {
    Button,
    Box,
    FormControl,
    TextField,
} from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import dayjs from "dayjs";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomPagination from "@/Components/CustomPagination";
import ExpenseDialog from "./Partials/ExpenseDialog";

const columns = (handleRowClick) => [
    { field: "id", headerName: "ID", width: 80 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "amount", headerName: "Amount", width: 120 }, 
    {
        field: "expense_date",
        headerName: "Date",
        width: 100,
        renderCell: (params) => {
            // Format the date to 'YYYY-MM-DD'
            return dayjs(params.value).format("YYYY-MM-DD");
        },
    },
];

export default function Expense({ expenses, stores }) {
    const [dataExpenses, setDataExpenses] = useState(expenses);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [expenseModalOpen, setExpenseModalOpen] = useState(false)

    const handleRowClick = () => {};

    const refreshExpenses = (url) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["expenses"], // Only reload specified properties
            onSuccess: (response) => {
                setDataExpenses(response.props.expenses);
            },
        };
        router.get(url,{
            start_date: startDate,
            end_date: endDate,
        },
        options);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Expenses" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
                justifyContent={"end"}
                size={12}
            >
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
                    onClick={() => refreshExpenses(window.location.pathname)}
                    sx={{ height: "100%" }}
                    size="large"
                >
                    <FindReplaceIcon />
                </Button>

                <Button
                    variant="contained"
                    onClick={() => setExpenseModalOpen(true)}
                    sx={{ height: "100%" }}
                    startIcon={<AddCircleIcon />}
                    size="large"
                >
                    ADD EXPENSE
                </Button>
            </Grid>

            <Box
                className="py-6 w-full"
                sx={{ display: "grid", gridTemplateColumns: "1fr" }}
            >
                <DataGrid
                    rows={dataExpenses?.data}
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
                    dataLinks={dataExpenses?.links}
                    refreshTable={refreshExpenses}
                    dataLastPage={dataExpenses?.last_page}
                ></CustomPagination>
            </Grid>

            <ExpenseDialog
                open={expenseModalOpen}
                setOpen={setExpenseModalOpen}
                stores={stores}
                refreshExpenses={refreshExpenses}
            />
        </AuthenticatedLayout>
    );
}
