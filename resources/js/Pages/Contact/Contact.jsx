import * as React from 'react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Grid from '@mui/material/Grid2';
import { Button, Box, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import PrintIcon from "@mui/icons-material/Print";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormDialog from './Partial/FormDialog';
import CustomPagination from '@/Components/CustomPagination';
import AddPaymentDialog from '@/Components/AddPaymentDialog';

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
    {
        field: "action",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
            <>
                <Link href={"/reports/" + params.row.id+'/customer'}>
                    <IconButton color="primary">
                        <PrintIcon />
                    </IconButton>
                </Link>
            </>
        ),
    },
];

export default function Contact({contacts, type, stores}) {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const [dataContacts, setDataContacts] = useState(contacts);
  const [searchQuery, setSearchQuery] = useState('')

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

  const refreshContacts = (url) => {
    const options = {
        preserveState: true, // Preserves the current component's state
        preserveScroll: true, // Preserves the current scroll position
        only: ["contacts"], // Only reload specified properties
        onSuccess: (response) => {
            setDataContacts(response.props.contacts);
        },
    };
    router.get(
        url,
        {
            search_query:searchQuery
        },
        options
    );
  };

  //   Reload the table after form success
  const handleFormSuccess = (contact) => {
    refreshContacts(window.location.pathname)
  };

  return (
      <AuthenticatedLayout>
          {/* Capitalize first letter of type and add s at the end */}
          <Head title={type[0].toUpperCase() + type.slice(1) + "s"} />

          <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ width: "100%" }}
          >
              <Grid size={12} spacing={2} container justifyContent="end">
                  <TextField
                      sx={{ minWidth: "300px" }}
                      name="search_query"
                      label="Search"
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      required
                      onFocus={(event) => {
                          event.target.select();
                      }}
                      slotProps={{
                          inputLabel: {
                              shrink: true,
                          },
                      }}
                  />
                  <Button
                      variant="contained"
                      onClick={() => refreshContacts(window.location.pathname)}
                      size="large"
                  >
                      <FindReplaceIcon />
                  </Button>
                  <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleClickOpen}
                  >
                      Add {type[0].toUpperCase() + type.slice(1)}
                  </Button>
              </Grid>

              <Box
                  className="py-6 w-full"
                  sx={{ display: "grid", gridTemplateColumns: "1fr" }}
              >
                  <DataGrid
                      rows={dataContacts.data}
                      columns={columns(handleRowClick)}
                      slots={{ toolbar: GridToolbar }}
                      getRowId={(row) => row.id}
                      slotProps={{
                          toolbar: {
                              showQuickFilter: true,
                          },
                      }}
                      hideFooter
                  />
              </Box>
              <Grid size={12} container justifyContent={"end"}>
                  <CustomPagination
                      dataLinks={dataContacts?.links}
                      refreshTable={refreshContacts}
                      dataLastPage={dataContacts?.last_page}
                  ></CustomPagination>
              </Grid>
          </Grid>

          <FormDialog
              open={open}
              handleClose={handleClose}
              contact={selectedContact}
              contactType={type}
              onSuccess={handleFormSuccess}
          />
          <AddPaymentDialog
              open={paymentModalOpen}
              setOpen={setPaymentModalOpen}
              selectedContact={selectedContact?.id}
              is_customer={type === "customer" ? true : false}
              stores={stores}
              refreshTable={refreshContacts}
          />
      </AuthenticatedLayout>
  );
}
