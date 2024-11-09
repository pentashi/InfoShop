import React,{useState, useEffect, useContext} from 'react';
import {Box, IconButton, Autocomplete,TextField, FormControl, Grid2 as Grid} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FormDialog from '@/Pages/Contact/Partial/FormDialog';

import { SharedContext } from '@/Context/SharedContext';

export default function CartItemsTop({customers}) {
  const [open, setOpen] = useState(false);
  const [customerList, setCustomerList] = useState(customers)
  const { selectedCustomer, setSelectedCustomer, saleDate, setSaleDate} = useContext(SharedContext); 

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
  
    <Box sx={{width:'100%', paddingY:'15px', paddingTop:'20px'}} className="flex items-center">
      {Array.isArray(customerList) && (
        <FormControl fullWidth>
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
        </FormControl>
      )}

      <FormControl fullWidth sx={{ml:'0.5rem', maxWidth:'150px'}}>
          <TextField
              label="Sale Date"
              name="sale_date"
              placeholder="Sale Date"
              fullWidth
              type="date"
              slotProps={{
                  inputLabel: {
                      shrink: true,
                  },
              }}
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              required
          />
      </FormControl>
      
      
    <IconButton onClick={() => setOpen(true)}  sx={{ ml: '0.5rem', bgcolor: 'success.main', width: '45px', height: '45px', color:'white','&:hover': {
            bgcolor: 'success.dark', // Change the background color on hover
        } }}>
        <PersonAddIcon fontSize="inherit" />
    </IconButton>
    <FormDialog open={open} handleClose={handleClose} onSuccess={handleFormSuccess} contactType={'customer'} />
    </Box>
  );
}
