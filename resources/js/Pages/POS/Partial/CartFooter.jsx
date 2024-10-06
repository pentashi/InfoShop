import React, {useContext} from "react";
import { Button } from "@mui/material";
import BackHandIcon from "@mui/icons-material/BackHand";
import AddCardIcon from "@mui/icons-material/AddCard";

import CashCheckoutDialog from "./CashCheckoutDialog";
import { useSales as useCart } from '@/Context/SalesContext';
import { SharedContext } from "@/Context/SharedContext";

export default function CartFooter() {
    const { cartState } = useCart();
    const {selectedCustomer} = useContext(SharedContext); 
    return (
        <>
            <Button
                variant="contained"
                color="warning"
                sx={{ mr: "0.5rem", paddingY: "15px" }}
                size="large"
                endIcon={<BackHandIcon />}
                disabled={cartState.length === 0 || selectedCustomer === null}
            >
                HOLD
            </Button>

            <Button
                variant="contained"
                sx={{ mr: "0.5rem", paddingY: "15px" }}
                size="large"
                endIcon={<AddCardIcon />}
                disabled={cartState.length === 0 || selectedCustomer === null}
            >
                PAYMENTS
            </Button>

            <CashCheckoutDialog
                disabled={cartState.length === 0 || selectedCustomer === null}
            />
        </>
    );
}
