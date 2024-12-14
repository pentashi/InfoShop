import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import {
    Select,
    MenuItem,
    Typography,
    FormControl,
    InputLabel,
} from "@mui/material";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const fontOptions = [
    { label: "Arial", fontFamily: "Arial, sans-serif" },
    { label: "Helvetica", fontFamily: "Helvetica, sans-serif" },
    { label: "Times New Roman", fontFamily: "'Times New Roman', serif" },
    { label: "Georgia", fontFamily: "Georgia, serif" },
    { label: "Courier New", fontFamily: "'Courier New', monospace" },
    { label: "Verdana", fontFamily: "Verdana, sans-serif" },
    { label: "Tahoma", fontFamily: "Tahoma, sans-serif" },
    { label: "Trebuchet MS", fontFamily: "'Trebuchet MS', sans-serif" },
    { label: "Comic Sans MS", fontFamily: "'Comic Sans MS', cursive" },
    { label: "OCR A Extended", fontFamily: "'OCR A Extended', monospace" },
    { label: "Monaco", fontFamily: "Monaco, monospace" },
    { label: "Lucida Console", fontFamily: "'Lucida Console', monospace" },
    { label: "Consolas", fontFamily: "Consolas, monospace" },
    {
        label: "Bitstream Vera Sans Mono",
        fontFamily: "'Bitstream Vera Sans Mono', monospace",
    },
    { label: "DejaVu Sans Mono", fontFamily: "'DejaVu Sans Mono', monospace" },
    { label: "Inconsolata", fontFamily: "'Inconsolata', monospace" },
    { label: "Source Code Pro", fontFamily: "'Source Code Pro', monospace" },
    { label: "Fira Code", fontFamily: "'Fira Code', monospace" },
    { label: "Droid Sans Mono", fontFamily: "'Droid Sans Mono', monospace" },
    { label: "Ubuntu Mono", fontFamily: "'Ubuntu Mono', monospace" },
    { label: "PT Mono", fontFamily: "'PT Mono', monospace" },
    { label: "Noto Mono", fontFamily: "'Noto Mono', monospace" },
    { label: "Hack", fontFamily: "'Hack', monospace" },
    { label: "Tisa Mono", fontFamily: "'Tisa Mono', monospace" },
    { label: "Space Mono", fontFamily: "'Space Mono', monospace" },
];

