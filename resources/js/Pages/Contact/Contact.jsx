import * as React from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { router } from '@inertiajs/react'
import AddPaymentDialog from '@/Components/AddPaymentDialog';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import FormDialog from './Partial/FormDialog';

const columns = (handleRowClick) => [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 200,
      renderCell: (params) => (
          <Link underline="hover" href='#' className='hover:underline' onClick={(event) => {event.preventDefault(); handleRowClick(params.row, 'contact_edit');}}>
            <p className='font-bold'>{params.value}</p>
          </Link>
      ),
    },
    { field: 'balance', headerName: 'Balance', width: 100,
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
    }, // Added balance
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 }, // Changed from collection_type to address
    { field: 'created_at', headerName: 'Created At', width: 100 },
];

export default function Contact({contacts, type, stores}) {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const handleClickOpen = () => {
    setSelectedContact(null);
    setOpen(true);
  };

  const handleRowClick = (contact, funcmethod) => {
    setSelectedContact(contact);
    if(funcmethod=='contact_edit') setOpen(true);
    else if (funcmethod=='add_payment'){
      setPaymentModalOpen(true)
    }
  };

  const handleClose = () => {
    setSelectedContact(null);
    setOpen(false);
  };

//   Reload the table after form success
  const handleFormSuccess = (contact) => {
    router.reload({
        only: ['contacts'],
      })
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
            columns={columns(handleRowClick)}
            pageSize={10}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
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

      <FormDialog open={open} handleClose={handleClose} contact={selectedContact} contactType={type} onSuccess={handleFormSuccess} />
      <AddPaymentDialog
          open={paymentModalOpen}
          setOpen={setPaymentModalOpen}
          selectedContact={selectedContact?.id}
          is_customer={type === 'customer' ? true:false}
          stores={stores}
      />

    </AuthenticatedLayout>
  );
}
