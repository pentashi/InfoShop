import * as React from "react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head,router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import {
    Button,
    Box,
    TextField,
    Chip,
} from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import dayjs from "dayjs";
import numeral from "numeral";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomPagination from "@/Components/CustomPagination";

const columns = () => [
    { field: "id", headerName: "ID", width: 80,
        renderCell: (params) => {
            return params.value.toString().padStart(4, "0");
        },
    },
    { field: "sale_date", headerName: "Date", width: 120,
        renderCell: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },
    { field: "account_number", headerName: "Account Number", width: 200 },
    { field: "product_name", headerName: "Product Name", width: 150 },
    { field: "unit_price", headerName: "Amount", width: 100 },
    { field: "additional_commission", headerName: "Additional Commission", width: 150, align: "right", headerAlign: "right",
        renderCell: (params) => numeral(params.value).format('0,0.00'),
    },
    { field: "commission", headerName: "Commission", width: 100, align: "right", headerAlign: "right",
        renderCell: (params) => numeral(params.value).format('0,0.00'),
    },
    { field: "description", headerName: "Description", width: 250 },
];

export default function Reload({ reloads, transactionType }) {
    const [dataReloads, setDataReloads] = useState(reloads);
    const [totalCommission, setTotalCommission] = useState(0);
    const handleRowClick = () => {};
    const [searchTerms, setSearchTerms] = useState({
        start_date: '',
        end_date: '',
        store: 0,
    });

    const refreshReloads = (url) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["reloads"], // Only reload specified properties
            onSuccess: (response) => {
                setDataReloads(response.props.reloads || []);
            },
        };
        router.get(url, searchTerms, options);
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchTerms((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        refreshReloads(window.location.pathname);
    };

    useEffect(() => {
        const total = dataReloads.data.reduce((acc, curr) => acc + parseFloat(curr.commission || 0), 0);
        setTotalCommission(total);
    }, [dataReloads]);

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
                <Grid size={{xs:12, sm:4}}>
                <TextField
                        label="Search Query"
                        name="search_query"
                        placeholder="Search by account or product name"
                        value={searchTerms.search_query}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                </Grid>
                <Grid size={{xs:6, sm:2}}>
                <TextField
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={searchTerms.start_date}
                        onChange={handleSearchChange}
                        fullWidth
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Grid>
                <Grid size={{xs:6, sm:2}}>
                <TextField
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={searchTerms.end_date}
                        onChange={handleSearchChange}
                        fullWidth
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Grid>

                <Grid size={{xs:12, sm:1}}>
                <Button variant="contained" fullWidth onClick={handleSearch} sx={{ height: "100%" }}>
                    <FindReplaceIcon />
                </Button>
                </Grid>
                
            </Grid>

            <Box
                className="py-6 w-full"
                sx={{ display: "grid", gridTemplateColumns: "1fr", height:'73vh'}}
            >
                <DataGrid
                    rows={dataReloads?.data}
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
            <Chip size="large" label={`Total Commission: ${numeral(totalCommission).format('0,0.00')}`} color="primary" />
                <CustomPagination
                    dataLinks={reloads?.links}
                    refreshTable={refreshReloads}
                    dataLastPage={reloads?.last_page}
                />
            </Grid>
        </AuthenticatedLayout>
    );
}
