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
    const { selectedCustomer } = useContext(SharedContext);
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
        <Grid container sx={{ width: "100%", pt: "0.8rem" }} spacing={1}>
            <Grid
                container
                size="auto"
                sx={{ width: "100%" }}
                display="flex"
                justifyContent="center"
            >
                <Button
                    variant="contained"
                    color="warning"
                    sx={{ paddingY: "12px" }}
                    endIcon={<BackHandIcon />}
                    disabled={
                        cartState.length === 0 || selectedCustomer === null
                    }
                    onClick={onCartHold}
                >
                    HOLD
                </Button>
                <Button
                    sx={{
                        paddingY: "12px",
                        bgcolor: "text.primary",
                        color: "white",
                    }}
                    endIcon={<ShoppingCartIcon />}
                    onClick={() => setHeldModalOpen(true)}
                >
                    HELD ITEMS
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    sx={{ paddingY: "12px" }}
                    endIcon={<DeleteForeverIcon />}
                    disabled={
                        cartState.length === 0 || selectedCustomer === null
                    }
                    onClick={onCartEmpty}
                >
                    EMPTY
                </Button>

                <Button
                    variant="contained"
                    sx={{ paddingY: "12px" }}
                    endIcon={<AddCardIcon />}
                    disabled={
                        cartState.length === 0 || selectedCustomer === null
                    }
                    onClick={() => setPaymentsModalOpen(true)}
                >
                    PAYMENTS
                </Button>
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
            />
        </Grid>
    );
}
