import * as React from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { Link } from '@inertiajs/react'

const productColumns = (handleEdit) => [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Product Name', width: 200,
        renderCell: (params) => (
            <Link underline="hover" className='hover:underline' href={"/products/"+params.row.id+"/edit"}><p className='font-bold'>{params.value}</p></Link>
        ),
     },
    { field: 'barcode', headerName: 'Barcode', width: 170 },
    { field: 'batch_number', headerName: 'Batch', width: 100 },
    { field: 'cost', headerName: 'Cost', width: 100 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'total_quantity', headerName: 'Quantity', width: 100 },
    { field: 'created_at', headerName: 'Created At'},
    { field: 'updated_at', headerName: 'Updated At'},
];


 export default function Product({products, urlImage}) {
    const auth = usePage().props.auth.user

    const handleEdit = (product) => {
        console.log(product)
      };

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
                    rows={products} 
                    sx={{
                        // '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                        // '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '10px' },
                        // '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
                      }}
                    columns={productColumns(handleEdit)}
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