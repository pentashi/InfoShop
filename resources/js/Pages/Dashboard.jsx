import * as React from "react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    Typography,
    Grid2 as Grid,
    TextField,
    FormControl,
    ListItem,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from "@mui/material";
import dayjs from "dayjs";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaidIcon from "@mui/icons-material/Paid";
import PaymentsIcon from "@mui/icons-material/Payments";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import axios from "axios";
import numeral from "numeral";

export default function Dashboard({ data }) {
    const auth = usePage().props.auth.user;
    const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

    const [cash_in, setCashIn] = useState(0)
    const [total_sales, setTotalSales] = useState(0)
    const [expenses, setExpenses] = useState(0)

    const refreshSummary = async () => {
        try {
            const response = await axios.post('/dashboard/summary', {
                start_date:startDate,
                end_date:endDate
            });
            const { cash_in, total_sales, expenses } = response.data.summary;
            setCashIn(cash_in);
            setTotalSales(total_sales);
            setExpenses(expenses);
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    };

    useEffect(() => {
        refreshSummary(); // Call on component mount
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        refreshSummary(); // Call whenever startDate or endDate changes
    }, [startDate, endDate]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <Grid container spacing={2} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }} width={"100%"}>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <Card sx={{ height: "100%", backgroundColor:'#77E4C8' }}>
                        <CardContent>
                            <Typography
                                gutterBottom
                                sx={{
                                    color: "text.secondary",
                                    fontSize: 14,
                                    textTransform: "uppercase",
                                }}
                            >
                                Total items
                            </Typography>
                            <Typography variant="h5" component="div">
                                {data.totalItems}
                            </Typography>
                            <span>{data.totalQuantities} QTY</span>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <Card item sx={{ height: "100%", backgroundColor:'#FDFFE2' }}>
                        <CardContent>
                            <Typography
                                gutterBottom
                                sx={{
                                    color: "text.secondary",
                                    fontSize: 14,
                                    textTransform: "uppercase",
                                }}
                            >
                                Total valuation
                            </Typography>
                            <Typography variant="h5" component="div">
                                Rs. {data.totalValuation}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <Card sx={{ height: "100%", backgroundColor:'#FAE7F3' }}>
                        <CardContent>
                            <Typography
                                gutterBottom
                                sx={{
                                    color: "text.secondary",
                                    fontSize: 14,
                                    textTransform: "uppercase",
                                }}
                            >
                                Sold Items
                            </Typography>
                            <Typography variant="h5" component="div">
                                {data.soldItems}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <Card sx={{ height: "100%", backgroundColor:'#D1E9F6' }}>
                        <CardContent>
                            <Typography
                                gutterBottom
                                sx={{
                                    color: "text.secondary",
                                    fontSize: 14,
                                    textTransform: "uppercase",
                                }}
                            >
                                Customer balance
                            </Typography>
                            <Typography variant="h5" component="div">
                                Rs. {data.customerBalance}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container size={{xs:12, sm:12, md:4}} sx={{ mt: "3rem", width:'100%' }}>
                <Card sx={{width:'100%' }} >
                    <CardContent>
                        <Grid container display="flex" spacing={2} width={'100%'}>
                            <Grid item size={6}>
                                <FormControl sx={{width:'100%'}}>
                                    <TextField
                                        label="Start Date"
                                        name="start_date"
                                        placeholder="Start Date"
                                        type="date"
                                        fullWidth
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        required
                                        
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item size={6}>
                                <FormControl sx={{width:'100%'}}>
                                    <TextField
                                        label="End Date"
                                        name="end_date"
                                        placeholder="End Date"
                                        type="date"
                                        fullWidth
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        required
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <List>
                            <ListItem secondaryAction={numeral(total_sales).format('0,0.00')}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PaidIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Sales" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />

                            <ListItem secondaryAction={numeral(cash_in).format('0,0.00')}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PaymentsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Cash in" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />

                            <ListItem secondaryAction={numeral(expenses).format('0,0.00')}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AccountBalanceWalletIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Expenses" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </AuthenticatedLayout>
    );
}
