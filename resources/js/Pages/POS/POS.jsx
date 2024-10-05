import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
    Grid2 as Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";

import ProductItem from "./Partial/ProductItem";
import CartItems from "./Partial/CartItem";
import CustomerSelect from "./Partial/CustomerSelect";
import CartSummary from "./Partial/CartSummary";
import CartFooter from "./Partial/CartFooter";
import SearchBox from "./Partial/SearchBox";
import { CartProvider } from "./CartContext";

const drawerWidth = 500;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const DrawerFooter = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    zIndex: "999",
}));

function POS({ products }) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <>
            <form action="/pos" id="posForm" method="post">
                <Toolbar sx={{ display: { xs: "none", sm: "flex" } }}>
                    <CustomerSelect />
                </Toolbar>
                <Divider />
                <Box
                    className="flex flex-col overflow-auto"
                    sx={{ height: "calc(100vh - 150px);" }}
                >
                    {/* Cart Items - List of all items */}
                    <CartItems></CartItems>
                    {/* Cart Summary - Total and discount area */}
                    <CartSummary></CartSummary>
                </Box>
                <DrawerFooter>
                    {/* Cart footer - Buttons */}
                    <CartFooter></CartFooter>
                </DrawerFooter>
            </form>
        </>
    );

    return (
        <CartProvider>
            <Head title="Point of Sale" />
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        mr: { sm: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar sx={{ paddingY: "10px" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" noWrap component="div">
                                POS
                            </Typography>
                        </Box>
                        {/* Product Search Box  */}
                        <SearchBox></SearchBox>
                        <Link href="/dashboard">
                        <IconButton
                            color="inherit"
                            sx={{ ml: 2, p: "10px",color: "default", // Unchecked color
                                "& .MuiSvgIcon-root": {
                                    fontSize: 30, // Customize icon size
                                }, }}
                            type="button"
                        >
                            <HomeIcon />
                        </IconButton>
                        </Link>
                    </Toolbar>
                </AppBar>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                    }}
                >
                    <Toolbar />

                    <Grid container spacing={2}>
                        {products.map((product) => (
                            <Grid
                                item="true"
                                key={product.id}
                                size={{ xs: 6, sm: 6, md: 2 }}
                                sx={{ cursor: "pointer" }}
                                // onClick={() => handleAddToCart(product)}
                            >
                                <ProductItem product={product}></ProductItem>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* Mobile Drawer */}
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: "block", sm: "none" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: "100%",
                            },
                        }}
                        anchor="right"
                    >
                        <DrawerHeader>
                            <CustomerSelect />
                            <IconButton onClick={handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </DrawerHeader>
                        {drawer}
                    </Drawer>

                    {/* Desktop drawer */}
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: "none", sm: "block" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                        open
                        anchor="right"
                    >
                        {drawer}
                    </Drawer>
                </Box>
            </Box>
        </CartProvider>
    );
}

export default POS;
