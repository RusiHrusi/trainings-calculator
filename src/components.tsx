import {Grid, MenuItem, TextField} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, {useState} from 'react';

export const fontHeader = `"Roboto","Helvetica","Arial",sans-serif`;

export interface LabelledTextFieldProps {
    label: string;
    width: string;
    inputProps?: object;
    value: string;
    onChange: (event: React.ChangeEvent<{value: unknown}>) => void;
}

export interface LabelledSelection {
    label: string;
    width: string;
    options: string[];
    value: string;
    onChange: (event: React.ChangeEvent<{value: unknown}>) => void;
}

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

export interface TrainerFieldProps {
    name: string;
    inputProps: object;
    addTrainer: (name: string) => void;
    removeTrainer: (name: string) => void;
}

export const TrainerField: React.FC<TrainerFieldProps> = ({name, inputProps, addTrainer, removeTrainer}) => {
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = () => {
        setChecked(!checked);
        if (checked) {
            removeTrainer(name);
            console.log('Trainer removed: ', name);
            // TODO: investigate why opposite of checked???
        } else {
            addTrainer(name);
            console.log('Trainer added: ', name);
        }
    };

    return (
        <Grid item xs={12} display='flex' flexDirection='row' alignItems='center'>
            <Grid item xs={6} style={{paddingRight: '10px'}}>
                <FormControlLabel
                    control={<Checkbox checked={checked} onChange={handleCheckboxChange} />}
                    label={<span style={{textDecoration: checked ? 'none' : 'line-through'}}>{name}</span>}
                />
            </Grid>
            <Grid item xs={3} style={{padding: '10px'}}>
                <TextField
                    id='outlined-basic'
                    variant='outlined'
                    style={{width: '50px', backgroundColor: checked ? 'white' : 'gainsboro'}}
                    inputProps={inputProps}
                    disabled={!checked}
                    autoComplete='off'
                />
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
};

export const TrainerField2: React.FC<TrainerFieldProps> = ({name, inputProps, addTrainer, removeTrainer}) => {
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = () => {
        setChecked(!checked);
        if (checked) {
            removeTrainer(name);
            console.log('Trainer removed: ', name);
            // TODO: investigate why opposite of checked???
        } else {
            addTrainer(name);
            console.log('Trainer added: ', name);
        }
    };

    return (
        <Grid item xs={12} display='flex' flexDirection='row' alignItems='center'>
            <Grid item xs={3}></Grid>
            <Grid item xs={6} style={{paddingRight: '10px'}}>
                <FormControlLabel
                    control={<Checkbox checked={checked} onChange={handleCheckboxChange} />}
                    label={<span style={{textDecoration: checked ? 'none' : 'line-through'}}>{name}</span>}
                />
            </Grid>
            <Grid item xs={3} style={{padding: '10px'}}>
                <TextField
                    id='outlined-basic'
                    variant='outlined'
                    style={{width: '50px', backgroundColor: checked ? 'white' : 'gainsboro'}}
                    inputProps={inputProps}
                    disabled={!checked}
                    autoComplete='off'
                />
            </Grid>
        </Grid>
    );
};
