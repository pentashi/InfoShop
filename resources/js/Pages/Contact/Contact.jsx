import * as React from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import FormDialog from './Partial/FormDialog';

const columns = (handleEdit) => [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 }, // Changed from collection_type to address
    { field: 'balance', headerName: 'Balance', width: 100 }, // Added balance
    { field: 'created_at', headerName: 'Created At', width: 100 },
    {
      field: 'action',
      headerName: 'Actions',
      renderCell: (params) => (
        <Button onClick={() => handleEdit(params.row)} startIcon={<EditIcon />} variant="outlined">
          Edit
        </Button>
      ),
    },
];

export default function Contact({contacts, type}) {
  const auth = usePage().props.auth.user;
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleClickOpen = () => {
    setSelectedContact(null);
    setOpen(true);
  };

  const handleEdit = (contact) => {
    console.log(contact)
    setSelectedContact(contact); // Set selected collection for editing
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setSelectedContact(null);
    setOpen(false);
  };

  const handleFormSuccess = () => {
    // Close the dialog and refresh contacts
    
  };

  return (
    <AuthenticatedLayout>
        {/* Capitalize first letter of type and add s at the end */}
      <Head title={type[0].toUpperCase()+ type.slice(1)+'s'} />

      <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
        <Grid size={8}>
          <Typography variant="h4" component="h2">
          {type[0].toUpperCase()+ type.slice(1)+'s'}
          </Typography>
        </Grid>
        <Grid size={4} container justifyContent="end">
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
            Add {type[0].toUpperCase()+ type.slice(1)}
          </Button>
        </Grid>

        <Box className="py-6 w-full" sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          <DataGrid
            rows={contacts}
            columns={columns(handleEdit)}
            pageSize={10}
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Box>
      </Grid>

      <FormDialog open={open} handleClose={handleClose} contact={selectedContact} contactType={type} />
    </AuthenticatedLayout>
  );
}
