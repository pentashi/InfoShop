import React, { useState, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Button from "@mui/material/Button"
import { useSales as useCart } from "@/Context/SalesContext";

import {
    IconButton,
    Grid2 as Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function HeldItemsModal({
    modalOpen,
    setModalOpen,
}) {
    const { setHeldCartToCart, removeHeldItem } = useCart();
    const [heldCartKeys, setHeldCartKeys] = useState([]);

    const retrieveHeldCartKeys = () => {
        const heldCarts = JSON.parse(localStorage.getItem('heldCarts')) || {};
        setHeldCartKeys(Object.keys(heldCarts)); // Update state with keys
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    const handleLoadHeldCart = (key) => {
        setHeldCartToCart(key)       // Remove it from localStorage
        retrieveHeldCartKeys();     // Refresh the held cart keys
    };

    useEffect(() => {
        retrieveHeldCartKeys(); // Load held cart keys into state on component mount
    }, []);

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"xs"}
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    {"HELD ITEMS CART"}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <Grid container spacing={2} display={'flex'} flexDirection={'column'}>
                    <Button 
                        variant="contained"
                        color="primary"
                        display="block"
                        onClick={()=>retrieveHeldCartKeys()}
                    >
                        REFRESH
                    </Button>
                    {heldCartKeys.map((key) => (
                        <ListItemButton
                        key={key}
                        onClick={() => handleLoadHeldCart(key)} // Set the cart when clicked
                        >
                        <ListItemText primary={key} /> {/* Display the cart key */}
                        </ListItemButton>
                    ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
