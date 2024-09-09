import {Grid, TextField} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, {useState} from 'react';

import {TrainerFieldProps} from '../global';

export const TrainerField: React.FC<TrainerFieldProps> = ({
    name,
    trainingsPerTrainer,
    inputProps,
    addTrainer,
    removeTrainer,
    updateTrainerTrainings,
    positioning,
}) => {
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = () => {
        setChecked(!checked);
        if (checked) {
            removeTrainer(name);
            // TODO: investigate why opposite of checked???
        } else {
            addTrainer(name);
        }
    };

    return (
        <>
            {positioning === 'left' ? (
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
                            onChange={(event) => updateTrainerTrainings(event, name)}
                            value={trainingsPerTrainer[name] ? trainingsPerTrainer[name] : ''}
                        />
                    </Grid>
                    <Grid item xs={3}></Grid>
                </Grid>
            ) : (
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
                            onChange={(event) => updateTrainerTrainings(event, name)}
                            value={trainingsPerTrainer[name] ? trainingsPerTrainer[name] : ''}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
};
