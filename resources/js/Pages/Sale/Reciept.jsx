import React, { useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Button, Box,Typography, Paper, Card, CardMedia,Divider } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { styled } from '@mui/material/styles';

import { useReactToPrint } from 'react-to-print';

export default function Reciept({ sale, salesItems, settings, user_name }) {
    const contentRef = useRef(null);

    const reactToPrintFn = useReactToPrint({ contentRef });

  const RecieptContainer = styled(Paper)(({ theme }) => ({
    width: '500px',
    padding: theme.spacing(3),
    ...theme.typography.body2,
    textAlign: 'center',
  }));

  return (
    <>
      <Head title="Sale Reciept" />
        <Box className="flex justify-center mt-10">
            <RecieptContainer square={false}>
                <Box className="flex justify-between">
                    <Button onClick={() => window.history.back()} variant="outlined" startIcon={<ArrowBackIosIcon />}>
                        Back
                    </Button>
                    <Button onClick={reactToPrintFn} variant="contained" endIcon={<PrintIcon />}>
                        Print
                    </Button>
                </Box>
                <div id="print-area" ref={contentRef} className='p-3'>
                    <Box className="flex justify-center items-center mt-8 flex-col">
                        <Card sx={{ width: 120,boxShadow: 0 }}>
                            <CardMedia
                            component="img"
                            height="140"
                            image={window.location.origin + '/' +settings.shop_logo}
                            />
                        </Card>
                        <Typography variant="h5" color="initial" sx={{mt:'0.5rem'}}>{settings.shop_name}</Typography>
                        <Typography variant='h6' sx={{fontSize:'1rem'}} color="initial">{sale.address}</Typography>
                    </Box>
                    <Divider
                        sx={{
                            borderBottom: "1px dashed",
                            borderColor: "grey.500",
                            my: "1rem",
                        }}
                    />
                    <Box className="flex items-start flex-col">
                        <p>Order: #{String(sale.id).padStart(4, '0')}</p>
                        <p>Date: {sale.sale_date} By: {user_name}</p>
                        <p>Client: {sale.name}</p>
                    </Box>
                    <Divider
                        sx={{
                            borderBottom: "1px dashed",
                            borderColor: "grey.500",
                            my: "1rem",
                        }}
                    />

                    <TableContainer>
                        <Table sx={{ width: '100%', padding:'0' }} aria-label="sales table">
                            <TableHead>
                            <TableRow>
                                <TableCell sx={{ padding: 0, py:1 }}>Name</TableCell>
                                <TableCell sx={{ padding: 0 }} align="right">Qty.</TableCell>
                                <TableCell sx={{ padding: 0 }} align="right">Price</TableCell>
                                <TableCell sx={{ padding: 0 }} align="right">Total</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {salesItems.map((item, index) => (
                                <TableRow key={index}>
                                <TableCell sx={{ padding: 0, py:1 }}>{item.name}</TableCell>
                                <TableCell sx={{ padding: 0 }} align="right">{item.quantity}</TableCell>
                                <TableCell sx={{ padding: 0 }} align="right">{item.unit_price}</TableCell>
                                <TableCell sx={{ padding: 0 }} align="right">{(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}

                            {/* Spacer Row */}
                            <TableRow>
                            <TableCell colSpan={4} sx={{ padding: '7px 0', borderBottom: 'none' }} />
                            </TableRow>
                            {/* Row for Total, Discount, Subtotal, Amount Received, Change */}
                            <TableRow sx={{ border: 'none' }}>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} colSpan={3} align="right"><strong>Total:</strong></TableCell>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} align="right">
                                Rs.{(parseFloat(sale.total_amount) + parseFloat(sale.discount)).toFixed(2)}
                            </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: 'none' }}>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} colSpan={3} align="right"><strong>Discount:</strong></TableCell>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} align="right">
                                Rs.{sale.discount}
                            </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: 'none' }}>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} colSpan={3} align="right"><strong>Subtotal:</strong></TableCell>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} align="right">
                                Rs.{(parseFloat(sale.total_amount)).toFixed(2)}
                            </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: 'none' }}>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} colSpan={3} align="right"><strong>Amount Received:</strong></TableCell>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} align="right">
                                Rs.{sale.amount_received}
                            </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: 'none' }}>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} colSpan={3} align="right"><strong>Change:</strong></TableCell>
                            <TableCell sx={{ padding: 0, borderBottom: 'none' }} align="right">
                                Rs.{(parseFloat(sale.amount_received) - parseFloat(sale.total_amount)).toFixed(2)}
                            </TableCell>
                            </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider
                        sx={{
                            borderBottom: "1px dashed",
                            borderColor: "grey.500",
                            my: "1rem",
                        }}
                    />
                    <Typography align="center" variant="body1" color="initial">{settings.sale_receipt_note}</Typography>

                </div>
            </RecieptContainer>
        </Box>
    </>
  );
}
