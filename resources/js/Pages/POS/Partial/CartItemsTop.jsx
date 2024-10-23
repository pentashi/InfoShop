import React,{useState, useEffect, useContext} from 'react';
import {Box, IconButton, Autocomplete,TextField} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FormDialog from '@/Pages/Contact/Partial/FormDialog';

import { SharedContext } from '@/Context/SharedContext';

export default function CartItemsTop({customers}) {
  const [open, setOpen] = useState(false);
  const [customerList, setCustomerList] = useState(customers)
  const { selectedCustomer, setSelectedCustomer} = useContext(SharedContext); 

  const handleClose = () => {
    setOpen(false);
  };

  //   Reload the table after form success
  const handleFormSuccess = (contact) => {

    setCustomerList((prevCustomers) => {
      // Create the new customer object
      const newCustomer = { id: contact.id, name: contact.name, balance: contact.balance };
      
      // Update the customer list
      const updatedCustomerList = [...prevCustomers, newCustomer];
      
      // Select the newly added customer directly
      setSelectedCustomer(newCustomer); // Set selected customer to the new customer
      
      return updatedCustomerList; // Return the updated list
    });
  };

  useEffect(() => {
    if (customerList) {
      const initialCustomer = customerList.find(customer => customer.id === 1);
      setSelectedCustomer(initialCustomer || null); 
    }
}, [customers]);

  return (
  
    <Box sx={{width:'100%', paddingY:'10px'}} className="flex items-center">
      {Array.isArray(customerList) && (
        <Autocomplete
          disablePortal
          options={customerList}
          fullWidth
          value={selectedCustomer || null}
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.name+' | '+parseFloat(option.balance).toFixed(2)}
          onChange={(event, newValue) => {
            setSelectedCustomer(newValue)
          }} 
          renderInput={(params) => <TextField {...params} label="Customer" />}
        />
      )}
    <IconButton onClick={() => setOpen(true)}  sx={{ ml: '1rem', bgcolor: 'success.main', width: '45px', height: '45px', color:'white','&:hover': {
            bgcolor: 'success.dark', // Change the background color on hover
        } }}>
        <PersonAddIcon fontSize="inherit" />
    </IconButton>
    <FormDialog open={open} handleClose={handleClose} onSuccess={handleFormSuccess} contactType={'customer'} />
    </Box>
  );
}
