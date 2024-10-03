import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Box, IconButton} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const customers = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "David Lee",
    "Eve Wilson",
    "Frank Miller",
    "Grace Davis",
    "Henry White",
    "Ivy Clark",
    "Jack Harris"
  ];

export default function CustomerSelect() {
  return (
    <Box sx={{width:'100%', paddingY:'10px'}} className="flex items-center">
    <Autocomplete
      disablePortal
      options={customers}
      fullWidth
      renderInput={(params) => <TextField {...params} label="Customer" />}
    />
    <IconButton size="large" sx={{ ml: '1rem', bgcolor: 'success.main', width: '50px', height: '50px', color:'white' }}>
        <PersonAddIcon fontSize="inherit" />
    </IconButton>
    </Box>
  );
}
