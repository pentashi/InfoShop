import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    Toolbar,
    Typography,
    ListItemText,
    TextField,
    Grid2 as Grid,
    InputBase,
    Checkbox,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import { blue } from "@mui/material/colors";

import ProductItem from "./Partial/ProductItem";
import CartItems from "./Partial/CartItem";
import CustomerSelect from "./Partial/CustomerSelect";
import CartSummary from "./Partial/CartSummary";
import CartFooter from "./Partial/CartFooter";
import { CartProvider } from './CartContext';

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
                    <CartItems></CartItems>
                    <CartSummary></CartSummary>
                </Box>
                <DrawerFooter>
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

                        <Box
                            elevation={0}
                            component="form"
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
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search Product"
                                inputProps={{ "aria-label": "search product" }}
                                fullWidth
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
