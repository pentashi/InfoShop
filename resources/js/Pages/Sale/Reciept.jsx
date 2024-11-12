import React, { useRef } from "react";
import { Head } from "@inertiajs/react";
import {
    Button,
    Box,
    Typography,
    Paper,
    Card,
    CardMedia,
    Divider,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { styled } from "@mui/material/styles";

import { useReactToPrint } from "react-to-print";

export default function Reciept({ sale, salesItems, settings, user_name }) {
    const contentRef = useRef(null);

    const reactToPrintFn = useReactToPrint({ contentRef });

    const RecieptContainer = styled(Paper)(({ theme }) => ({
        width: "500px",
        padding: theme.spacing(3),
        textAlign: "center",
    }));

    const RecieptPrintContainer = styled(Paper)(({ theme }) => ({
        width: "100%",
        fontFamily: settings.sale_print_font,
        textAlign: "center",
        boxShadow: "none",
    }));

    const styles = {
        receiptTopText: {
            fontSize: '13px',
            fontWeight:'bold',
            fontFamily: settings.sale_print_font,
        },
        receiptSummaryText: {
            fontSize: '13px',
            padding: 0,
            fontWeight:'bold',
            borderBottom: "none",
            fontFamily: settings.sale_print_font,
        },
        itemsHeader:{
            fontSize: "13px",
            padding: 0, 
            fontWeight:'bold',
            fontFamily: settings.sale_print_font,
            py: 1,
            pt:0,
        },
        itemsCells:{
            fontSize: "13px",
            padding: 0,
            fontWeight:'500',
            py: 1,
            verticalAlign: "middle",
            fontFamily: settings.sale_print_font,
        },
        printArea:{
            paddingRight:parseFloat(settings.sale_print_padding_right),
            paddingLeft:parseFloat(settings.sale_print_padding_left),
        }
    };

    return (
        <>
            <Head title="Sale Reciept" />
            <Box className="flex justify-center mt-10">
                <RecieptContainer square={false}>
                    <Box className="flex justify-between mb-3">
                        <Button
                            onClick={() => window.history.back()}
                            variant="outlined"
                            startIcon={<ArrowBackIosIcon />}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={reactToPrintFn}
                            variant="contained"
                            endIcon={<PrintIcon />}
                        >
                            Print
                        </Button>
                    </Box>
                    <div id="print-area" ref={contentRef} className="p-0" style={styles.printArea}>
                    <RecieptPrintContainer square={false}>
                        <Box className="flex justify-center items-center mt-0 flex-col">
                            <Card sx={{ width: 160, boxShadow: 0 }}>
                                <CardMedia
                                    component="img"
                                    image={
                                        window.location.origin +
                                        "/" +
                                        settings.shop_logo
                                    }
                                />
                            </Card>
                            <Typography
                                variant="h5"
                                sx={{ fontSize: "20px", fontFamily: settings.sale_print_font,}}
                                color="initial"
                                
                            >
                                {settings.shop_name}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ fontSize: "15px", fontFamily: settings.sale_print_font,}}
                                color="initial"
                            >
                                {sale.address+', '+sale.contact_number}
                            </Typography>
                        </Box>
                        <Divider
                            sx={{
                                borderBottom: "1px dashed",
                                borderColor: "grey.700",
                                my: "1rem",
                            }}
                        />
                        <Box className="flex items-start flex-col">
                            <p style={styles.receiptTopText}>
                                Order: {sale.sale_prefix+'/'+sale.invoice_number}
                            </p>
                            <p style={styles.receiptTopText}>
                                Date: {sale.sale_date} By: {user_name}
                            </p>
                            <p style={styles.receiptTopText}>
                                Client: {sale.name}
                            </p>
                        </Box>
                        <Divider
                            sx={{
                                borderBottom: "1px dashed",
                                borderColor: "grey.700",
                                my: "1rem",
                            }}
                        />

                        <TableContainer>
                            <Table
                                sx={{ width: "100%", padding: "0" }}
                                aria-label="sales table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={styles.itemsHeader}>
                                            Name
                                        </TableCell>
                                        <TableCell
                                            sx={styles.itemsHeader}
                                            align="right"
                                        >
                                            Qty.
                                        </TableCell>
                                        <TableCell
                                            sx={styles.itemsHeader}
                                            align="right"
                                        >
                                            Price
                                        </TableCell>
                                        <TableCell
                                            sx={styles.itemsHeader}
                                            align="right"
                                        >
                                            Total
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salesItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                sx={styles.itemsCells}
                                            >
                                                {item.name}
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsCells}
                                                align="right"
                                            >
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsCells}
                                                align="right"
                                            >
                                                {item.unit_price}
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsCells}
                                                align="right"
                                            >
                                                {(
                                                    item.quantity *
                                                    item.unit_price
                                                ).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Spacer Row */}
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            sx={{
                                                padding: "7px 0",
                                                borderBottom: "none",
                                            }}
                                        />
                                    </TableRow>
                                    {/* Row for Total, Discount, Subtotal, Amount Received, Change */}
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            colSpan={3}
                                            align="right"
                                        >
                                            Total:
                                        </TableCell>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            align="right"
                                        >
                                            Rs.
                                            {(
                                                parseFloat(sale.total_amount) +
                                                parseFloat(sale.discount)
                                            ).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            colSpan={3}
                                            align="right"
                                        >
                                            Discount:
                                        </TableCell>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            align="right"
                                        >
                                            Rs.{sale.discount}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            colSpan={3}
                                            align="right"
                                        >
                                            Subtotal:
                                        </TableCell>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            align="right"
                                        >
                                            Rs.
                                            {parseFloat(
                                                sale.total_amount
                                            ).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            colSpan={3}
                                            align="right"
                                        >
                                            Amount Received:
                                        </TableCell>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            align="right"
                                        >
                                            Rs.{sale.amount_received}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ border: "none" }}>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            colSpan={3}
                                            align="right"
                                        >
                                            Change:
                                        </TableCell>
                                        <TableCell
                                            sx={styles.receiptSummaryText}
                                            align="right"
                                        >
                                            Rs.
                                            {(
                                                parseFloat(
                                                    sale.amount_received
                                                ) -
                                                parseFloat(sale.total_amount)
                                            ).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider
                            sx={{
                                borderBottom: "1px dashed",
                                borderColor: "grey.700",
                                my: "1rem",
                            }}
                        />
                        <Typography
                            align="center"
                            variant="body1"
                            color="initial"
                            sx={styles.receiptSummaryText}
                        >
                            {settings.sale_receipt_note}
                        </Typography>
                        </RecieptPrintContainer>
                    </div>
                </RecieptContainer>
            </Box>
        </>
    );
}