export default function Setting({ settings }) {
    const [settingFormData, setSettingFormData] = useState({
        shop_logo: settings.shop_logo,
        sale_receipt_note: settings.sale_receipt_note,
        shop_name: settings.shop_name,
        sale_print_padding_right: settings.sale_print_padding_right,
        sale_print_padding_left: settings.sale_print_padding_left,
        sale_print_font: settings.sale_print_font,
        show_receipt_shop_name: settings.show_receipt_shop_name??1,
        show_barcode_store: settings.show_barcode_store,
        show_barcode_product_price: settings.show_barcode_product_price,
        show_barcode_product_name: settings.show_barcode_product_name,        
    });

    const [barcodeSettings, setBarcodeSettings] = useState(() => {
        const initialBarcodeSettings = new Map([
          ["container_height", "28mm"],
          ["store_font_size", "0.8em"],
          ["price_font_size", "0.8em"],
          ["price_margin_top", "-3px"],
          ["price_margin_bottom", "-5px"],
          ["barcode_margin_top", "-10px"],
          ["barcode_height", 35],
          ["barcode_font_size", 14],
          ["barcode_width", 1.5],
          ["barcode_format", "CODE128"],
          ["product_name_margin_top", "-4px"],
          ["product_name_font_size", "0.7em"],
        ]);

        // Parse JSON if barcode_settings exists in settings
        if (settings.barcode_settings) {
            try {
                const parsedSettings = JSON.parse(settings.barcode_settings);
                Object.entries(parsedSettings).forEach(([key, value]) => {
                    initialBarcodeSettings.set(key, value);
                });
            } catch (error) {
                console.error("Failed to parse barcode settings:", error);
            }
        }

        return initialBarcodeSettings;
    });

      const handleBarcodeFieldChange = (e) => {
        const { name, value } = e.target;
        setBarcodeSettings((prevSettings) => new Map(prevSettings).set(name, value));
      };

    const handleFontChange = (event) => {
        const selectedFontFamily = event.target.value;
        setSettingFormData({
            ...settingFormData,
            sale_print_font: selectedFontFamily,
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettingFormData({
            ...settingFormData,
            [name]: type === "checkbox" ? (checked ? "on" : "off") : value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettingFormData({
                    ...settingFormData,
                    shop_logo: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const submittedFormData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(submittedFormData.entries());
        const barcodeSettingsObject = Object.fromEntries(barcodeSettings);
        formJson.barcodeSettings = JSON.stringify(barcodeSettingsObject);

        axios.post('/settings-update', formJson, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            Swal.fire({
                title: "Success!",
                text: "Successfully saved",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        })
        .catch((error) => {
            console.error("Submission failed with errors:", error);
            console.log(formJson);
        });
        
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <form
                id="settings-form"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
            >
                <Box
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        width={{ xs: "100%", sm: "60%" }}
                    >
                        <Grid size={12}>
                            <Accordion defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    SHOP INFORMATION
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "start",
                                            mt: "1rem",
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                width: { xs: "100%", sm: 250 },
                                            }}
                                        >
                                            <CardMedia
                                                sx={{
                                                    height: 200,
                                                    contain: "content",
                                                    padding: "8px",
                                                    backgroundSize: "contain",
                                                    backgroundOrigin:
                                                        "content-box",
                                                }}
                                                image={
                                                    settingFormData.shop_logo
                                                }
                                                title="shop logo"
                                            />

                                            <CardActions className="mt-0">
                                                {/* <Box sx={{ flexGrow: 1 }} /> */}
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    tabIndex={-1}
                                                    startIcon={
                                                        <CloudUploadIcon />
                                                    }
                                                    fullWidth
                                                >
                                                    Upload shop logo
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        name="shop_logo"
                                                    />
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label={"Shop name"}
                                        name="shop_name"
                                        multiline
                                        required
                                        sx={{ mt: "2rem" }}
                                        value={settingFormData.shop_name}
                                        onChange={handleChange}
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    RECEIPT PRINT
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        sx={{
                                            display: "flex",
                                            width: "100%",
                                        }}
                                        spacing={3}
                                    >
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label={"Receipt note"}
                                                name="sale_receipt_note"
                                                multiline
                                                required
                                                value={
                                                    settingFormData.sale_receipt_note
                                                }
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label={"Show shopname"}
                                                name="show_receipt_shop_name"
                                                multiline
                                                required
                                                value={
                                                    settingFormData.show_receipt_shop_name
                                                }
                                                onChange={handleChange}
                                                select
                                            >
                                                <MenuItem value={1}>Show</MenuItem>
                                                <MenuItem value={0}>Hide</MenuItem>

                                                </TextField>
                                        </Grid>
                                        <Grid size={3}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label={"Padding Right"}
                                                name="sale_print_padding_right"
                                                multiline
                                                required
                                                value={
                                                    settingFormData.sale_print_padding_right
                                                }
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid size={3}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label={"Padding Left"}
                                                name="sale_print_padding_left"
                                                multiline
                                                required
                                                value={
                                                    settingFormData.sale_print_padding_left
                                                }
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>
                                                    Choose Font for Receipt
                                                </InputLabel>
                                                <Select
                                                    name="sale_print_font"
                                                    label="Choose Font for Receipt"
                                                    value={
                                                        settingFormData.sale_print_font
                                                    }
                                                    onChange={handleFontChange}
                                                >
                                                    {fontOptions.map(
                                                        (option) => (
                                                            <MenuItem
                                                                key={
                                                                    option.fontFamily
                                                                }
                                                                value={
                                                                    option.fontFamily
                                                                }
                                                            >
                                                                <Typography
                                                                    style={{
                                                                        fontFamily:
                                                                            option.fontFamily,
                                                                    }}
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </Typography>
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    BARCODE PRINT
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        sx={{
                                            display: "flex",
                                            width: "100%",
                                        }}
                                    >
                                        <Grid size={6}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        name="show_barcode_store"
                                                        value={
                                                            settingFormData.show_barcode_store
                                                        }
                                                        onChange={handleChange}
                                                        checked={
                                                            settingFormData.show_barcode_store ===
                                                            "on"
                                                        }
                                                    />
                                                }
                                                label="STORE NAME"
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        name="show_barcode_product_price"
                                                        value={
                                                            settingFormData.show_barcode_product_price
                                                        }
                                                        onChange={handleChange}
                                                        checked={
                                                            settingFormData.show_barcode_product_price ===
                                                            "on"
                                                        }
                                                    />
                                                }
                                                label="PRODUCT PRICE"
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        name="show_barcode_product_name"
                                                        value={
                                                            settingFormData.show_barcode_product_name
                                                        }
                                                        onChange={handleChange}
                                                        checked={
                                                            settingFormData.show_barcode_product_name ===
                                                            "on"
                                                        }
                                                    />
                                                }
                                                label="PRODUCT NAME"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid spacing={2} container sx={{ mt: 2 }}>
                                    {[...barcodeSettings.keys()].map((key) => (
                                    <Grid item size={3} key={key}>
                                        <TextField
                                        fullWidth
                                        variant="outlined"
                                        label={key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                        name={key}
                                        value={barcodeSettings.get(key)}
                                        onChange={handleBarcodeFieldChange}
                                        />
                                    </Grid>
                                    ))}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid
                            size={12}
                            justifyContent={"end"}
                            sx={{ display: "flex" }}
                        >
                            <Button
                                type="submit"
                                variant="outlined"
                                size="large"
                                color="success"
                            >
                                UPDATE
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthenticatedLayout>
    );
}
