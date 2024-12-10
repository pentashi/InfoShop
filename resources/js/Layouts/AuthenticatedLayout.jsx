import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import React, { useState, useContext } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import InventoryIcon from "@mui/icons-material/Inventory";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaidIcon from "@mui/icons-material/Paid";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CustomerIcon from "@mui/icons-material/PeopleAlt";
import VendorIcon from "@mui/icons-material/ContactEmergency";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import PeopleIcon from "@mui/icons-material/People";
import Tooltip from "@mui/material/Tooltip";
import Collapse from '@mui/material/Collapse';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import WorkIcon from '@mui/icons-material/Work';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import infoshopLogo from '@/infoshop.png';
const drawerWidth = 240;

function AuthenticatedLayout({ header, children, ...props }) {
    const user = usePage().props.auth.user;
    const shop_name = usePage().props.settings.shop_name;
    const pageLabel = usePage().props.pageLabel;
    const pathname = usePage().url;

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

    const [collapse, setCollapse] = useState(false);

    const handleCollapse = () => {
        setCollapse(!collapse);
    };

    //Logic to selected menu item
    // const isSelected = (href) => pathname === href || pathname.startsWith(href + '/');
    const isSelected = (href) => {
        const baseHref = href.split("?")[0]; // Extract the base path by removing query parameters
        return pathname === baseHref || pathname.startsWith(baseHref);
    };

    const NavItem = ({ href, icon: Icon, label, open, selected, onClick }) => (
        <Link preserveScroll href={href}>
            <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                    selected={selected}
                    sx={[
                        {
                            minHeight: 48,
                            px: 2.5,
                            "&.Mui-selected": {
                                color: "white",
                                backgroundColor: "#1976d2", // Background color when selected
                                "& .MuiListItemIcon-root": {
                                    // Target the icon within the selected state
                                    color: "white", // Icon color when selected
                                },
                            },
                            "&:hover": {
                                color: "white",
                                backgroundColor: "#5f72f5", // Background color on hover
                                "& .MuiListItemIcon-root": {
                                    color: "white", // Icon color on hover
                                },
                            },
                        },
                        open
                            ? { justifyContent: "initial" }
                            : { justifyContent: "center" },
                    ]}
                    onClick={onClick}
                >
                    <ListItemIcon
                        sx={[
                            {
                                minWidth: 0,
                                justifyContent: "center",
                            },
                            open ? { mr: 3 } : { mr: "auto" },
                        ]}
                    >
                        {Icon && <Icon />}
                    </ListItemIcon>
                    <ListItemText
                        primary={label}
                        sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                    />
                </ListItemButton>
            </ListItem>
        </Link>
    );

    const drawer = (
        <div>
            <Toolbar>
                <Grid
                    container
                    width={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    paddingLeft={"0.5rem"}
                >
                    <img src={infoshopLogo} style={{ height: '80px', objectFit: 'contain' }}></img>
                </Grid>
            </Toolbar>
            <Divider />
            <List>
                <NavItem
                    href="/dashboard"
                    icon={DashboardIcon}
                    label="Dashboard"
                    open={open}
                    selected={isSelected("/dashboard")}
                />
                <NavItem
                    href="/pos"
                    icon={PointOfSaleIcon}
                    label="POS"
                    open={open}
                    selected={isSelected("/pos")}
                />
                <NavItem
                    href="/products"
                    icon={InventoryIcon}
                    label="Products"
                    open={open}
                    selected={isSelected("/products")}
                />
                <NavItem
                    href="/sales"
                    icon={PaidIcon}
                    label="Sales"
                    open={open}
                    selected={isSelected("/sales")}
                />
                <NavItem
                    href="/sold-items"
                    icon={ShoppingCartCheckoutIcon}
                    label="Sold Items"
                    open={open}
                    selected={isSelected("/sold-items")}
                />
                <NavItem
                    href="/purchases"
                    icon={AddShoppingCartIcon}
                    label="Purchases"
                    open={open}
                    selected={isSelected("/purchases")}
                />
                <NavItem
                    href="/reports/dailycash"
                    icon={WorkIcon}
                    label="Cash Drawer"
                    open={open}
                    selected={isSelected("/reports/dailycash")}
                />
                <NavItem
                    href="/payments/sales"
                    icon={PaymentsIcon}
                    label="Payments"
                    open={open}
                    selected={isSelected("/payments")}
                />
                <NavItem
                    href="/reloads"
                    icon={PhoneForwardedIcon}
                    label="Reloads"
                    open={open}
                    selected={isSelected("/reloads")}
                />
                <NavItem
                    href="/expenses"
                    icon={AccountBalanceWalletIcon}
                    label="Expenses"
                    open={open}
                    selected={isSelected("/expenses")}
                />

                <NavItem
                    href="/customers"
                    icon={CustomerIcon}
                    label="Customers"
                    open={open}
                    selected={isSelected("/customers")}
                />
                <NavItem
                    href="/vendors"
                    icon={VendorIcon}
                    label="Suppliers"
                    open={open}
                    selected={isSelected("/vendors")}
                />
                <NavItem
                    href="/stores"
                    icon={StoreIcon}
                    label="Stores"
                    open={open}
                    selected={isSelected("/stores")}
                />
                <NavItem
                    href="/collections"
                    icon={AccountTreeIcon}
                    label="Collections"
                    open={open}
                    selected={isSelected("/collections")}
                />
                <NavItem
                    href="/settings"
                    icon={SettingsIcon}
                    label="Settings"
                    open={open}
                    selected={isSelected("/settings")}
                />
                <NavItem
                    href="/profile"
                    icon={ManageAccountsIcon}
                    label="Profile"
                    open={open}
                    selected={isSelected("/profile")}
                />
                {user.user_role == 'admin' && (
                    <>
                        <ListItemButton onClick={handleCollapse}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="User" />
                            {collapse ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={collapse} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <NavItem
                                    href="/users"
                                    icon={null}
                                    label="All"
                                    open={open}
                                    // sx={{ pl: 5 }}
                                    selected={isSelected("/users")}
                                />
                                <NavItem
                                    href="/user/role"
                                    icon={null}
                                    label="User Role"
                                    open={open}
                                    // sx={{ pl: 5 }}
                                    selected={isSelected("/user/role")}
                                />
                            </List>
                        </Collapse>
                    </>
                )}

                <NavItem
                    href={'#'}
                    icon={LogoutIcon}
                    label="Logout"
                    open={open}
                    onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        router.post(document.location.origin + "/logout"); // Call your logout function here
                    }}
                />
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon fontSize="large" />
                    </IconButton>
                    <Grid
                        container
                        spacing={2}
                        alignItems={{ sm: "center", xs: 'start' }}
                        justifyContent={"space-between"}
                        width={"100%"}
                        display={'flex'}
                        flexDirection={{ xs: 'column', sm: 'row' }}
                    >
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{ textTransform: "capitalize", fontSize: { xs: '1rem', sm: '1.5rem' } }}
                        >
                            {shop_name} | {pageLabel}
                        </Typography>
                        <Tooltip title="Logout" arrow>
                            <IconButton
                                color="white"
                                size="large"
                                onClick={(e) => router.post(document.location.origin + "/logout")}
                                sx={{ display: { xs: "none", sm: 'block' } }}
                            >
                                <LogoutIcon
                                    fontSize="large"
                                    sx={{ color: "white" }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
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
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
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
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

export default AuthenticatedLayout;
