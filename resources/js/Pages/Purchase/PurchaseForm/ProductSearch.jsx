import * as React from "react";
import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "@inertiajs/react";
import {
    Button,
    Box,
    Grid2 as Grid,
    IconButton,
    Checkbox,
} from "@mui/material";

import AddBoxIcon from "@mui/icons-material/AddBox";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import { blue } from "@mui/material/colors";

import Select2 from "react-select";
import axios from "axios";
import _ from "lodash";

import AddToPurchase from "./AddToPurchase";

import { SharedContext } from "@/Context/SharedContext";
import { usePurchase } from "@/Context/PurchaseContext";

export default function ProductSearch() {
    const { addToCart } = usePurchase();

    const [barcodeChecked, setBarcodeChecked] = useState(true);

    const [productOptions, setProductOptions] = useState([]); // Stores the options from the API
    const [selectedProductOption, setSelectedProductOption] = useState(null); // Stores the selected option
    const [inputValue, setInputValue] = useState("");
    const [addToPurchaseOpen, setAddToPurchaseOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Function to fetch product data based on the input value (user's search query)
    const fetchProducts = (search_query, barcodeChecked) => {
        const is_purchase = 1;
        if (!search_query) {
            setProductOptions([]); // Clear options if input is empty
            return;
        }

        axios
            .get(`/products/search`, {
                params: { search_query, barcodeChecked, is_purchase },
            }) // Send input as a query to your API
            .then((response) => {
                const products = response.data.products;
                setProductOptions(products);

                if (barcodeChecked) {
                    setSelectedProducts(response.data.products);
                    setAddToPurchaseOpen(true); //Open add purchase dialog
                }
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    };

    // Create the debounced function only once
    const debouncedFetchProducts = useCallback(
        _.debounce((search_query, currentBarcodeChecked) => {
            fetchProducts(search_query, currentBarcodeChecked);
        }, 500),
        []
    );

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            debouncedFetchProducts.cancel(); // Cancel any pending debounced calls
        };
    }, [debouncedFetchProducts]);

    // Handle input change (this is called when user types in the input field)
    const handleInputChange = (newValue) => {
        setInputValue(newValue); // Update the input value state
        // Trigger fetch only if barcode is not checked
        if (!barcodeChecked) {
            debouncedFetchProducts(newValue, barcodeChecked); // Fetch products based on the new input value
        }
    };

    // Handle selection change (when the user selects an option from the dropdown)
    const handleChange = (selectedOption) => {
        setSelectedProductOption(selectedOption);
        if (selectedOption) {
            setSelectedProducts(selectedOption);
            setAddToPurchaseOpen(true);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default form submission
            if (barcodeChecked) {
                // Trigger fetch only if barcode is not checked
                debouncedFetchProducts(event.target.value, barcodeChecked); // Manually trigger fetching products
            }
        }
    };

    const handleBarcodeChange = (event) => {
        setBarcodeChecked(event.target.checked); // Update the checked state
    };

    return (
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
                onKeyDown={handleKeyPress}
                inputValue={inputValue} // Current value of the input field
                isClearable // Allow the user to clear the selected option
                noOptionsMessage={() => "No products found"}
                getOptionLabel={(option) =>
                    option.name + " | " + option.batch_number
                }
                getOptionValue={(option) => option.batch_id}
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
            <Link href="/products/create">
                <Button
                    variant="contained"
                    size="large"
                    sx={{ minWidth: "200px" }}
                    startIcon={<AddBoxIcon />}
                >
                    Add Product
                </Button>
            </Link>
            <AddToPurchase
                addToPurchaseOpen={addToPurchaseOpen}
                setAddToPurchaseOpen={setAddToPurchaseOpen}
                products={selectedProducts}
            />
        </Box>
    );
}
