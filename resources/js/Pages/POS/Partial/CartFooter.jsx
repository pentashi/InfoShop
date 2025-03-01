import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import BackHandIcon from "@mui/icons-material/BackHand";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCardIcon from "@mui/icons-material/AddCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from '@mui/icons-material/Receipt';
import Grid from "@mui/material/Grid2";
import CashCheckoutDialog from "./CashCheckoutDialog";
import { useSales as useCart } from "@/Context/SalesContext";
import { SharedContext } from "@/Context/SharedContext";
import { usePage } from "@inertiajs/react";

import HeldItemsModal from "./HeldItemsModal";
import PaymentsCheckoutDialog from "@/Components/PaymentsCheckoutDialog";
import QuotationDialog from "./QuotationDialog";

import Swal from "sweetalert2";

export default function CartFooter() {
    const return_sale = usePage().props.return_sale;
    const { cartState, holdCart, emptyCart } = useCart();
    const { selectedCustomer, saleDate } = useContext(SharedContext);
    const [heldModalOpen, setHeldModalOpen] = useState(false);
    const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
    const [quotationModalOpen, setQuotationModalOpen] = useState(false);

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
                
                <Grid size={{xs:3, sm:4}}>
                <Button
                    variant="contained"
                    color="warning"
                    endIcon={<BackHandIcon />}
                    disabled={
                        cartState.length === 0 || selectedCustomer === null || return_sale
                    }
                    onClick={onCartHold}
                    size="large"
                    fullWidth
                >
                    HOLD
                </Button>
                </Grid>
                
                <Grid size={{xs:6, sm:5}}>
                <Button
                    endIcon={<ShoppingCartIcon />}
                    color="primary"
                    variant="contained"
                    onClick={() => setHeldModalOpen(true)}
                    size="large"
                    fullWidth
                    disabled={return_sale}
                >
                    HOLD ITEMS
                </Button>
                </Grid>
                <Grid size={{xs:3, sm:3}}>
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

                <Grid size={{xs:6, sm:6}}>
                <Button
                    variant="contained"
                    endIcon={<ReceiptIcon />}
                    disabled={
                        selectedCustomer?.id === 1 || cartState.length === 0 || selectedCustomer === null
                    }
                    onClick={() => setQuotationModalOpen(true)}
                    size="large"
                    fullWidth
                    sx={{
                        bgcolor: "#1A2027",
                        '&:hover': {
                            bgcolor: "#2A3346",
                        },
                    }}
                >
                    QUOTATION
                </Button>
                </Grid>
                <Grid size={6}>
                <Button
                    variant="contained"
                    endIcon={<AddCardIcon />}
                    disabled={
                        cartState.length === 0 || selectedCustomer === null || !saleDate
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
                        cartState.length === 0 || selectedCustomer === null || !saleDate
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
            <QuotationDialog
                useCart={useCart}
                open={quotationModalOpen}
                setOpen={setQuotationModalOpen}
                selectedContact={selectedCustomer}
            />
        </Grid>
    );
}
