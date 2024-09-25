import * as React from 'react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Swal from 'sweetalert2';

export default function FormDialog({ open, handleClose, collection }) {
  const [name, setName] = useState('');
  const [collectionType, setCollectionType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (collection) {
      setName(collection.name || '');
      setCollectionType(collection.collection_type || '');
      setDescription(collection.description || '');
    } else {
      setName('');
      setCollectionType('');
      setDescription('');
    }
  }, [collection]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Determine the endpoint based on whether we are editing or adding
    const endpoint = collection ? `/collection/${collection.id}` : '/collection';
    const method = collection ? 'put' : 'post'; // Use PUT for editing, POST for new

    // Send form data via Inertia
    router[method](endpoint, formJson, {
      onSuccess: (resp) => {
        Swal.fire({
          title: 'Success!',
          text: 'Successfully saved',
          icon: 'success',
          position: 'bottom-start',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
        });
        handleClose(); // Close dialog on success
      },
      onError: (errors) => {
        console.error('Submission failed with errors:', errors);
      },
    });
  };

  // Collection type select box
  const handleChange = (event) => {
    setCollectionType(event.target.value);
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
        <DialogTitle>Collection Information</DialogTitle>
        <DialogContent>
          {/* Collection Name */}
          <TextField
            className="py-8"
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Collection Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth className="py-8" margin="dense">
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="collection_type"
            value={collectionType}
            label="Type"
            onChange={handleChange}
            name="collection_type"
          >
          <MenuItem value={'category'}>Category</MenuItem>
          <MenuItem value={'brand'}>Brand</MenuItem>
          <MenuItem value={'tag'}>Tag</MenuItem>
        </Select>
        </FormControl>
          {/* Collection Type
          <TextField
            className="py-8"
            required
            margin="dense"
            id="collection_type"
            name="collection_type"
            label="Collection Type"
            type="text"
            fullWidth
            variant="standard"
            value={collectionType}
            onChange={(e) => setCollectionType(e.target.value)}
          /> */}

          {/* Collection Description */}
          <TextField
            className="py-8"
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
