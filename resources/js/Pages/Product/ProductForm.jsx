import * as React from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from 'react';
import { Head, usePage,router } from "@inertiajs/react";
import { Button, Box, Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Autocomplete from "@mui/material/Autocomplete";
import { Link } from '@inertiajs/react'
import HomeIcon from "@mui/icons-material/Home";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from '@mui/material/Grid2';
import "dayjs/locale/en-gb";
import Swal from 'sweetalert2';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SaveIcon from '@mui/icons-material/Save';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const options = ["Brand 1", "Brand 2"];
const units = ["PC", "KG"];

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default function Product({ product, collection }) {
    const [imageUrl, setImageUrl] = useState('https://placehold.co/600x400');//Featured image
    const [manageStock, setManageStock] = React.useState('1');
    const [productUnit, setProductUnit] = React.useState('PC');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sku: '',
        barcode: '',
        featured_image: 'https://placehold.co/600x400', // For file input
        unit: '',
        quantity: 0,
        alert_quantity: 0,
        is_stock_managed: false,
        is_active: false,
        brand_id: '',
        category_id: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    featured_image: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || '',
                sku: product.sku || '',
                barcode: product.barcode || '',
                featured_image: product.image_url?'/storage/'+product.image_url : 'https://placehold.co/600x400', // Reset file input on edit
                unit: product.unit || '',
                quantity: product.quantity || 0,
                alert_quantity: product.alert_quantity || 0,
                is_stock_managed: product.is_stock_managed || false,
                is_active: product.is_active || false,
                brand_id: product.brand_id || '',
                category_id: product.category_id || '',
            });
            setManageStock(product.is_stock_managed.toString());
        }
    }, [product]);

    // Filter and map the collection
    const brandOptions = collection
    .filter(item => item.collection_type === 'brand')
    .map(({ id, name }) => ({ id, label: name }));

    // Filter and map the collection
    const categoryOptions = collection
    .filter(item => item.collection_type === 'category')
    .map(({ id, name }) => ({ id, label: name }));

    const handleStockChange = (event,newStatus ) => {
        if(!newStatus)setManageStock('0');
        else setManageStock('1');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        formJson.brand_id = selectedBrand?.id ?? '';
        formJson.category_id = selectedCategory?.id ?? '';
        console.log(formJson);

        router.post('/product/store', formJson, {
            forceFormData: true,
            onSuccess: (resp) => {
              Swal.fire({
                title: 'Success!',
                text: 'Successfully saved',
                icon: 'success',
                position: 'bottom-start',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                toast: true,
              });
              router.get('/products', options)
            },
            onError: (errors) => {
              console.error('Submission failed with errors:', errors);
            },
          });
    }

    const [selectedBrand, setSelectedBrand] = useState(
        brandOptions.find(option => option.id === null) || null // Default value if needed
    );

    const [selectedCategory, setSelectedCategory] = useState(
        categoryOptions.find(option => option.id === null) || null // Default value if needed
    );

    const handleUnitChange = (event) => {
        setProductUnit(event.target.value);
    };

    return (
       
        <AuthenticatedLayout>
            {console.log(product)}
            <Head title="Products" />
            <form id="product-form" encType="multipart/form-data" method="post" onSubmit={handleSubmit}>
                <input name="is_stock_managed" type="hidden" value={manageStock}/>
                <Box className="mb-10">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            sx={{ display: "flex", alignItems: "center" }}
                            color="inherit"
                            href="/"
                        >
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Home
                        </Link>
                        <Link underline="hover" color="inherit" href="/products">
                            Products
                        </Link>
                        <Typography sx={{ color: "text.primary" }}>
                            Add Product
                        </Typography>
                    </Breadcrumbs>
                </Box>
                <Box className="sm:columns-1 md:columns-2 mb-4">
                    {/* Barcode */}
                    <div className="mb-3">
                        <TextField
                            label="Barcode"
                            id="barcode"
                            name="barcode"
                            fullWidth
                            required
                            value={formData.barcode}
                            onChange={handleChange}
                        />
                    </div>

                    {/* SKU */}
                    <div className="mb-3">
                        <TextField label="SKU" id="sku" name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        fullWidth />
                    </div>

                    <div className="mb-3">
                        <TextField
                            label="Product Name"
                            id="product-name"
                            name="name"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                    <FormControl fullWidth  style={{marginTop:'0', marginBottom:'0'}} margin="dense">
                        <InputLabel id="product-unit-label" >Product Unit</InputLabel>
                        <Select
                            labelId="product-unit-label"
                            id="product_unit"
                            value={productUnit}
                            label="Type"
                            onChange={handleUnitChange}
                            name="unit"
                        >
                        <MenuItem value={'PC'}>PC</MenuItem>
                        <MenuItem value={'KG'}>KG</MenuItem>
                        <MenuItem value={'Meter'}>Meter</MenuItem>
                        </Select>
                    </FormControl>

                        {/* <Autocomplete
                            disablePortal
                            options={units}
                            fullWidth
                            name="unit"
                            defaultValue={units[0]}
                            renderInput={(params) => (
                                <TextField {...params} label="Product Unit" />
                            )}
                        /> */}
                    </div>
                </Box>

                <Divider></Divider>
                <Box sx={{ mt: 3, mb:4 }}>
                <Typography variant="h5" color="initial">
                    Stock

                    <ToggleButtonGroup
                    color="primary"
                    value={manageStock}
                    exclusive
                    onChange={handleStockChange}
                    aria-label="Manage stock"
                    className="ml-4"
                    >
                    <ToggleButton value="1">Manage Stock</ToggleButton>
                    </ToggleButtonGroup>

                </Typography>

                

                </Box>
                

                <Box className="sm:columns-1 md:columns-5 mb-4 mt-4">
                    {/* Cost */}
                    <div className="mb-3">
                        <TextField
                            label="Cost"
                            id="cost"
                            name="cost"
                            type="number"
                            fullWidth
                            required
                            min={0}
                            slotProps={{
                                input: {
                                    min: 0,
                                },
                            }}
                        />
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                        <TextField
                            label="Price"
                            id="price"
                            name="price"
                            type="number"
                            fullWidth
                            required
                        />
                    </div>

                    {/* Quantity */}
                    <div className="mb-3">
                        <TextField
                            label="Quantity"
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="0"
                            fullWidth
                            required
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <TextField
                            label="Batch number"
                            id="batch-number"
                            name="batch_number"
                            fullWidth
                        />
                    </div>

                    <div className="mb-3">
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="en-gb"
                        >
                            <DatePicker
                                name="expiry_date"
                                label="Expiry Date"
                                className="w-full"
                            />
                        </LocalizationProvider>
                    </div>
                </Box>

                <Box className="sm:columns-1 md:columns-3 mb-4">
                    {/* Quantity */}
                </Box>

                <Divider></Divider>
                <Typography variant="h5" sx={{ mt: 2 }} color="initial">
                    More Information
                </Typography>

                <Box sx={{ flexGrow: 1 }} className="pb-10 mt-4">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                        <div className="mb-3">
                        <Autocomplete
                            disablePortal
                            // defaultValue={brandOptions.find(option => option.id === null)}
                            value={selectedBrand}
                            onChange={(event, newValue) => {
                                setSelectedBrand(newValue);
                            }}
                            getOptionLabel={(options)=>options.label}
                            options={brandOptions}
                            fullWidth
                            name="brand"
                            id="brand"
                            renderInput={(params) => (
                                <TextField {...params} label="Brand" name="brand" />
                            )}
                        />
                    </div>
                    <div className="mb-3">
                        <Autocomplete
                            disablePortal
                            value={selectedCategory}
                            onChange={(event, newValue) => {
                                setSelectedCategory(newValue);
                            }}
                            options={categoryOptions}
                            getOptionLabel={(options)=>options.label}
                            fullWidth
                            name="category"
                            id="category"
                            renderInput={(params) => (
                                <TextField {...params} label="Category" />
                            )}
                        />
                    </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                    
                        {/* Product Description */}
                        <div className="mb-3">
                            <TextField
                                label="Product Description"
                                id="product-description"
                                name="description"
                                multiline
                                rows={4}
                                fullWidth
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        </Grid>

                        <Grid size={{ xs: 12, md: 12 }} className="flex justify-center">
                        <Card sx={{width:{xs:'100%', sm:350}}}>
                            <CardMedia
                                sx={{ height: 300 }}
                                image={formData.featured_image}
                                title="green iguana"
                            />

                            <CardActions className="mt-0">
                            {/* <Box sx={{ flexGrow: 1 }} /> */}
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    fullWidth
                                    >
                                    Upload image
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={handleFileChange}
                                        name="featured_image"
                                    />
                                </Button>
                            </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                <AppBar position="fixed"  variant="contained" sx={{ top: 'auto', bottom: 0 }}>
                    <Toolbar>
                
                    <Box sx={{ flexGrow: 1 }} />

                        <Button variant="contained" type="submit" color="success" size="large" endIcon={<SaveIcon />}>
                            SAVE
                        </Button>
                        
                    </Toolbar>
                </AppBar>
            </form>

        </AuthenticatedLayout>
    );
}
