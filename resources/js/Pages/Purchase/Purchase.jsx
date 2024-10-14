import * as React from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs';

const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Vendor Name', width: 200 },
    { field: 'discount', headerName: 'Discount', width: 200 },
    { field: 'total_amount', headerName: 'Total Amount', width: 120 },
    { field: 'amount_paid', headerName: 'Amount Paid', width: 120 },
    {
      field: 'purchase_date',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => {
        // Format the date to 'YYYY-MM-DD'
        return dayjs(params.value).format('YYYY-MM-DD');
      },
    },
    // {
    //   field: 'action',
    //   headerName: 'Actions',
    //   width: 120,
    //   renderCell: (params) => (
    //     <Button onClick={() => handlePrintReciept(params.row)} startIcon={<PrintIcon />} variant="outlined">
    //       PRINT
    //     </Button>
    //   ),
    // },
  ];


 export default function Purchases({purchases}) {
    const auth = usePage().props.auth.user

    return (
        <AuthenticatedLayout>
            <Head title="Purchases" />

            <Grid container spacing={2} alignItems='center' sx={{ width: "100%" }}>
                <Grid size={8}>
                    <Typography variant="h4" component="h2">Purchases</Typography>
                </Grid>
                <Grid size={4} container justifyContent='end'>
                    <Link href="/purchase/create"><Button variant="contained" startIcon={<AddIcon />}> Add Purchase</Button></Link>
                </Grid>

                <Box className='py-6 w-full' sx={{display: 'grid', gridTemplateColumns: '1fr'}}>
                    <DataGrid 
                    rowHeight={50}
                    rows={purchases} 
                    columns={columns}
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
        </AuthenticatedLayout>
    );
}