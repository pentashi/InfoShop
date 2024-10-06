import * as React from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect, useContext } from "react";
import { Head, router, Link } from "@inertiajs/react";
import {
    Button,
    Box,
    Divider,
    Typography,
    Grid2 as Grid,
    InputLabel,
    IconButton,
    Autocomplete,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Checkbox,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/en-gb";
import Swal from "sweetalert2";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { styled } from "@mui/material/styles";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FormDialog from "@/Pages/Contact/Partial/FormDialog";

import AddBoxIcon from '@mui/icons-material/AddBox';
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import { blue } from "@mui/material/colors";

import Select2 from "react-select";
import axios from "axios";

import { SharedContext } from "@/Context/SharedContext";

export default function Product({ vendors, purchase, stores }) {
    const [store, setStore] = React.useState("");

    const [open, setOpen] = useState(false);
    const [vendorList, setvendorList] = useState(vendors);
    const [selectedvendor, setSelectedvendor] = useState(null);
    const [barcodeChecked, setBarcodeChecked] = useState(true);

    const [productOptions, setProductOptions] = useState([]); // Stores the options from the API
    const [selectedProductOption, setSelectedProductOption] = useState(null); // Stores the selected option
    const [inputValue, setInputValue] = useState("");

    const handleClose = () => {
        setOpen(false);
    };

    // Function to fetch product data based on the input value (user's search query)
    const fetchProducts = (input) => {
        if (!input) {
            setProductOptions([]); // Clear options if input is empty
            return;
        }

        axios
            .get(`/products/search?q=${input}`, {
                params: { input, barcodeChecked },
            }) // Send input as a query to your API
            .then((response) => {
                const products = response.data.products;
                setProductOptions(products);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    };

    // Handle input change (this is called when user types in the input field)
    const handleInputChange = (newValue) => {
        setInputValue(newValue); // Update the input value state
        fetchProducts(newValue); // Fetch products based on the new input value
    };

    // Handle selection change (when the user selects an option from the dropdown)
    const handleChange = (selectedOption) => {
        setSelectedProductOption(selectedOption);
        console.log(
            "Selected product:",
            selectedOption ? selectedOption : null
        );
    };

    const handleBarcodeChange = (event) => {
        setBarcodeChecked(event.target.checked); // Update the checked state
    };

    //   Reload the table after form success
    const handleFormSuccess = (contact) => {
        setvendorList((prevvendors) => {
            // Create the new vendor object
            const newvendor = {
                id: contact.id,
                name: contact.name,
                balance: contact.balance,
            };

            // Update the vendor list
            const updatedvendorList = [...prevvendors, newvendor];

            // Select the newly added vendor directly
            setSelectedvendor(newvendor); // Set selected vendor to the new vendor

            return updatedvendorList; // Return the updated list
        });
    };

    useEffect(() => {
        if (vendorList) {
            const initialvendor = vendorList.find((vendor) => vendor.id === 1);
            setSelectedvendor(initialvendor || null);
        }
    }, [vendors]);

    const handleStoreChange = (event) => {
        setStore(event.target.value);
    };
    return (
        <AuthenticatedLayout>
            <Head title="Add Purchase" />
            <form
                id="purchase-form"
                encType="multipart/form-data"
                // onSubmit={handleSubmit}
            >
                <Box className="mb-10">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            sx={{ display: "flex", alignItems: "center" }}
                            color="inherit"
                            href="/"
                        >
                            <HomeIcon
                                sx={{ mr: 0.5, mb: "3px" }}
                                fontSize="inherit"
                            />
                            Home
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/purchases"
                        >
                            Purchases
                        </Link>
                        <Typography sx={{ color: "text.primary" }}>
                            {purchase ? "Edit Product" : "Add Purchase"}
                        </Typography>
                    </Breadcrumbs>
                </Box>

                <Grid container spacing={2}>
                    <Grid size={3}>
                        <FormControl fullWidth>
                            <InputLabel>Store</InputLabel>
                            <Select
                                value={store}
                                label="Store"
                                onChange={handleStoreChange}
                                required
                            >
                                {stores.map((store) => (
                                    <MenuItem key={store.id} value={store.id}>
                                        {store.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={2}>
                        <TextField
                            label="Reference No"
                            name="reference_no"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={3}>
                        <TextField
                            label="Purchase Date"
                            name="purchase_date"
                            placeholder="Purchase Date"
                            fullWidth
                            type="date"
                            defaultValue={
                                new Date().toISOString().split("T")[0]
                            }
                            required
                        />
                    </Grid>
                    <Grid size={4} className="flex items-center">
                        {Array.isArray(vendorList) && (
                            <Autocomplete
                                disablePortal
                                // sx={{width:'300px'}}
                                options={vendorList}
                                fullWidth
                                required
                                value={selectedvendor || null}
                                getOptionKey={(option) => option.id}
                                getOptionLabel={(option) =>
                                    typeof option === "string"
                                        ? option
                                        : option.name +
                                          " | " +
                                          parseFloat(option.balance).toFixed(2)
                                }
                                onChange={(event, newValue) => {
                                    setSelectedvendor(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Vendor" />
                                )}
                            />
                        )}
                        <IconButton
                            onClick={() => setOpen(true)}
                            size="large"
                            sx={{
                                ml: "1rem",
                                bgcolor: "success.main",
                                width: "50px",
                                height: "50px",
                                color: "white",
                                "&:hover": {
                                    bgcolor: "success.dark", // Change the background color on hover
                                },
                            }}
                        >
                            <PersonAddIcon fontSize="inherit" />
                        </IconButton>
                        <FormDialog
                            open={open}
                            handleClose={handleClose}
                            onSuccess={handleFormSuccess}
                            contactType={"vendor"}
                        />
                    </Grid>
                </Grid>
                <Divider sx={{ my: "1rem" }} />
                <Box
                    elevation={0}
                    sx={{
                        p: "2px 2px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: "55px",
                        backgroundColor: "white",
                        borderRadius: "5px",
                    }}
                >
                    <Select2
                        className="w-full"
                        placeholder="Select a product..."
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                height: "50px",
                            }),
                        }}
                        options={productOptions} // Options to display in the dropdown
                        value={selectedProductOption} // The currently selected option
                        onChange={handleChange} // Triggered when an option is selected
                        onInputChange={handleInputChange} // Triggered when the user types in the input field
                        inputValue={inputValue} // Current value of the input field
                        isClearable // Allow the user to clear the selected option
                        noOptionsMessage={() => "No products found"}
                        getOptionLabel={(option) =>
                            option.name + " | " + option.batch_number
                        }
                    ></Select2>

                    <IconButton color="white" sx={{ p: "10px" }}>
                        <Checkbox
                            icon={<QrCodeScannerOutlinedIcon />}
                            checkedIcon={<QrCodeScannerIcon />}
                            checked={barcodeChecked}
                            onChange={handleBarcodeChange}
                            sx={{
                                color: "default", // Unchecked color
                                "&.Mui-checked": {
                                    color: "white", // Checked icon color
                                    backgroundColor: blue[900], // Background color when checked
                                    "&:hover": {
                                        backgroundColor: blue[800], // Background on hover while checked
                                    },
                                },
                                "& .MuiSvgIcon-root": {
                                    fontSize: 25, // Customize icon size
                                },
                            }}
                        />
                    </IconButton>
                        <Link href="/products/create"><Button variant="contained" size="large" sx={{minWidth:'200px'}} startIcon={<AddBoxIcon />}> Add Product</Button></Link>
                </Box>

                <AppBar
                    position="fixed"
                    variant="contained"
                    sx={{ top: "auto", bottom: 0 }}
                >
                    <Toolbar>
                        <Box sx={{ flexGrow: 1 }} />
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/purchases"
                        >
                            <Button
                                variant="contained"
                                color="warning"
                                size="large"
                                startIcon={<ArrowBackIosNewIcon />}
                                sx={{ mr: "1rem" }}
                            >
                                BACK
                            </Button>
                        </Link>

                        <Button
                            variant="contained"
                            type="submit"
                            color="success"
                            size="large"
                            endIcon={<SaveIcon />}
                        >
                            SAVE
                        </Button>
                    </Toolbar>
                </AppBar>
            </form>
        </AuthenticatedLayout>
    );
}
