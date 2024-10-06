import * as React from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Button, Box, Divider, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Autocomplete from "@mui/material/Autocomplete";
import { Link } from "@inertiajs/react";
import HomeIcon from "@mui/icons-material/Home";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid2";
import "dayjs/locale/en-gb";
import Swal from "sweetalert2";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SaveIcon from "@mui/icons-material/Save";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { styled } from "@mui/material/styles";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function Product({ purchase }) {
    return (
        <AuthenticatedLayout>
            <Head title="Add Purchase" />
            <form
                id="purchase-form"
                encType="multipart/form-data"
                // onSubmit={handleSubmit}
            >
                <Box className="mb-10">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            sx={{ display: "flex", alignItems: "center" }}
                            color="inherit"
                            href="/"
                        >
                            <HomeIcon sx={{ mr: 0.5, mb:'3px' }} fontSize="inherit" />
                            Home
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/purchases"
                        >
                            Purchases
                        </Link>
                        <Typography sx={{ color: "text.primary" }}>
                            {purchase ? "Edit Product" : "Add Purchase"}
                        </Typography>
                    </Breadcrumbs>
                </Box>
                <AppBar
                    position="fixed"
                    variant="contained"
                    sx={{ top: "auto", bottom: 0 }}
                >
                    <Toolbar>
                        
                        <Box sx={{ flexGrow: 1 }} />
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/purchases"
                        >
                            <Button
                            variant="contained"
                            color="warning"
                            size="large"
                            startIcon={<ArrowBackIosNewIcon />}
                            sx={{mr:'1rem'}}
                        >
                            BACK
                        </Button>
                        </Link>
                        
                        <Button
                            variant="contained"
                            type="submit"
                            color="success"
                            size="large"
                            endIcon={<SaveIcon />}
                        >
                            SAVE
                        </Button>
                    </Toolbar>
                </AppBar>
            </form>
        </AuthenticatedLayout>
    );
}
