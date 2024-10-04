import * as React from "react";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import BackHandIcon from "@mui/icons-material/BackHand";
import AddCardIcon from "@mui/icons-material/AddCard";

import CashCheckoutDialog from "./CashCheckoutDialog";
import { useCart } from '../CartContext';

export default function CartFooter() {
    const { cartState } = useCart();
    return (
        <>
            <Button
                variant="contained"
                color="warning"
                sx={{ mr: "0.5rem", paddingY: "15px" }}
                size="large"
                endIcon={<BackHandIcon />}
                disabled={cartState.length === 0}
            >
                HOLD
            </Button>

            <Button
                variant="contained"
                sx={{ mr: "0.5rem", paddingY: "15px" }}
                size="large"
                endIcon={<AddCardIcon />}
                disabled={cartState.length === 0}
            >
                PAYMENTS
            </Button>

            <CashCheckoutDialog
                disabled={cartState.length === 0}
            />
        </>
    );
}
