import {Grid, MenuItem, TextField} from '@mui/material';
import React from 'react';

import {LabelledSelection} from '../global';
import {fontHeader} from '../utils';

export const LabeledSelection: React.FC<LabelledSelection> = ({label, width, options, value, onChange}) => (
    <Grid item xs={12} display='flex' flexDirection='row' alignItems='center' justifyContent='center'>
        <label style={{fontFamily: fontHeader, paddingRight: '10px'}}>{label}</label>
        <TextField
            id='outlined-select'
            select
            variant='outlined'
            style={{width, paddingRight: '10px'}}
            onChange={onChange}
            value={value}
        >
            {options.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    </Grid>
);
