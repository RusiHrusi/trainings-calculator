import {Grid, TextField} from '@mui/material';
import React from 'react';

import {LabelledTextFieldProps} from '../global';
import {fontHeader} from "../utils";

export const LabelledTextField: React.FC<LabelledTextFieldProps> = ({label, width, inputProps, value, onChange}) => (
    <Grid item xs={12} display='flex' flexDirection='row' alignItems='center' justifyContent='center'>
        <label style={{fontFamily: fontHeader, paddingRight: '10px'}}>{label}</label>
        <TextField
            id='outlined-basic'
            variant='outlined'
            style={{width, paddingRight: '10px'}}
            inputProps={inputProps}
            value={value}
            onChange={onChange}
            autoComplete='off'
        />
    </Grid>
);
