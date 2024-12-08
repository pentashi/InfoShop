import React, { useState, useContext, useRef, useEffect } from "react";
import {
    Box,
    Divider,
    IconButton,
    TextField,
    Autocomplete,
} from "@mui/material";
import { usePage } from "@inertiajs/react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import _ from "lodash";

import { useSales as useCart } from "@/Context/SalesContext";
import { SharedContext } from "@/Context/SharedContext";

export default function SearchBox() {
    const return_sale = usePage().props.return_sale;
    const { setCartItemModalOpen, setSelectedCartItem } = useContext(SharedContext);

    const { addToCart, cartState } = useCart();
    const [loading, setLoading] = useState(false);
    const [search_query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const searchRef = useRef(null);

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
                        const product = response.data.products;
                        const existingProductIndex = cartState.findIndex(
                            (item) =>
                              item.id === product[0].id &&
                              item.batch_number === product[0].batch_number &&
                              (item.product_type !== 'custom' && item.product_type !== 'reload')
                        );

                        if (existingProductIndex !== -1) {
                            product[0].quantity = cartState[existingProductIndex].quantity
                        }
                        else{
                            product[0].quantity = 1;
                            addToCart(product[0]);
                        }

                        // This one enables the same item added multiple times and also ensure only the reload product is added, by this, we can get the last added item of reload product so we can modify the cart item. becuase we are using cartindex as an id to update cart item
                        if (product[0].product_type === "reload") {                           
                            const lastAddedIndex = cartState.length > 0 ? cartState.length : 0;
                            product[0].cart_index = lastAddedIndex;
                        }
                        setSelectedCartItem(product[0])
                        setCartItemModalOpen(true)
                    }
                })
                .catch((error) => {
                    console.error(error); // Log any errors
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    return (
        <>
            <Box
                elevation={0}
                sx={{
                    p: "2px 2px",
                    ml: {sm:"2rem", xs:'0.5rem'},
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "55px",
                    backgroundColor: "white",
                    borderRadius: "5px",
                }}
            >
                <Autocomplete
                disabled={return_sale}
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
                            : `${option.name} | ${option.barcode} ${option.sku ? `| ${option.sku}` : ""} | ${option.batch_number} | Rs.${option.price}`
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

                            // This one enables the same item added multiple times and also ensure only the reload product is added, by this, we can get the last added item of reload product so we can modify the cart item. becuase we are using cartindex as an id to update cart item
                        if (product.product_type === "reload") {
                            const lastAddedIndex = cartState.length > 0 ? cartState.length : 0;
                            product.cart_index = lastAddedIndex;
                        }

                            setSelectedCartItem(product)
                            setCartItemModalOpen(true)
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputRef={searchRef}
                            fullWidth
                            placeholder="Search product..."
                            onChange={(event) =>
                                handleSearchQuery(event.target.value)
                            }
                            onFocus={(event) => {
                                event.target.select();
                            }}
                            disableCloseOnSelect
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
