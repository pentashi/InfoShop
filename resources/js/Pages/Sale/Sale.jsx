import * as React from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia'
import Grid from '@mui/material/Grid2';
import { Button, Box,Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';

import dayjs from 'dayjs';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddPaymentDialog from '@/Components/AddPaymentDialog';
import CustomPagination from '@/Components/CustomPagination';

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

export default function Sale({ sales}) {
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [amountLimit, setAmountLimit] = useState(0)
  const [salesView, setSalesView] = useState(sales.data)

  const handleRowClick = (sale) => {
  //   const sale_index = salesView.findIndex(item => item.id === sale.id);
  //   if (sale_index !== -1) {

  //     const updatedData = [
  //       ...salesView.slice(0, sale_index),
  //       {
  //           ...salesView[sale_index],
  //           ['amount_received']: '10000'
  //       },
  //       ...salesView.slice(sale_index + 1)
  //   ];
  
  //     setSalesView(updatedData)
  // } else {
  //     console.log("Item not found");
  // }
  
    
    const amountLimit = parseFloat(sale.total_amount) - parseFloat(sale.amount_received)
      setSelectedTransaction(sale)
      setSelectedContact(sale.contact_id)
      setAmountLimit(amountLimit)
      setPaymentModalOpen(true)
    };

    const refreshSales=()=>{
      
    } 

    const handleChange = (event, page) => {
      const selectedPage = sales.links.find(item => item.label === page.toString());
      if (selectedPage && selectedPage.url) {
        // Use Inertia.js to visit the selected page URL
        // For example: Inertia.visit(selectedPage.url);
        
        router.visit(selectedPage.url, { method: 'get' })
      }
    };

    const prevUrl = sales.links.find((item) => item.label === "&laquo; Previous")?.url;
  const nextUrl = sales.links.find((item) => item.label === "Next &raquo;")?.url;

  const CustomFooter = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Pagination sales={paginationData} />
      </div>
    );
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
                  <Button variant="contained" onClick={refreshSales}>
                  <RefreshIcon/>
                  </Button>
              </Grid>

              <Box
                  className="py-6 w-full"
                  sx={{ display: "grid", gridTemplateColumns: "1fr" }}
              >
                  <DataGrid
                      rows={salesView}
                      columns={columns(handleRowClick)}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                          toolbar: {
                              showQuickFilter: true,
                          },
                      }}
                      components={{ footer: CustomFooter }}
                      // initialState={{
                      //   pagination: {
                      //     paginationModel: { pageSize: 25, page: 0 },
                      //   },
                      // }}
                      // pageSizeOptions={[25,]}
                      // initialState={{
                      //     pagination: {
                      //         paginationModel: {
                      //             pageSize: 15,
                      //         },
                      //     },
                      // }}
                  />
              </Box>
          </Grid>
                 <CustomPagination
                dataLinks={sales.links}
                dataLastPage={sales.last_page}
              ></CustomPagination>

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
