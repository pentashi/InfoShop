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
import numeral from "numeral";
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
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },
        receiptSummaryText: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "bold",
            borderBottom: "none",
            fontFamily: settings.sale_print_font,
        },
        receiptSummaryTyp: {
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },
        itemsHeader: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
            py: 1,
            pt: 0,
        },
        itemsHeaderTyp: {
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },

        itemsCells: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "500",
            py: 1,
            verticalAlign: "middle",
            fontFamily: settings.sale_print_font,
        },
        itemsCellsTyp: {
            fontSize: "13px",
            fontWeight: "500",
            fontFamily: settings.sale_print_font,
        },

        printArea: {
            paddingRight: parseFloat(settings.sale_print_padding_right),
            paddingLeft: parseFloat(settings.sale_print_padding_left),
        },
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
                    <div
                        id="print-area"
                        ref={contentRef}
                        className="p-0"
                        style={styles.printArea}
                    >
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
                                    sx={{
                                        fontSize: "20px",
                                        fontFamily: settings.sale_print_font,
                                    }}
                                    color="initial"
                                >
                                    {settings.shop_name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: "15px",
                                        fontFamily: settings.sale_print_font,
                                    }}
                                    color="initial"
                                >
                                    {sale.address + ", " + sale.contact_number}
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
                                <Typography
                                    sx={styles.receiptTopText}
                                    color="initial"
                                >
                                    Order:
                                    {sale.sale_prefix +
                                        "/" +
                                        sale.invoice_number}
                                </Typography>
                                <Typography
                                    sx={styles.receiptTopText}
                                    color="initial"
                                >
                                    Date: {sale.sale_date} By: {user_name}
                                </Typography>
                                <Typography
                                    sx={styles.receiptTopText}
                                    color="initial"
                                >
                                    Client: {sale.name}
                                </Typography>
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
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    #
                                                </Typography>
                                                {/* Add header for index */}
                                            </TableCell>
                                            <TableCell sx={styles.itemsHeader}>
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Name
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Qty.
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Price
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                {/* <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Disc.
                                                </Typography> */}
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Total
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {salesItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    sx={styles.itemsCells}
                                                >
                                                    <Typography
                                                        sx={
                                                            styles.itemsCellsTyp
                                                        }
                                                        color="initial"
                                                    >
                                                        {index + 1}.
                                                        {/* Display the index (starting from 1) */}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    sx={styles.itemsCells}
                                                >
                                                    <Typography
                                                        sx={
                                                            styles.itemsCellsTyp
                                                        }
                                                        color="initial"
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    sx={styles.itemsCells}
                                                    align="right"
                                                >
                                                    <Typography
                                                        sx={
                                                            styles.itemsCellsTyp
                                                        }
                                                        color="initial"
                                                    >
                                                        {numeral(item.quantity).format('0,0.00')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    sx={styles.itemsCells}
                                                    align="right"
                                                >
                                                    <Typography
                                                        sx={
                                                            styles.itemsCellsTyp
                                                        }
                                                        color="initial"
                                                    >
                                                        {numeral(item.unit_price-item.discount).format('0,0.00')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    sx={styles.itemsCells}
                                                    align="right"
                                                >
                                                    {/* <Typography
                                                        sx={
                                                            styles.itemsCellsTyp
                                                        }
                                                        color="initial"
                                                    >
                                                        {numeral(item.discount).format('0,0')}
                                                    </Typography> */}
                                                </TableCell>
                                                <TableCell
                                                    sx={styles.itemsCells}
                                                    align="right"
                                                >
                                                    <Typography
                                                        sx={
                                                            styles.itemsCellsTyp
                                                        }
                                                        color="initial"
                                                    >
                                                        {numeral(
                                                            parseFloat(item.quantity) *
                                                            (item.unit_price -
                                                                item.discount)
                                                        ).format('0,0.00')}  
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {/* Spacer Row */}
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
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
                                                colSpan={5}
                                                align="right"
                                                color="initial"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Total:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                                color="initial"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.
                                                    {numeral(
                                                        parseFloat(
                                                            sale.total_amount
                                                        ) +
                                                        parseFloat(
                                                            sale.discount
                                                        )
                                                    ).format('0,0.00')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ border: "none" }}>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={5}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Discount:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.{ numeral(sale.discount).format('0,0.00') }
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ border: "none" }}>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={5}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Subtotal:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.
                                                    {numeral(
                                                        sale.total_amount
                                                    ).format('0,0.00')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ border: "none" }}>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={6}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                   <br />
                                                </Typography>
                                            </TableCell>
                                            
                                        </TableRow>
                                        <TableRow sx={{ border: "none" }}>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={5}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Cash:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.{numeral(sale.amount_received).format('0,0.00')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ border: "none" }}>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={5}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Change:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.
                                                    {numeral(
                                                        parseFloat(
                                                            sale.amount_received
                                                        ) -
                                                        parseFloat(
                                                            sale.total_amount
                                                        )
                                                    ).format('0,0.00')}
                                                </Typography>
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
