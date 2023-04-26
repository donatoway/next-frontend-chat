import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
import { Button, Flex, Heading, View, useTheme } from "@aws-amplify/ui-react"

export const InputSlider = (props) => {
  const [value, setValue] = useState(30);
  const [showButton, setShowbutton] = useState(true)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={3} direction="row" sx={{ mb: 1 }} alignItems="center">
        <Slider aria-label="Small" valueLabelDisplay="auto" defaultValue={70}  value={value} onChange={handleChange} />
        { `       ${value}`}
        {props.handleTimer(value)}
      </Stack>
      
    </Box>
  );
}