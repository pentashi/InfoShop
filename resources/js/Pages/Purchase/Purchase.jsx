import * as React from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import { Button, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs';

import AddPaymentDialog from '@/Components/AddPaymentDialog';
import ViewPaymentDetailsDialog from '@/Components/ViewPaymentDetailsDialog';

const columns = (handleRowClick) => [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Vendor Name', width: 200 },
    { field: 'discount', headerName: 'Discount', width: 100 },
    { field: 'total_amount', headerName: 'Total Amount', width: 120 },
    { field: 'amount_paid', headerName: 'Amount Paid', width: 120,
        renderCell: (params) => (
            <Button
                onClick={() => handleRowClick(params.row, "add_payment")}
                variant="text"
                fullWidth
                sx={{
                    textAlign: "left",
                    fontWeight: "bold",
                    justifyContent: "flex-start",
                }}
            >
                {parseFloat(params.value).toFixed(2)}
            </Button>
          ),
    },
    {
      field: 'purchase_date',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => {
        // Format the date to 'YYYY-MM-DD'
        return dayjs(params.value).format('YYYY-MM-DD');
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
        <IconButton sx={{ml:'0.3rem'}} color="primary" onClick={() => handleRowClick(params.row, "view_payments")}>
          <PaymentsIcon />
        </IconButton>
        </>
      ),
    },
  ];


 export default function Purchases({purchases}) {
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [viewPaymentsModalOpen, setViewPaymentsModalOpen] = useState(false)
    const [selectedContact, setSelectedContact] = useState(null)
    const [amountLimit, setAmountLimit] = useState(0)

  const handleRowClick = (purchase, action) => {
      setSelectedTransaction(purchase);
      if (action == "add_payment") {
          const amountLimit = parseFloat(purchase.total_amount) - parseFloat(purchase.amount_paid);
          setSelectedContact(purchase.contact_id);
          setAmountLimit(amountLimit);
          setPaymentModalOpen(true);
      } else if (action == "view_payments") {
          setViewPaymentsModalOpen(true);
      }
  };

    return (
        <AuthenticatedLayout>
            <Head title="Purchases" />

            <Grid container spacing={2} alignItems='center' sx={{ width: "100%" }}>
                <Grid size={12} container justifyContent='end'>
                    <Link href="/purchase/create"><Button variant="contained" startIcon={<AddIcon />}> Add Purchase</Button></Link>
                </Grid>

                <Box className='py-6 w-full' sx={{display: 'grid', gridTemplateColumns: '1fr'}}>
                    <DataGrid 
                    rowHeight={50}
                    rows={purchases} 
                    columns={columns(handleRowClick)}
                    pageSize={5}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                        showQuickFilter: true,
                        },
                    }}
                    />
                </Box>
            </Grid>
            <AddPaymentDialog
              open={paymentModalOpen}
              setOpen={setPaymentModalOpen}
              selectedTransaction={selectedTransaction}
              selectedContact={selectedContact}
              amountLimit={amountLimit}
              is_customer={false}
          />
          <ViewPaymentDetailsDialog
            open = {viewPaymentsModalOpen}
            setOpen = {setViewPaymentsModalOpen}
            type={'purchase'}
            selectedTransaction={selectedTransaction?.id}
          />
        </AuthenticatedLayout>
    );
}