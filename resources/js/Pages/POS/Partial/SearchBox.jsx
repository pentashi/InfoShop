import React, { useState, useContext } from "react";
import {
    Box,
    Divider,
    IconButton,
    TextField,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import _ from "lodash";

import { useSales as useCart } from "@/Context/SalesContext";
import { SharedContext } from "@/Context/SharedContext";

export default function SearchBox() {
    const { setCartItemModalOpen, setSelectedCartItem } = useContext(SharedContext);

    const { addToCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [search_query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleSearchQuery = (search_query) => {
        setQuery(search_query);
        if (search_query.length > 2) {
            setLoading(true);
            axios
                .get(`/products/search`, {
                    params: { search_query },
                }) // Send both parameters
                .then((response) => {
                    setOptions(response.data.products); // Set options with response products
                    setLoading(false);
                    if (response.data.products.length === 1) {
                        addToCart(response.data.products[0]);
                        setSelectedCartItem(response.data.products[0])
                        setCartItemModalOpen(true)
                    }
                })
                .catch((error) => {
                    console.error(error); // Log any errors
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <Box
                elevation={0}
                sx={{
                    p: "2px 2px",
                    ml: "2rem",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "55px",
                    backgroundColor: "white",
                    borderRadius: "5px",
                }}
            >
                <Autocomplete
                    fullWidth
                    freeSolo
                    options={options}
                    inputValue={inputValue}
                    onInputChange={(event, value) => {
                        setInputValue(value);
                    }}
                    // getOptionLabel={(option) => option.name || ''}
                    getOptionLabel={(option) =>
                        typeof option === "string"
                            ? option
                            : option.name +
                              " | " +
                            option.barcode +
                              " | " +
                            option.sku +
                              " | " +
                              option.batch_number +
                              " | Rs." +
                              option.price
                    }
                    getOptionKey={(option) => option.id+option.batch_id}
                    onChange={(event, product) => {
                        if (
                            product &&
                            typeof product === "object" &&
                            product.id
                        ) {
                            addToCart(product); // Add product to cart
                            product.quantity = 1
                            setSelectedCartItem(product)
                            setCartItemModalOpen(true)
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            placeholder="Search product..."
                            onChange={(event) =>
                                handleSearchQuery(event.target.value)
                            }
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        border: "none", // Remove the border
                                    },
                                    "&:hover fieldset": {
                                        border: "none", // Remove border on hover
                                    },
                                    "&.Mui-focused fieldset": {
                                        border: "none", // Remove border when focused
                                    },
                                },
                            }}
                        />
                    )}
                />
                
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                >
                    <SearchIcon />
                </IconButton>
                
            </Box>
        </>
    );
}
