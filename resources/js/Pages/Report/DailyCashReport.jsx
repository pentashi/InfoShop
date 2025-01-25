import * as React from "react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import { Button, TextField, Typography } from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import dayjs from "dayjs";
import axios from "axios";
import numeral from "numeral";

import DailyCashDialog from "./Partial/DailyCashDialog";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    padding: 10,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },

}));

export default function DailyReport({ logs, stores }) {
    const [dataLogs, setDataLogs] = useState(logs);
    const [transaction_date, setTransactionDate] = useState(
        dayjs().format("YYYY-MM-DD")
    );
    const [modalOpen, setModalOpen] = useState(false);

    const refreshLogs = (url = window.location.pathname, selected_date = transaction_date) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["logs"], // Only reload specified properties
            onSuccess: (response) => {
                setDataLogs(response.props.logs);
            },
        };
        router.get(
            url,
            {
                transaction_date: selected_date,
            },
            options
        );
    };

    useEffect(() => {
        // refreshLogs();
    }, [transaction_date])

    const totalCashIn = dataLogs.reduce((sum, row) => sum + parseFloat(row.cash_in), 0);
    const totalCashOut = dataLogs.reduce((sum, row) => sum + parseFloat(row.cash_out), 0);

    return (
        <AuthenticatedLayout>
            <Head title="Daily Report" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                // sx={{ width: "100%" }}
                justifyContent={"center"}
                size={12}
                sx={{ mb: 1 }}
            >
                <Grid size={{ xs: 8, sm: 4, md: 2 }}>
                    <TextField
                        label="Date"
                        name="transaction_date"
                        placeholder="Transaction Date"
                        fullWidth
                        type="date"
                        sx={{ height: "100%" }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={transaction_date}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            setTransactionDate(newDate); // Update the state with the new date
                            refreshLogs(window.location.pathname, newDate)
                        }}
                        required
                    />
                </Grid>
                <Grid size={{ xs: 4, sm: 2, md: 1 }}>
                    <Button
                        variant="contained"
                        onClick={() => refreshLogs(window.location.pathname)}
                        sx={{ height: "100%", }}
                        fullWidth
                        size="large"
                    >
                        <FindReplaceIcon />
                    </Button>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Button
                        variant="contained"
                        onClick={() => setModalOpen(true)}
                        sx={{ height: "100%", }}
                        startIcon={<AddCircleIcon />}
                        size="large"
                        fullWidth
                    >
                        ADD A RECORD
                    </Button>
                </Grid>

            </Grid>

            <Grid container justifyContent={'center'}>
                <Paper sx={{ width: { xs: '94vw', sm: '100%' }, overflow: 'hidden', maxWidth: '900px' }} >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>#</StyledTableCell>
                                    <StyledTableCell align="left" sx={{ width: "120px" }}>
                                        DATE
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        DESCRIPTION
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        CASH IN
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        CASH OUT
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataLogs.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell component="th" scope="row">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
                                            {row.transaction_date}
                                        </StyledTableCell>
                                        <StyledTableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
                                            {
                                                row.source.charAt(0).toUpperCase() + row.source.slice(1) +
                                                (row.sales_id ? ' (#' + row.sales_id + ')' : "") +
                                                (row.name ? " - " + row.name : "") +
                                                (row.description ? " | " + row.description : "") +

                                                (row.transaction_type == 'account' ? " (Balance update)" : "")
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.cash_in == 0 ? '-' : numeral(row.cash_in).format('0,0.00')}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.cash_out == 0 ? '-' : numeral(row.cash_out).format('0,0.00')}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}

                                {/* Add Total Row */}
                                <StyledTableRow>
                                    <StyledTableCell colSpan={3} align="right">
                                        <strong>Total:</strong>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <strong>{numeral(totalCashIn).format('0,0.00')}</strong>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <strong>{numeral(totalCashOut).format('0,0.00')}</strong>
                                    </StyledTableCell>
                                </StyledTableRow>

                                <StyledTableRow>
                                    <StyledTableCell colSpan={5} align="right">

                                    </StyledTableCell>
                                </StyledTableRow>

                                {/* Row for displaying the total sum */}
                                <StyledTableRow>
                                    <StyledTableCell colSpan={4} align="right">
                                        <Typography variant="h5" color="initial">
                                            <strong>Balance:</strong>
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Typography variant="h5" color="initial">
                                            <strong>
                                                {numeral(dataLogs.reduce((total, row) => total + parseFloat(row.amount), 0)).format('0,0.00')}
                                            </strong>
                                        </Typography>

                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            <DailyCashDialog
                open={modalOpen}
                setOpen={setModalOpen}
                stores={stores}
                refreshTransactions={refreshLogs}
            />
        </AuthenticatedLayout>
    );
}
