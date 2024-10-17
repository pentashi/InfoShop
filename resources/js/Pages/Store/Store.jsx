import * as React from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';

import { DataGrid, GridToolbar} from '@mui/x-data-grid';

import FormDialog from './Partial/FormDialog';


  const columns = (handleEdit) => [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Store Name', width: 200,
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.row)}
          variant="text"
          sx={{fontWeight:'bold'}}
        >
          {params.value}
        </Button>
      ),
    },
    { field: 'address', headerName: 'Address', width: 300 },
    { field: 'contact_number', headerName: 'Contact Number', width: 180 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
  ];

 export default function Store({stores,session}) {
    const auth = usePage().props.auth.user
    const [open, setOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    const handleClickOpen = () => {
        setSelectedStore(null);
        setOpen(true);
    };

    const handleEdit = (store) => {
        setSelectedStore(store); // Set selected store for editing
        setOpen(true); // Open the dialog
      };

    const handleClose = () => {
        setSelectedStore(null);
        setOpen(false);
    };

   
    return (
        <AuthenticatedLayout>
          
            <Head title="Store" />
                <Grid container spacing={2} alignItems='center' sx={{ width: "100%" }}>
                    <Grid size={8}>
                        <Typography variant="h4" component="h2">Store</Typography>
                    </Grid>
                    <Grid size={4} container justifyContent='end'>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>Add Store</Button>
                    </Grid>

                    <Box className='py-6 w-full' sx={{display: 'grid', gridTemplateColumns: '1fr'}}>
                      <DataGrid 
                      rows={stores} 
                      columns={columns(handleEdit)}
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

                <FormDialog open={open} handleClose={handleClose} store={selectedStore} />
            
        </AuthenticatedLayout>
    );
}