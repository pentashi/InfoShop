import * as React from "react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import { Button, Box, FormControl, TextField,Tooltip } from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import Select2 from "react-select";
import numeral from "numeral";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
    { field: "contact_name", headerName: "Customer Name", width: 200,
        renderCell: (params) => (
            <Tooltip title={''+params.row.balance} arrow>
                <Button>{params.value}</Button>
            </Tooltip>
        ),
     },
    { field: "product_name", headerName: "Product Name", width: 200,},
    { field: "quantity", headerName: "Quantity", width: 100, align:'right', headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    { field: "discount", headerName: "Discount", width: 100, align:'right',headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    { field: "unit_cost", headerName: "Cost", width: 100, align:'right', headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    { field: "unit_price", headerName: "Price", width: 100, align:'right', headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    {
        field:'total',
        headerName: "Total",
        width: 100,
        align:'right',
        headerAlign: 'right',
        renderCell: (params) => {
            const change = (params.row.unit_price - params.row.discount)*params.row.quantity;
            return numeral(change).format('0,0.00');
        },
    },
    // { field: 'profit_amount', headerName: 'Profit Amount', width: 120 },
    {
        field: "sale_date",
        headerName: "Date",
        width: 100,
    },

];

export default function SoldItem({ sold_items, contacts }) {
    const [dataSoldItems, setDataSoldItems] = useState(sold_items);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedFilterContact, setSelectedFilterContact] = useState(null)

    const handleRowClick = (sold_item, action) => {
        
    };

    const refreshSoldItems = (url) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["sold_items"], // Only reload specified properties
            onSuccess: (response) => {
                setDataSoldItems(response.props.sold_items);
            },
        };
        router.get(
            url,
            {
                start_date: startDate,
                end_date: endDate,
                contact_id: selectedFilterContact?.id,
            },
            options
        );
    };

    const handleContactChange = (selectedOption) => {
      setSelectedFilterContact(selectedOption);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sold Items" />
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
                <Button variant="contained" onClick={()=>refreshSoldItems(window.location.pathname)} size="large">
                    <FindReplaceIcon />
                </Button>
            </Grid>

            <Box
                className="py-6 w-full"
                sx={{ display: "grid", gridTemplateColumns: "1fr", height:520}}
            >
                <DataGrid
                    rows={dataSoldItems.data}
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
                    dataLinks={dataSoldItems?.links}
                    refreshTable={refreshSoldItems}
                    dataLastPage={dataSoldItems?.last_page}
                ></CustomPagination>
            </Grid>
        </AuthenticatedLayout>
    );
}
