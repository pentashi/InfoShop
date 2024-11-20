import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import BackHandIcon from "@mui/icons-material/BackHand";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCardIcon from "@mui/icons-material/AddCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Grid from "@mui/material/Grid2";
import CashCheckoutDialog from "./CashCheckoutDialog";
import { useSales as useCart } from "@/Context/SalesContext";
import { SharedContext } from "@/Context/SharedContext";

import HeldItemsModal from "./HeldItemsModal";
import PaymentsCheckoutDialog from "@/Components/PaymentsCheckoutDialog";

import Swal from "sweetalert2";

export default function CartFooter() {
    const { cartState, holdCart, emptyCart } = useCart();
    const { selectedCustomer, saleDate } = useContext(SharedContext);
    const [heldModalOpen, setHeldModalOpen] = useState(false);
    const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);

    const onCartHold = () => {
        Swal.fire({
            title: "Do you want to hold this cart?",
            showDenyButton: true,
            confirmButtonText: "YES",
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                holdCart();
            }
        });
    };

    const onCartEmpty = () => {
        Swal.fire({
            title: "Do you want to clear this cart?",
            showDenyButton: true,
            confirmButtonText: "YES",
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                emptyCart();
            }
        });
    };

    return (
        <Grid container sx={{ pt: "0.8rem" }} spacing={1}>
            <Grid
                container
                spacing={1}
                flexDirection={'row'}
            >
                <Grid size={6}>
                <Button
                    variant="contained"
                    color="warning"
                    endIcon={<BackHandIcon />}
                    disabled={
                        cartState.length === 0 || selectedCustomer === null
                    }
                    onClick={onCartHold}
                    size="large"
                    fullWidth
                >
                    HOLD
                </Button>
                </Grid>
                
                <Grid size={6}>
                <Button
                    sx={{
                        bgcolor: "text.primary",
                        color: "white",
                    }}
                    endIcon={<ShoppingCartIcon />}
                    onClick={() => setHeldModalOpen(true)}
                    size="large"
                    fullWidth
                >
                    HELD ITEMS
                </Button>
                </Grid>
                <Grid size={6}>
                <Button
                    variant="contained"
                    color="error"
                    endIcon={<DeleteForeverIcon />}
                    disabled={
                        cartState.length === 0 || selectedCustomer === null
                    }
                    onClick={onCartEmpty}
                    size="large"
                    fullWidth
                >
                    EMPTY
                </Button>
                </Grid>

                <Grid size={6}>
                <Button
                    variant="contained"
                    endIcon={<AddCardIcon />}
                    disabled={
                        selectedCustomer?.id === 1 || cartState.length === 0 || selectedCustomer === null
                    }
                    onClick={() => setPaymentsModalOpen(true)}
                    size="large"
                    fullWidth
                >
                    PAYMENTS
                </Button>
                </Grid>
            </Grid>

            <Grid container sx={{ width: "100%" }}>
                <CashCheckoutDialog
                    disabled={
                        cartState.length === 0 || selectedCustomer === null
                    }
                />
            </Grid>

            <HeldItemsModal
                modalOpen={heldModalOpen}
                setModalOpen={setHeldModalOpen}
            />
            <PaymentsCheckoutDialog
                useCart={useCart}
                open={paymentsModalOpen}
                setOpen={setPaymentsModalOpen}
                selectedContact={selectedCustomer}
                is_sale={true}
                formData={{sale_date:saleDate}}
            />
        </Grid>
    );
}
