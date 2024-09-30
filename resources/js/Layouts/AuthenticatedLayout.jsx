import React, { useState } from 'react';
import { Link, usePage, router  } from '@inertiajs/react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const NavItem = ({href, icon:Icon, label, open, selected})=>(
  <Link href={href}>
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
      selected={selected}
        sx={[
          {
            minHeight: 48,
            px: 2.5,
          },
          open
            ? { justifyContent: 'initial' }
            : { justifyContent: 'center' },
        ]}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              justifyContent: 'center',
            },
            open
              ? { mr: 3 }
              : { mr: 'auto' },
          ]}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={[
            open
              ? { opacity: 1 }
              : { opacity: 0 },
          ]}
        />
      </ListItemButton>
    </ListItem>
  </Link>
);

export default function Authenticated({ header, children, ...props }) {
    const user = usePage().props.auth.user;
    const pathname = usePage().url

    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    // React.useEffect(() => {
    //   console.log(pathname)
    // }, []); 

    //Logic to selected menu item
    const isSelected = (href) => pathname === href || pathname.startsWith(href + '/');
  
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 5,
                },
                open && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              OneShop
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>

          <NavItem href="/dashboard" icon={DashboardIcon} label="Dashboard" open={open} selected={isSelected("/dashboard")}/>
          <NavItem href="/pos" icon={PointOfSaleIcon} label="POS" open={open} selected={isSelected("/pos")}/>
          <NavItem href="/products" icon={InventoryIcon} label="Products" open={open} selected={isSelected("/products")}/>
          <NavItem href="/collections" icon={AccountTreeIcon} label="Collections" open={open} selected={isSelected("/collections")} />
          <NavItem href="/sales" icon={PaidIcon} label="Sales" open={open} selected={isSelected("/sales")}/>
          <NavItem href="/purchases" icon={AddShoppingCartIcon} label="Purchases" open={open} selected={isSelected("/purchases")}/>
          <NavItem href="/stores" icon={StoreIcon} label="Stores" open={open} selected={isSelected("/stores")} />
          <NavItem href="/profile" icon={ManageAccountsIcon} label="Profile" open={open} selected={isSelected("/profile")} />

          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Box className="py-4 px-4">
          <main>{children}</main>
          </Box>
        </Box>
      </Box>
    );
}
