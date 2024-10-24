import * as React from "react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {
    Typography,
    Grid2 as Grid,
    TextField,
    FormControl,
    ListItem,
} from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaidIcon from "@mui/icons-material/Paid";
import PaymentsIcon from "@mui/icons-material/Payments";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export default function Dashboard({ data }) {
    const auth = usePage().props.auth.user;
    const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <Grid container spacing={2} sx={{ display: "flex" }} width={"100%"}>
                <Grid size={3}>
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
                            <Typography variant="h4" component="div">
                                {data.totalItems}
                            </Typography>
                            <span>{data.totalQuantities} QTY</span>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
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
                            <Typography variant="h4" component="div">
                                Rs. {data.totalValuation}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
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
                            <Typography variant="h4" component="div">
                                {data.soldItems}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={3}>
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
                            <Typography variant="h4" component="div">
                                {data.customerBalance}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container size={6} sx={{ mt: "3rem" }}>
                <Card sx={{ height: "100%" }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid>
                                <FormControl>
                                    <TextField
                                        label="Start Date"
                                        name="start_date"
                                        placeholder="Start Date"
                                        fullWidth
                                        type="date"
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
                            <Grid>
                                <FormControl>
                                    <TextField
                                        label="End Date"
                                        name="end_date"
                                        placeholder="End Date"
                                        fullWidth
                                        type="date"
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
                            <ListItem secondaryAction={"0.00"}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PaidIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Sales" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />

                            <ListItem secondaryAction={"0.00"}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PaymentsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Cash in" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />

                            <ListItem secondaryAction={"0.00"}>
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
