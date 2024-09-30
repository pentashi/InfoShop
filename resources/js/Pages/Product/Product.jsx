import * as React from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import { Link } from '@inertiajs/react'

const productColumns = (handleEdit) => [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'image_url', headerName: 'Image', width: 100,
        renderCell: (params) => (
            params.value ? (  // Check if params.value is not null
                <img
                    src={'storage/' + params.value} // Use the value from the image_url field
                    style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '5px', paddingBottom:'5px', paddingLeft:'0' }} // Adjust the size as needed
                    alt="Product Image" // Alt text for accessibility
                />
            ) : (
                <span style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '5px',paddingBottom:'5px', paddingLeft:'0' }} className='text-center'>No Image</span>  // Render fallback if no image URL
            )
        ),
     },
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
    { field: 'created_at', headerName: 'Created At', width: 100 },
    { field: 'updated_at', headerName: 'Updated At', width: 100 },
    // {
    //     field: 'action',
    //     headerName: 'Actions',
    //     renderCell: (params) => (
    //         <Button
    //             onClick={() => handleEdit(params.row)}
    //             startIcon={<EditIcon />}
    //             variant="outlined"
    //         >
    //             Edit
    //         </Button>
    //     ),
    // },
];


 export default function Product({products, urlImage, results}) {
    const auth = usePage().props.auth.user

    const handleEdit = (product) => {
        console.log(product)
      };

    return (
        <AuthenticatedLayout>
            {console.log(results)}
            <Head title="Products" />

            <Grid container spacing={2} alignItems='center' sx={{ width: "100%" }}>
                <Grid size={8}>
                    <Typography variant="h4" component="h2">Products</Typography>
                </Grid>
                <Grid size={4} container justifyContent='end'>
                    <Link href="/products/create"><Button variant="contained" startIcon={<AddIcon />}> Add Product</Button></Link>
                    
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