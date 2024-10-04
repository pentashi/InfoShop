import React, { useState,useEffect } from "react";
import {
    Box,
    Divider,
    IconButton,
    TextField,
    Checkbox,
    Autocomplete
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import { blue } from "@mui/material/colors";
import axios from "axios";

import { useCart } from '../CartContext';

export default function SearchBox() {
    const { cartState, addToCart } = useCart();

    const [search_query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [barcodeChecked, setBarcodeChecked] = useState(true);

    const handleSearchQuery=(search_query)=>{
        setQuery(search_query)
        if (search_query.length > 2) {
            axios
              .get(`/pos/searchproduct`, { params: { search_query, barcodeChecked } }) // Send both parameters
              .then((response) => {
                setOptions(response.data.products); // Set options with response products

                if(barcodeChecked && response.data.products.length===1){
                    addToCart(response.data.products[0])
                }
              })
              .catch((error) => {
                console.error(error); // Log any errors
              });
          }
      };

      const handleBarcodeChange = (event) => {
        setBarcodeChecked(event.target.checked); // Update the checked state
      };

      const handleKeyDown = (event) => {
        // Check if the Enter key is pressed
        if (event.key === "Enter") {
            
          // Prevent adding 'Unknown Product' if no valid option is selected
          if (!options.find((option) => option.name === search_query)) {
            handleSearchQuery(search_query)
            setInputValue("");
            setQuery(""); // Optionally clear the input field
          }
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
            options={barcodeChecked ? [] : options}
            inputValue={inputValue}
            onInputChange={(event, value) => {
                setInputValue(value);
            }}
            getOptionLabel={(option) => option.name || ''}
            getOptionKey={(option) => option.id}
            onChange={(event, newValue) => {
                // newValue && typeof newValue === "object" && newValue.id ? addToCart(newValue):console.warn("Selected value is invalid:", newValue)
                if (newValue && typeof newValue === "object" && newValue.id) {
                    addToCart(newValue); // Add product to cart
                    //setInputValue(newValue.name); // Set input value to selected option name
                  }
            }}         
            renderInput={(params) => (
                <TextField
                {...params}
                fullWidth
                placeholder="Search product..."
                onKeyDown={handleKeyDown}
                onChange={(event) => handleSearchQuery(event.target.value)}
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
            <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
            >
                <SearchIcon />
            </IconButton>
            <Divider
                sx={{ height: 28, m: 0.5 }}
                orientation="vertical"
            />
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
                            fontSize: 28, // Customize icon size
                        },
                    }}
                />
            </IconButton>
        </Box>
        </>
    );
  }