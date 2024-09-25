import * as React from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { DataGrid, GridToolbar, DEFAULT_GRID_AUTOSIZE_OPTIONS} from '@mui/x-data-grid';

import FormDialog from './Partial/FormDialog';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  const columns = (handleEdit) => [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Store Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'contact_number', headerName: 'Contact Number', width: 180 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    {
        field: 'action',
        headerName: 'Actions',
        // width: auto,
        renderCell: (params) => (
          <Button
            onClick={() => handleEdit(params.row)}
            startIcon={<EditIcon />}
            variant="outlined"
          >
            Edit
          </Button>
        ),
      },
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
        // console.log(store)
        setOpen(true); // Open the dialog
      };

    const handleClose = () => {
        setSelectedStore(null);
        setOpen(false);
    };

   
    return (
        <AuthenticatedLayout>
          
            <Head title="Product" />

            {console.log(stores)}
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