import * as React from "react";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import BackHandIcon from "@mui/icons-material/BackHand";
import AddCardIcon from "@mui/icons-material/AddCard";

import CashCheckoutDialog from "./CashCheckoutDialog";

export default function CartFooter({cartItems}) {
    return (
        <>
            <Button
                variant="contained"
                color="warning"
                sx={{ mr: "0.5rem", paddingY: "15px" }}
                size="large"
                endIcon={<BackHandIcon />}
            >
                HOLD
            </Button>

            <Button
                variant="contained"
                sx={{ mr: "0.5rem", paddingY: "15px" }}
                size="large"
                endIcon={<AddCardIcon />}
            >
                PAYMENTS
            </Button>

            <CashCheckoutDialog/>
        </>
    );
}
