import * as React from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
    Button,
    Box,
    Typography,
    Grid2 as Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "@inertiajs/react";
import axios from 'axios';

import BatchModal from "./Partials/BatchModal";
import QuantityModal from "./Partials/QuantityModal";
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
                    src={"storage/" + params.value} // Use the value from the image_url field
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
    { field: "updated_at", headerName: "Updated At" },
];

export default function Product({ products, stores }) {
    const auth = usePage().props.auth.user;
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [quantityModalOpen, setQuantityModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(false);
    const [productsState, setProductsState] = useState(products);
    const [selectedStore, setSelectedStore] = useState(0);

    const handleProductEdit = (product, type) => {
        setSelectedProduct(product);
        console.log(product)
        type === 'batch' && setBatchModalOpen(true);
        type === 'qty' && setQuantityModalOpen(true);
    };

    const fetchProducts = async(store_id=0)=>{
        try {
            const response = await axios.get(`/getproducts/${store_id}`);  // Request to your backend
            setProductsState(response.data.products);  // Update products state with response data
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    const handleStoreChange =(e)=>{
        setSelectedStore(e.target.value)
        fetchProducts(e.target.value)
    }

    return (
        <AuthenticatedLayout>
            <Head title="Products" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
            >
                <Grid size={8} container alignItems={"center"}>
                    <Typography variant="h4" component="h2">
                        Products
                    </Typography>
                    <FormControl sx={{ ml: "0.5rem", minWidth: "200px" }}>
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
                </Grid>
                <Grid size={4} container justifyContent="end">
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
                        rows={productsState}
                        sx={
                            {
                                // '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                                // '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '10px' },
                                // '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
                            }
                        }
                        columns={productColumns(handleProductEdit)}
                        slots={{ toolbar: GridToolbar }}
                        getRowId={(row) => row.id + row.batch_number+row.store_id}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                    />
                </Box>
            </Grid>
            <BatchModal
                batchModalOpen={batchModalOpen}
                setBatchModalOpen={setBatchModalOpen}
                selectedBatch={selectedProduct}
                products={productsState}
                setProducts={setProductsState}
            />
            <QuantityModal
                modalOpen={quantityModalOpen}
                setModalOpen={setQuantityModalOpen}
                selectedStock={selectedProduct}
                products={productsState}
                setProducts={setProductsState}
                stores={stores}
            />
        </AuthenticatedLayout>
    );
}
