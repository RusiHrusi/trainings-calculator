import {Grid, Popover, Typography} from '@mui/material';
import React from 'react';

import {GeneralErrors, GeneralHelperTexts} from '../global';
import {handleKeyPressNumbersOnly, TrainerNames} from '../utils';
import {LabeledSelection} from './LabeledSelection';
import {LabelledTextField} from './LabeledTextField';

interface GeneralData {
    selectedAuthor: string;
    selectedAuthorOnChange: (event: React.ChangeEvent<{value: unknown}>) => void;
    allMoney: number;
    allMoneyOnChange: (event: React.ChangeEvent<{value: unknown}>) => void;
    trainingDays: number;
    trainingDaysOnChange: (event: React.ChangeEvent<{value: unknown}>) => void;
    generalErrors: GeneralErrors;
    generalHelperTexts: GeneralHelperTexts;
    generalPopoverId: string | undefined;
    generalPopoverOpen: boolean;
    generalPopover: HTMLElement | null;
    handlePopoversClose: (event: React.MouseEvent<HTMLElement>) => void;
}

export const GeneralData: React.FC<GeneralData> = ({
    selectedAuthor,
    selectedAuthorOnChange,
    allMoney,
    allMoneyOnChange,
    trainingDays,
    trainingDaysOnChange,
    generalErrors,
    generalHelperTexts,
    generalPopoverId,
    generalPopoverOpen,
    generalPopover,
    handlePopoversClose,
}) => {
    return (
        <Grid item xs={12} id={'generalGrid'} display='flex' flexDirection='row' style={{padding: '20px'}}>
            <Grid item xs={4}>
                <LabeledSelection
                    label={'Изготвил:'}
                    width={'150px'}
                    options={TrainerNames}
                    value={selectedAuthor}
                    onChange={selectedAuthorOnChange}
                />
            </Grid>
            <Grid item xs={4}>
                <LabelledTextField
                    label='Пари:'
                    width='100px'
                    inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 6}}
                    value={allMoney ? allMoney.toString() : ''}
                    onChange={allMoneyOnChange}
                />
            </Grid>
            <Grid item xs={4}>
                <LabelledTextField
                    label='Тренировки:'
                    width='50px'
                    inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                    value={trainingDays ? trainingDays.toString() : ''}
                    onChange={trainingDaysOnChange}
                />
            </Grid>
            <Popover
                id={generalPopoverId}
                open={generalPopoverOpen}
                anchorEl={generalPopover}
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
                    {Object.keys(generalErrors)
                        .map((k) =>
                            generalErrors[k as keyof GeneralErrors]
                                ? '❌ - ' + generalHelperTexts[k as keyof GeneralHelperTexts]
                                : null,
                        )
                        .filter((v) => v !== null)
                        .join('\n')}
                </Typography>
            </Popover>
        </Grid>
    );
};
