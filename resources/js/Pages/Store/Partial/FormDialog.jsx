import * as React from 'react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Swal from 'sweetalert2';


export default function FormDialog({ open, handleClose,store }) {

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    if (store) {
      setName(store.name || '');
      setAddress(store.address || '');
      setContactNumber(store.contact_number || '');
    } else {
      setName('');
      setAddress('');
      setContactNumber('');
    }
  }, [store]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Determine the endpoint based on whether we are editing or adding
    const endpoint = store ? `/store/${store.id}` : '/store';
    const method = store ? 'put' : 'post'; // Use PUT for editing

    // Send form data via Inertia
    router[method](endpoint, formJson, {
      onSuccess: (resp) => {
        const responseMessage = resp.props.flash?.message || 'Store created!';

        Swal.fire({
          title: 'Success!',
          text: 'Successfully saved',
          icon: 'success',
          position: 'bottom-start',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          // confirmButtonText: 'OK',
          toast: true,
        })
        handleClose(); // Close dialog on success
      },
      onError: (errors) => {
        console.error('Submission failed with errors:', errors);
      },
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}

        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Store Information</DialogTitle>
        <DialogContent>
           {/* Store Name */}
          <TextField
            className="py-8"
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Store name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Store Address */}
          <TextField
            className="py-8"
            required
            margin="dense"
            id="address"
            name="address"
            label="Store Address"
            type="text"
            fullWidth
            variant="standard"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          
          {/* Store Contact Number */}
          <TextField
            className="py-8"
            required
            margin="dense"
            id="contact_number"
            name="contact_number"
            label="Contact Number"
            type="text"
            fullWidth
            variant="standard"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">SAVE</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}