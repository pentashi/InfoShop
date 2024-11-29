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
    TextField, Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Link, router } from "@inertiajs/react";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BatchModal from "./Partials/BatchModal";
import QuantityModal from "./Partials/QuantityModal";
import CustomPagination from "@/Components/CustomPagination";
import { useState } from "react";
import numeral from "numeral";
import { filter } from "lodash";
import { useEffect } from "react";

const productColumns = (handleProductEdit) => [
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
    { field: "cost", headerName: "Cost", width: 100, align:'right',headerAlign: 'right',},
    { field: "price", headerName: "Price", width: 100, align:'right',headerAlign: 'right', },
    { field: "valuation", headerName: "Valuation", width: 100, align:'right',headerAlign: 'right',
        renderCell: (params) => {
            const price = params.row.cost;
            const quantity =  params.row.quantity;
            return numeral(price*quantity).format('0,0.00');
        },
     },
    {
        field: "quantity",
        headerName: "Quantity",
        width: 100,align:'right',headerAlign: 'right',
        valueGetter: (value) => parseFloat(value),
        renderCell: (params) => (
            <Button
                variant="text"
                color="default"
                fullWidth
                sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                    justifyContent: "flex-end",
                }}
                underline="hover"
                onClick={() => handleProductEdit(params.row, 'qty')}
            >
                {numeral(params.value).format('0,0.00')}
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
    {
        field: "action",
        headerName: "Action",
        renderCell: (params) => {
            return (
                <Link href={`/product/${params.row.batch_id}/barcode`}>
                    <QrCode2Icon color="primary" />
                </Link>
            );
        },
    },
];

export default function Product({ products, stores }) {
    const auth = usePage().props.auth.user;
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [quantityModalOpen, setQuantityModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(false);
    const [dataProducts, setDataProducts] = useState(products);

    const [filters, setFilters] = useState({
        store: 0,
        status: 1,
        search_query: "",
    });

    const handleProductEdit = (product, type) => {
        setSelectedProduct(product);
        type === 'batch' && setBatchModalOpen(true);
        type === 'qty' && setQuantityModalOpen(true);
    };

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
            filters,
            options
        );
    };

    const loadMoreProducts = () => {
        if (!dataProducts.next_page_url) return;

        router.get(
            dataProducts.next_page_url,
            filters,
            {
                preserveState: true,
                preserveScroll: true,
                only: ["products"],
                onSuccess: (response) => {
                    setDataProducts((prev) => ({
                        ...response.props.products,
                        data: [...prev.data, ...response.props.products.data], // Append new data
                    }));
                },
            }
        );
    };

    const handleNextPage = () => {
        if (dataProducts.next_page_url) {
            loadMoreProducts(dataProducts.next_page_url); // Pass the next page URL
        }
    };
    
    const handlePreviousPage = () => {
        if (dataProducts.prev_page_url) {
            loadMoreProducts(dataProducts.prev_page_url); // Pass the previous page URL
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // console.log(dataProducts);
    })

    return (
        <AuthenticatedLayout>
            <Head title="Products" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
            >
                <Grid size={12} spacing={2} container alignItems={"center"} justifyContent={{xs:'center', sm:'end'}} width={'100%'}>
                    <Grid size={{xs:6, sm:'auto'}}>
                    <FormControl sx={{ minWidth:{xs:'100%', sm:'200px'}}}>
                        <InputLabel>Store</InputLabel>
                        <Select
                            value={filters.store}
                            label="Store"
                            onChange={handleFilterChange}
                            required
                            name="store"
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

                    <Grid size={{xs:6, sm:'auto'}}>
                    <FormControl sx={{ minWidth:{xs:'100%', sm:'200px'}}}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filters.status}
                            label="Status"
                            onChange={handleFilterChange}
                            required
                            name="status"
                        >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={0}>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                    
                    <TextField
                    sx={{minWidth:'300px', width: { xs: '100%', sm: 'auto' }}}
                    fullWidth
                        name="search_query"
                        label="Search"
                        variant="outlined"
                          value={filters.search_query}
                          onChange={handleFilterChange}
                          placeholder="Barcode or Name"
                        required
                        onFocus={(event) => {
                            event.target.select();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevents form submission if inside a form
                                refreshProducts(window.location.pathname); // Trigger search on Enter
                            }
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
                        <Button variant="contained" startIcon={<AddIcon />} fullWidth>
                            Add Product
                        </Button>
                    </Link>
                </Grid>

                <Box
                    className="py-2 w-full"
                    sx={{ display: "grid", gridTemplateColumns: "1fr", height:'70vh'}}
                >
                    <DataGrid
                        rows={dataProducts.data}
                        columns={productColumns(handleProductEdit)}
                        slots={{ toolbar: GridToolbar, }}
                        getRowId={(row) => row.id + row.batch_number+row.store_id}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        initialState={{
                            columns: {
                              columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                cost: false,
                                created_at:false
                              },
                            },
                          }}
                        hideFooter
                    />
                </Box>
                <Grid size={12} spacing={2} container justifyContent={"end"} alignItems={'center'}>
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
