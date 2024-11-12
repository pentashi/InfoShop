import * as React from 'react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

import { DataGrid, GridToolbar} from '@mui/x-data-grid';

import FormDialog from './Partial/FormDialog';

 export default function Store({stores,current_store_id, message}) {
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

    const columns = (handleEdit) => [
      { field: 'id', headerName: 'ID', width: 50 },
      { field: 'name', headerName: 'Store Name', width: 250,
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
      { field: 'created_at', headerName: 'Created At', width: 120 },
      { field: 'current_store', headerName: 'Current store', width: 130,
          renderCell: (params) => (
            <Button
                onClick={params.row.id === current_store_id ? undefined : () => changeSelectedStore(params.row.id)}
                variant={params.row.id === current_store_id ? 'contained' : 'text'}
                color={params.row.id === current_store_id ? 'success' : 'primary'}
                sx={{ fontWeight: 'bold' }}
            >
                {params.row.id === current_store_id ? 'Selected' : 'Select'} {/* Change text based on condition */}
            </Button>
          ),
      },
    ];

    const changeSelectedStore = async (newStoreId) => {
      try {
          const response = await axios.post('/change-store', {
              store_id: newStoreId,
          });
          console.log(response.data.message); // Handle success message
          router.reload({ only: ['stores', 'current_store_id'] })
      } catch (error) {
          console.error('Error changing store ID:', error.response.data); // Handle error
      }
    };

    useEffect(() => {
        if (current_store_id == null) {
            Swal.fire({
                title: 'Please select a store',
                icon: 'info', // You can change this to 'success', 'error', etc.
                confirmButtonText: 'Okay'
            });
        }
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Store" />
                <Grid container spacing={2} alignItems='center' justifyContent={'end'} sx={{ width: "100%", mt:2}}>
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