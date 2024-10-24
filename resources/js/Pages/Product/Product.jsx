import * as React from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
    Button,
    Box,
    Grid2 as Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField, Typography, Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, router } from "@inertiajs/react";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BatchModal from "./Partials/BatchModal";
import QuantityModal from "./Partials/QuantityModal";
import CustomPagination from "@/Components/CustomPagination";
import { useState } from "react";

const productColumns = (handleProductEdit) => [
    // { field: "id", headerName: "ID", width: 70 },
    {
        field: "image_url",
        headerName: "Image",
        width: 100,
        renderCell: (params) =>
            params.value ? ( // Check if params.value is not null
                <img
                    src={params.value} // Use the value from the image_url field
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        padding: "5px",
                        paddingBottom: "5px",
                        paddingLeft: "0",
                    }} // Adjust the size as needed
                    alt="Product Image" // Alt text for accessibility
                />
            ) : (
                <span
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        padding: "5px",
                        paddingBottom: "5px",
                        paddingLeft: "0",
                    }}
                    className="text-center"
                >
                    No Image
                </span> // Render fallback if no image URL
            ),
    },
    {
        field: "name",
        headerName: "Product Name",
        width: 200,
        renderCell: (params) => (
            <Link
                underline="hover"
                className="hover:underline"
                href={"/products/" + params.row.id + "/edit"}
            >
                <p className="font-bold">{params.value}</p>
            </Link>
        ),
    },
    { field: "barcode", headerName: "Barcode", width: 170 },
    {
        field: "batch_number",
        headerName: "Batch",
        width: 150,
        renderCell: (params) => (
            <Button
                onClick={() => handleProductEdit(params.row, "batch")}
                variant="text"
                fullWidth
                sx={{
                    textAlign: "left",
                    fontWeight: "bold",
                    justifyContent: "flex-start",
                }}
            >
                {params.value}
            </Button>
        ),
    },
    { field: "cost", headerName: "Cost", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
    {
        field: "quantity",
        headerName: "Quantity",
        width: 100,
        valueGetter: (value) => parseFloat(value),
        renderCell: (params) => (
            <Button
                variant="text"
                color="default"
                fullWidth
                sx={{ fontWeight: "bold" }}
                underline="hover"
                onClick={() => handleProductEdit(params.row, 'qty')}
            >
                {params.value.toFixed(2)}
            </Button>
        ),
    },
    { field: "created_at", headerName: "Created At" },
    {
        field: "is_featured",
        headerName: "Featured",
        renderCell: (params) => {
            if (params.value === 1) {
                return (
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                        <StarIcon color="primary" />
                    </Box>
                );
            }
            else{
                return (
                    <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                        <StarBorderIcon color="primary" />
                    </Box>
                );
            }
        },
    },
];

export default function Product({ products, stores }) {
    const auth = usePage().props.auth.user;
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [quantityModalOpen, setQuantityModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(false);
    const [dataProducts, setDataProducts] = useState(products);
    const [selectedStore, setSelectedStore] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(1);
    const [searchQuery, setSearchQuery] = useState('')

    const handleProductEdit = (product, type) => {
        setSelectedProduct(product);
        console.log(product)
        type === 'batch' && setBatchModalOpen(true);
        type === 'qty' && setQuantityModalOpen(true);
    };

    const handleStoreChange =(e)=>{
        const newStore = e.target.value;
        setSelectedStore(newStore);
    }

    const handleStatusChange =(e)=>{
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);
    }

    const refreshProducts = (url=window.location.pathname) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["products"], // Only reload specified properties
            onSuccess: (response) => {
                setDataProducts(response.props.products);
            },
        };
        router.get(
            url,
            {
                store:selectedStore, 
                search_query:searchQuery,
                status:selectedStatus
            },
            options
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
            >
                <Grid size={12} container alignItems={"center"} justifyContent={'end'} width={'100%'}>
                    <FormControl sx={{ ml: "0.5rem", minWidth: "200px",}}>
                        <InputLabel>Store</InputLabel>
                        <Select
                            value={selectedStore}
                            label="Store"
                            onChange={handleStoreChange}
                            required
                            name="store_id"
                        >
                            <MenuItem value={0}>All</MenuItem>
                            {stores.map((store) => (
                                <MenuItem key={store.id} value={store.id}>
                                    {store.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ ml: "0.5rem", minWidth: "200px" }}>
                        <InputLabel>Store</InputLabel>
                        <Select
                            value={selectedStatus}
                            label="Status"
                            onChange={handleStatusChange}
                            required
                            name="status"
                        >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={0}>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                    sx={{minWidth:'300px', ml: "0.5rem",}}
                        name="search_query"
                        label="Search"
                        variant="outlined"
                          value={searchQuery}
                          onChange={(e)=>setSearchQuery(e.target.value)}
                          placeholder="Barcode or Name"
                        required
                        onFocus={(event) => {
                            event.target.select();
                        }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                    <Button variant="contained" onClick={()=>refreshProducts(window.location.pathname)} size="large">
                    <FindReplaceIcon />
          </Button>
          <Link href="/products/create">
                        <Button variant="contained" startIcon={<AddIcon />}>
                            Add Product
                        </Button>
                    </Link>
                </Grid>

                <Box
                    className="py-6 w-full"
                    sx={{ display: "grid", gridTemplateColumns: "1fr" }}
                >
                    <DataGrid
                        rows={dataProducts.data}
                        columns={productColumns(handleProductEdit)}
                        slots={{ toolbar: GridToolbar }}
                        getRowId={(row) => row.id + row.batch_number+row.store_id}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        hideFooter
                    />
                </Box>
                <Grid size={12} spacing={2} container justifyContent={"end"}>
                    <Chip size="large" label={'Total Items :'+dataProducts.total} color="primary" />
                <CustomPagination
                    dataLinks={dataProducts?.links}
                    refreshTable={refreshProducts}
                    dataLastPage={dataProducts?.last_page}
                ></CustomPagination>
            </Grid>
            </Grid>
            <BatchModal
                batchModalOpen={batchModalOpen}
                setBatchModalOpen={setBatchModalOpen}
                selectedBatch={selectedProduct}
                products={dataProducts.data}
                setProducts={setDataProducts}
                refreshProducts={refreshProducts}
                selectedProduct={selectedProduct}
            />
            <QuantityModal
                modalOpen={quantityModalOpen}
                setModalOpen={setQuantityModalOpen}
                selectedStock={selectedProduct}
                products={dataProducts.data}
                setProducts={setDataProducts}
                refreshProducts={refreshProducts}
                stores={stores}
            />
        </AuthenticatedLayout>
    );
}
