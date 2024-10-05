import * as React from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import { Button, Box,Typography } from '@mui/material';
import dayjs from 'dayjs';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const columns = (handleEdit) => [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Customer Name', width: 200 },
  { field: 'discount', headerName: 'Discount', width: 100 },
  { field: 'total_amount', headerName: 'Total Amount', width: 120 },
  { field: 'profit_amount', headerName: 'Profit Amount', width: 120 },
  { field: 'status', headerName: 'Status', width: 100 },
  {
    field: 'sale_date',
    headerName: 'Date',
    width: 150,
    renderCell: (params) => {
      // Format the date to 'YYYY-MM-DD'
      return dayjs(params.value).format('YYYY-MM-DD');
    },
  },
];



export default function Sale({ sales }) {
  const auth = usePage().props.auth.user;

  const handleEdit = (sales) => {
    console.log(sales)
  };

  return (
    <AuthenticatedLayout>
      <Head title="Sales" />

      <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
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

        <Box className="py-6 w-full" sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          <DataGrid
            rows={sales}
            columns={columns(handleEdit)}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Box>
      </Grid>
    </AuthenticatedLayout>
  );
}
