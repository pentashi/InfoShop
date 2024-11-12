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
    <Grid sx={{ width:'100%', marginY:{xs:'1rem', sm:'1.2rem'}, }} container spacing={2} flexDirection={{xs:'column-reverse', sm:'row'}} >
      <Grid size={{xs:12, sm:4 }} width={'100%'}>
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
              size='small'
          />
      </Grid>
      
<Grid size={{xs:12, sm:8 }} container alignItems={'center'} width={'100%'} display={'flex'}>
  <Grid size={10}>
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
          size='small'
          renderInput={(params) => <TextField {...params} label="Customer" />}
        />
      )} 
  </Grid>
     
      <Grid size={2}>
      <IconButton onClick={() => setOpen(true)}  sx={{ bgcolor: 'success.main', width: '45px', height: '45px', color:'white','&:hover': {
            bgcolor: 'success.dark', // Change the background color on hover
        } }}>
        <PersonAddIcon fontSize="inherit" />
    </IconButton>
      </Grid>
</Grid>
      
    <FormDialog open={open} handleClose={handleClose} onSuccess={handleFormSuccess} contactType={'customer'} />
    </Grid>
  );
}
