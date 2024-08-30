import {Button, Divider, Grid, Popover, Stack, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';

// @ts-ignore
import Logo from './assets/logo1.svg';
import {
    fontHeader,
    GeneralErrors,
    GeneralHelperTexts,
    LabeledSelection,
    LabelledTextField,
    TrainerField,
    TrainerField2,
    TrainingsPerTrainer,
} from './components';
import {calcStatistics, generateExportText} from './Statistics';

declare global {
    interface Process {
        type?: string;
    }

    interface Window {
        process?: Process;
        require?: NodeRequire;
    }
}

const isElectron = () => typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const TrainerNames: string[] = ['Алекс', 'Йоан', 'Калоян', 'Кико', 'Марио', 'Пеца', 'Рус', 'Стела'];

const App: React.FC = () => {
    const [result, setResult] = useState('');
    const username = 'RusHrus';

    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [allMoney, setAllMoney] = useState<number>(0);
    const [trainingDays, setTrainingDays] = useState<number>(0);

    const [trainingsPerTrainer, setTrainingsPerTrainer] = useState<TrainingsPerTrainer>({});
    const [generalErrors, setGeneralErrors] = useState<GeneralErrors>({
        allMoney: false,
        selectedAuthor: false,
        trainingDays: false,
    });

    const [generalHelperTexts, setGeneralHelperTexts] = useState<GeneralHelperTexts>({
        allMoney: '',
        selectedAuthor: '',
        trainingDays: '',
    });

    const [trainersErrors, setTrainersErrors] = useState({
        trainingsPerTrainer: false,
        trainingsPerTrainerSum: false,
    });

    const [trainersHelperTexts, setTrainersHelperTexts] = useState({
        trainingsPerTrainer: '',
        trainingsPerTrainerSum: '',
    });

    const handleSelectChange = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
        setSelectedAuthor(event.target.value as string);
    };

    const handleMoneyChange = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
        setAllMoney(parseInt(event.target.value as string));
    };

    const handleTrainingsCountChange = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
        setTrainingDays(parseInt(event.target.value as string));
    };

    const addTrainer = (trainerName: string) => {
        setTrainingsPerTrainer((prevState) => ({
            ...prevState,
            [trainerName]: 0,
        }));
    };

    const removeTrainer = (trainerName: string) => {
        setTrainingsPerTrainer((prevState) => {
            const newState = {...prevState};
            // @ts-ignore
            delete newState[trainerName];
            return newState;
        });
    };

    const updateTrainerTrainings = (event: React.ChangeEvent<{value: unknown}>, trainerName: string) => {
        const trainingsCount = parseInt(event.target.value as string);
        setTrainingsPerTrainer((prevState) => ({
            ...prevState,
            [trainerName]: trainingsCount,
        }));
    };

    const [trainersPopover, setTrainersPopover] = useState<HTMLElement | null>(null);
    const [generalPopover, setGeneralPopover] = useState<HTMLElement | null>(null);

    const handlePopoversClose = () => {
        setTrainersPopover(null);
        setGeneralPopover(null);
    };

    const trainersPopoverOpen = Boolean(trainersPopover);
    const generalPopoverOpen = Boolean(generalPopover);

    const trainersPopoverId = trainersPopoverOpen ? 'trainers-popover' : undefined;
    const generalPopoverId = generalPopoverOpen ? 'general-popover' : undefined;

    const validateFields = () => {
        let isValid = true;

        let generalError = false;
        let trainersError = false;

        const newGeneralErrors = {
            allMoney: false,
            selectedAuthor: false,
            trainingDays: false,
        };

        const newTrainersErrors = {
            trainingsPerTrainer: false,
            trainingsPerTrainerSum: false,
        };

        const newGeneralHelperTexts = {
            allMoney: '',
            selectedAuthor: '',
            trainingDays: '',
        };

        const newTrainersHelperTexts = {
            trainingsPerTrainer: '',
            trainingsPerTrainerSum: '',
        };

        if (!allMoney) {
            newGeneralErrors.allMoney = true;
            newGeneralHelperTexts.allMoney = 'Невалидна сума пари.';
            isValid = false;
            generalError = true;
        }

        if (!selectedAuthor) {
            newGeneralErrors.selectedAuthor = true;
            newGeneralHelperTexts.selectedAuthor = 'Липсва автор.';
            isValid = false;
            generalError = true;
        }

        if (!trainingDays) {
            newGeneralErrors.trainingDays = true;
            newGeneralHelperTexts.trainingDays = 'Невалиден брой тренировки.';
            isValid = false;
            generalError = true;
        }

        // TODO: add trainers validations

        if (generalError) {
            const generalGrid = document.getElementById('generalGrid');
            setGeneralPopover(generalGrid);
        }

        if (trainersError) {
            const trainersGrid = document.getElementById('trainersGrid');
            setGeneralPopover(trainersPopover);
        }

        setGeneralErrors(newGeneralErrors);
        setGeneralHelperTexts(newGeneralHelperTexts);
        return isValid;
    };

    const calculateAndGenerateExport = async () => {
        if (!validateFields()) {
            return;
        }

        if (isElectron()) {
            const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
            console.log(statistics);
            const exportText = generateExportText(username, statistics);

            const datetime = new Date()
                .toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                })
                .replace(/\//g, '-');
            const fileName = `Export_${username}_${datetime}`;
            const {ipcRenderer} = window.require('electron');

            ipcRenderer.send('write-to-file', {fileName, content: exportText});
            setResult('File has been saved!');
        } else {
            console.log('Not running in Electron environment');
            const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
            console.log(statistics);
        }
    };

    const handleKeyPressNumbersOnly = (event: React.KeyboardEvent) => {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    return (
        <>
            <Grid item xs={12} style={{height: '150px'}}></Grid>
            <Grid container spacing={2}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                    <Grid item xs={12} display='flex' flexDirection='row'>
                        <Grid item xs={8} display='flex' flexDirection='column'>
                            <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                                <label style={{fontWeight: 'bold', fontFamily: fontHeader}}>Параметри:</label>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                id={'generalGrid'}
                                display='flex'
                                flexDirection='row'
                                style={{padding: '20px'}}
                            >
                                <Grid item xs={4}>
                                    <LabeledSelection
                                        label={'Изготвил:'}
                                        width={'150px'}
                                        options={TrainerNames}
                                        value={selectedAuthor}
                                        onChange={handleSelectChange}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <LabelledTextField
                                        label='Пари:'
                                        width='100px'
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 6}}
                                        value={allMoney ? allMoney.toString() : ''}
                                        onChange={handleMoneyChange}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <LabelledTextField
                                        label='Тренировки:'
                                        width='50px'
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        value={trainingDays ? trainingDays.toString() : ''}
                                        onChange={handleTrainingsCountChange}
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
                                    <Typography sx={{ p: 2, color: 'red', whiteSpace: 'pre-line' }}>
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

                            <Divider />

                            <Grid
                                item
                                xs={12}
                                style={{padding: '20px'}}
                                display='flex'
                                justifyContent='center'
                                alignItems='center'
                            >
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
                                    />
                                    <TrainerField
                                        name={'Йоан'}
                                        trainingsPerTrainer={trainingsPerTrainer}
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                        updateTrainerTrainings={updateTrainerTrainings}
                                    />
                                    <TrainerField
                                        name={'Калоян'}
                                        trainingsPerTrainer={trainingsPerTrainer}
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                        updateTrainerTrainings={updateTrainerTrainings}
                                    />
                                    <TrainerField
                                        name={'Кико'}
                                        trainingsPerTrainer={trainingsPerTrainer}
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                        updateTrainerTrainings={updateTrainerTrainings}
                                    />
                                    <TrainerField
                                        name={'Марио'}
                                        trainingsPerTrainer={trainingsPerTrainer}
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                        updateTrainerTrainings={updateTrainerTrainings}
                                    />
                                </Grid>
                                <Divider orientation='vertical' flexItem />
                                <Grid item xs={6} display='flex' flexDirection='column'>
                                    <TrainerField2
                                        name={'Марто'}
                                        trainingsPerTrainer={trainingsPerTrainer}
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                        updateTrainerTrainings={updateTrainerTrainings}
                                    />
                                    <TrainerField2
                                        name={'Пеца'}
                                        trainingsPerTrainer={trainingsPerTrainer}
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                        updateTrainerTrainings={updateTrainerTrainings}
                                    />
                                    <TrainerField2
                                        name={'Рус'}
                                        trainingsPerTrainer={trainingsPerTrainer}
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                        updateTrainerTrainings={updateTrainerTrainings}
                                    />
                                    <TrainerField2
                                        name={'Стели'}
                                        trainingsPerTrainer={trainingsPerTrainer}
                                        inputProps={{onKeyPress: handleKeyPressNumbersOnly, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                        updateTrainerTrainings={updateTrainerTrainings}
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
                                    <Typography sx={{p: 2, color: 'red'}}>Error</Typography>
                                </Popover>
                            </Grid>

                            <Divider />

                            <Grid
                                item
                                xs={12}
                                style={{padding: '20px'}}
                                display='flex'
                                justifyContent='center'
                                alignItems='center'
                            >
                                <label style={{fontWeight: 'bold', fontFamily: fontHeader}}>Експорт:</label>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                display='flex'
                                justifyContent='center'
                                style={{paddingLeft: '20px', paddingRight: '20px'}}
                                alignItems='center'
                            >
                                <Grid item xs={3}>
                                    <Stack direction='row'>
                                        <Button
                                            variant='contained'
                                            onClick={calculateAndGenerateExport}
                                            sx={{
                                                WebkitTextStrokeWidth: 'medium',
                                                width: '-webkit-fill-available',
                                            }}
                                        >
                                            Calculate
                                        </Button>
                                        <p>{result}</p>
                                    </Stack>
                                </Grid>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        id='outlined-basic'
                                        variant='outlined'
                                        value=''
                                        InputProps={{readOnly: true}}
                                        sx={{width: '-webkit-fill-available'}}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={4} display='flex' justifyContent='center' alignItems='center'>
                            <Logo width='80%' height='80%' />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </>
    );
};

root.render(<App />);
