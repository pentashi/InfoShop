import React, { useContext, useState } from "react";
import { Typography, Toolbar, Box, AppBar, Tab, Tabs } from "@mui/material";

export default function POSBottomBar({ product, drawerWidth }) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, left:0, width: { sm: `calc(100% - ${drawerWidth}px)` }, padding:1 }}>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons
                textColor="inherit"
                TabIndicatorProps={{style: {background:'#fff'}}}
            >
                <Tab label="Featured" />
                <Tab label="Item Two" />
                <Tab label="Item Three" />
                <Tab label="Item Four" />
                <Tab label="Item Five" />
                <Tab label="Item Six" />
                <Tab label="Item Seven" />
            </Tabs>
        </AppBar>
    );
}
