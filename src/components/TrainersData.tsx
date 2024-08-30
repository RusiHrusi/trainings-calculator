import {Divider, Grid, Popover, Typography} from '@mui/material';
import React from 'react';

import {TrainersComponentData, TrainersErrors, TrainersHelperTexts} from '../global';
import {fontHeader, handleKeyPressNumbersOnly} from '../utils';
import {TrainerField} from './Trainer';

export const TrainersData: React.FC<TrainersComponentData> = ({
    trainingsPerTrainer,
    addTrainer,
    removeTrainer,
    updateTrainerTrainings,
    trainersErrors,
    trainersHelperTexts,
    trainersPopoverId,
    trainersPopoverOpen,
    trainersPopover,
    handlePopoversClose,
}) => {
    return (
        <>
            <Grid item xs={12} style={{padding: '20px'}} display='flex' justifyContent='center' alignItems='center'>
                <label style={{fontWeight: 'bold', fontFamily: fontHeader}}>Треньори:</label>
            </Grid>

            <Grid
                item
                id='trainersGrid'
                xs={12}
                display='flex'
                flexDirection='row'
                style={{padding: '20px', paddingTop: '0px'}}
            >
                <Grid item xs={6} display='flex' flexDirection='column'>
                    <TrainerField
                        name={'Алекс'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'left'}
                    />
                    <TrainerField
                        name={'Йоан'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'left'}
                    />
                    <TrainerField
                        name={'Калоян'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'left'}
                    />
                    <TrainerField
                        name={'Кико'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'left'}
                    />
                    <TrainerField
                        name={'Марио'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'left'}
                    />
                </Grid>
                <Divider orientation='vertical' flexItem />
                <Grid item xs={6} display='flex' flexDirection='column'>
                    <TrainerField
                        name={'Марто'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'right'}
                    />
                    <TrainerField
                        name={'Пеца'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'right'}
                    />
                    <TrainerField
                        name={'Рус'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'right'}
                    />
                    <TrainerField
                        name={'Стели'}
                        trainingsPerTrainer={trainingsPerTrainer}
                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                        addTrainer={addTrainer}
                        removeTrainer={removeTrainer}
                        updateTrainerTrainings={updateTrainerTrainings}
                        positioning={'right'}
                    />
                    <Grid item xs={12} display='flex' flexDirection='row' alignItems='center' />
                </Grid>
                <Popover
                    id={trainersPopoverId}
                    open={trainersPopoverOpen}
                    anchorEl={trainersPopover}
                    onClose={handlePopoversClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top', // 'top', 'bottom', 'center'
                        horizontal: 'center', // 'left', 'right', 'center'
                    }}
                >
                    <Typography sx={{p: 2, color: 'red', whiteSpace: 'pre-line'}}>
                        {Object.keys(trainersErrors)
                            .map((k) =>
                                trainersErrors[k as keyof TrainersErrors]
                                    ? '❌ - ' + trainersHelperTexts[k as keyof TrainersHelperTexts]
                                    : null,
                            )
                            .filter((v) => v !== null)
                            .join('\n')}
                    </Typography>
                </Popover>
            </Grid>
        </>
    );
};
