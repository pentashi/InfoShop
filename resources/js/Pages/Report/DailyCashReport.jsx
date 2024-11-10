import * as React from "react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import { Button, Box, FormControl, TextField } from "@mui/material";
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

    const refreshLogs = (url) => {
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
                transaction_date: transaction_date,
            },
            options
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daily Report" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
                justifyContent={"center"}
                size={12}
            >
                <FormControl>
                    <TextField
                        label="Date"
                        name="transaction_date"
                        placeholder="Transaction Date"
                        fullWidth
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={transaction_date}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        required
                    />
                </FormControl>

                <Button
                    variant="contained"
                    onClick={() => refreshLogs(window.location.pathname)}
                    sx={{ height: "100%" }}
                    size="large"
                >
                    <FindReplaceIcon />
                </Button>

                <Button
                    variant="contained"
                    onClick={() => setModalOpen(true)}
                    sx={{ height: "100%" }}
                    startIcon={<AddCircleIcon />}
                    size="large"
                >
                    ADD A RECORD
                </Button>
            </Grid>

            <Box
                className="py-6 w-full"
                sx={{ justifyContent: "center", display: "flex" }}
            >
                <TableContainer component={Paper} sx={{ maxWidth: "750px" }}>
                    <Table aria-label="customized table">
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
                                    AMOUNT
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataLogs.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.transaction_date}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.source.charAt(0).toUpperCase() + row.source.slice(1) +
                                            (row.name ? " - " + row.name : "") +
                                            (row.description
                                                ? " | " + row.description
                                                : "")}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {row.amount}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}

                            {/* Row for displaying the total sum */}
                            <StyledTableRow>
                                <StyledTableCell colSpan={3} align="right">
                                    <strong>Balance:</strong>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <strong>
                                        {dataLogs.reduce((total, row) => total + parseFloat(row.amount), 0).toFixed(2)}
                                    </strong>
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <DailyCashDialog
                open={modalOpen}
                setOpen={setModalOpen}
                stores={stores}
                refreshTransactions={refreshLogs}
            />
        </AuthenticatedLayout>
    );
}
