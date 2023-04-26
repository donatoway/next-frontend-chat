import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export const  SelectTextFields = (props) => {
    const [selected, setSelected] = useState(props.users.at(0));
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
    <div>
        <TextField
          id="filled-select-currency-native"
          select
          SelectProps={{
            native: true,
          }}
          value={selected}
          onChange={e => setSelected(e.target.value)} 
          helperText="Please select user"
          variant="filled"
        >
          {
  
          props.users.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
    </div>
    {props.handleSelect(selected)}
    </Box>

  );
}