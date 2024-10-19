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
    IconButton,
} from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";

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
    {
        field: 'action',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
          <>
          <IconButton sx={{ml:'0.3rem'}} color="error" onClick={() => handleRowClick(params.row, "delete_expense")}>
            <DeleteIcon />
          </IconButton>
          </>
        ),
      },
];

export default function Expense({ expenses, stores }) {
    const [dataExpenses, setDataExpenses] = useState(expenses);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [expenseModalOpen, setExpenseModalOpen] = useState(false)

    const handleRowClick = (expense, action) => {
        if(action==='delete_expense'){
            deleteExpense(expense.id);
        }
    };

    const deleteExpense=(expenseID)=> {
        Swal.fire({
            title: "Do you want to remove the record?",
            showDenyButton: true,
            confirmButtonText: "YES",
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/expense/${expenseID}/delete`)
                .then((response) => {
                    const updatedData = dataExpenses.data.filter((item) => item.id !== expenseID);
                    setDataExpenses({ ...dataExpenses, data: updatedData });
                    Swal.fire({
                        title: "Success!",
                        text: response.data.message,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                })
                .catch((error) => {
                    console.error("Deletion failed with errors:", error);
                });
            }
        });
    }

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
