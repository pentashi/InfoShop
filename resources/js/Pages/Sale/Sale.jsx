import * as React from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import { Button, Box,Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddPaymentDialog from '@/Components/AddPaymentDialog';

const columns = (handleRowClick) => [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Customer Name', width: 200 },
  { field: 'discount', headerName: 'Discount', width: 100 },
  { field: 'total_amount', headerName: 'Total Amount', width: 120 },
  { field: 'amount_received', headerName: 'Amount Received', width: 120,
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
  { field: 'change', headerName: 'Change', width: 100,
    renderCell: (params) => {
      const change = params.row.amount_received-params.row.total_amount
      return (change).toFixed(2)
    },
  },
  // { field: 'profit_amount', headerName: 'Profit Amount', width: 120 },
  { field: 'status', headerName: 'Status', width: 100 },
  {
    field: 'sale_date',
    headerName: 'Date',
    width: 100,
    renderCell: (params) => {
      // Format the date to 'YYYY-MM-DD'
      return dayjs(params.value).format('YYYY-MM-DD');
    },
  },
  {
    field: 'action',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <Link href={'/reciept/'+params.row.id}>
        <Button startIcon={<PrintIcon />} variant="outlined">
          PRINT
        </Button>
      </Link>
    ),
  },
];

export default function Sale({ sales }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [amountLimit, setAmountLimit] = useState(0)

  const handleRowClick = (sale) => {
    const amountLimit = parseFloat(sale.total_amount) - parseFloat(sale.amount_received)
    setSelectedTransaction(sale)
    setSelectedContact(sale.contact_id)
    setAmountLimit(amountLimit)
    setPaymentModalOpen(true)
  };

  return (
      <AuthenticatedLayout>
          <Head title="Sales" />

          <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ width: "100%" }}
          >
              <Grid size={8}>
                  <Typography variant="h4" component="h2">
                      Sales
                  </Typography>
              </Grid>
              <Grid size={4} container justifyContent="end">
                  {/* <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
            Add Collection
          </Button> */}
              </Grid>

              <Box
                  className="py-6 w-full"
                  sx={{ display: "grid", gridTemplateColumns: "1fr" }}
              >
                  <DataGrid
                      rows={sales}
                      columns={columns(handleRowClick)}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                          toolbar: {
                              showQuickFilter: true,
                          },
                      }}
                      initialState={{
                          pagination: {
                              paginationModel: {
                                  pageSize: 15,
                              },
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
              is_customer={true}
          />
      </AuthenticatedLayout>
  );
}
