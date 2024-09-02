import {Button, Divider, Grid, Stack, TextField} from '@mui/material';
import {IpcRendererEvent} from 'electron';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';

// @ts-ignore
import Logo from './assets/logo1.svg';
import {GeneralData} from './components/GeneralData';
import {TrainersData} from './components/TrainersData';
import {GeneralErrors, GeneralHelperTexts, TrainersErrors, TrainersHelperTexts, TrainingsPerTrainer} from './global';
import {calculateAndGenerateExport, getDefaultFileName} from './Statistics';
import {fontHeader} from './utils';

const {ipcRenderer} = window.require('electron');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

export const App: React.FC = () => {
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [allMoney, setAllMoney] = useState<number>(0);
    const [trainingDays, setTrainingDays] = useState<number>(0);

    const [infoBox, setInfoBox] = useState('');

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
    const [generalPopover, setGeneralPopover] = useState<HTMLElement | null>(null);

    const [trainingsPerTrainer, setTrainingsPerTrainer] = useState<TrainingsPerTrainer>({});
    const [trainersErrors, setTrainersErrors] = useState<TrainersErrors>({
        trainersSelected: false,
        trainingsPerTrainerSum: false,
    });
    const [trainersHelperTexts, setTrainersHelperTexts] = useState<TrainersHelperTexts>({
        trainersSelected: '',
        trainingsPerTrainerSum: '',
    });
    const [trainersPopover, setTrainersPopover] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const handleFileSaved = (event: IpcRendererEvent, {success, error}: {success: boolean; error?: string}) => {
            if (success) {
                setInfoBox('✅ Отчет генериран успешно.');
            } else {
                setInfoBox('❌ Проблем със запазването на файла.');
                console.error('File save error:', error);
            }
        };

        ipcRenderer.on('file-saved', handleFileSaved);

        return () => {
            ipcRenderer.removeListener('file-saved', handleFileSaved);
        };
    }, []);

    const generalPopoverOpen = Boolean(generalPopover);
    const generalPopoverId = generalPopoverOpen ? 'general-popover' : undefined;

    const handlePopoversClose = () => {
        setGeneralPopover(null);
        setTrainersPopover(null);
    };

    const handleAuthorChange = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
        setSelectedAuthor(event.target.value as string);
    };

    const handleMoneyChange = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
        setAllMoney(parseInt(event.target.value as string));
    };

    const handleTrainingsCountChange = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
        setTrainingDays(parseInt(event.target.value as string));
    };

    const trainersPopoverOpen = Boolean(trainersPopover);
    const trainersPopoverId = trainersPopoverOpen ? 'trainers-popover' : undefined;

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

    const validateFields = () => {
        let isValid = true;

        let generalError = false;
        let trainersError = false;

        const newGeneralErrors = {
            allMoney: false,
            selectedAuthor: false,
            trainingDays: false,
        };

        const newGeneralHelperTexts = {
            allMoney: '',
            selectedAuthor: '',
            trainingDays: '',
        };

        const newTrainersErrors = {
            trainersSelected: false,
            trainingsPerTrainerSum: false,
        };

        const newTrainersHelperTexts = {
            trainersSelected: '',
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

        if (Object.keys(trainingsPerTrainer).length === 0) {
            newTrainersErrors.trainersSelected = true;
            newTrainersHelperTexts.trainersSelected = 'Няма избрани треньори.';
            isValid = false;
            trainersError = true;
        } else {
            let trainingsSum = 0;
            Object.values(trainingsPerTrainer).forEach((v) => (trainingsSum += v));
            if (trainingsSum !== trainingDays * 2) {
                newTrainersErrors.trainingsPerTrainerSum = true;
                newTrainersHelperTexts.trainingsPerTrainerSum =
                    'Броят тренировъчни дни (х2) не отговаря на сумата от броя тренировки от треньори.';
                isValid = false;
                trainersError = true;
            }
        }

        if (generalError) {
            const generalGrid = document.getElementById('generalGrid');
            setGeneralPopover(generalGrid);
        }

        if (trainersError) {
            const trainersGrid = document.getElementById('trainersGrid');
            setTrainersPopover(trainersGrid);
        }

        setGeneralErrors(newGeneralErrors);
        setGeneralHelperTexts(newGeneralHelperTexts);
        setTrainersErrors(newTrainersErrors);
        setTrainersHelperTexts(newTrainersHelperTexts);

        return isValid;
    };

    const handleSaveFile = async (
        allMoney: number,
        trainingDays: number,
        trainingsPerTrainer: TrainingsPerTrainer,
        author: string,
    ) => {
        const defaultFileName = getDefaultFileName(author);
        const filePath = await ipcRenderer.invoke('show-save-dialog', defaultFileName);
        if (filePath) {
            const exportText = calculateAndGenerateExport(allMoney, trainingDays, trainingsPerTrainer, author)
            ipcRenderer.send('write-to-file', { filePath, content: exportText });
        }
    };

    return (
        <>
            <Grid item xs={12} style={{height: '100px'}}></Grid>
            <Grid container spacing={2}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                    <Grid item xs={12} display='flex' flexDirection='row'>
                        <Grid item xs={8} display='flex' flexDirection='column'>
                            <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                                <label style={{fontWeight: 'bold', fontFamily: fontHeader}}>Параметри:</label>
                            </Grid>

                            <GeneralData
                                selectedAuthor={selectedAuthor}
                                selectedAuthorOnChange={handleAuthorChange}
                                allMoney={allMoney}
                                allMoneyOnChange={handleMoneyChange}
                                trainingDays={trainingDays}
                                trainingDaysOnChange={handleTrainingsCountChange}
                                generalErrors={generalErrors}
                                generalHelperTexts={generalHelperTexts}
                                generalPopoverId={generalPopoverId}
                                generalPopoverOpen={generalPopoverOpen}
                                generalPopover={generalPopover}
                                handlePopoversClose={handlePopoversClose}
                            />

                            <Divider />

                            <TrainersData
                                trainingsPerTrainer={trainingsPerTrainer}
                                addTrainer={addTrainer}
                                removeTrainer={removeTrainer}
                                updateTrainerTrainings={updateTrainerTrainings}
                                trainersErrors={trainersErrors}
                                trainersHelperTexts={trainersHelperTexts}
                                trainersPopoverId={trainersPopoverId}
                                trainersPopoverOpen={trainersPopoverOpen}
                                trainersPopover={trainersPopover}
                                handlePopoversClose={handlePopoversClose}
                            />

                            <Divider />

                            <Grid
                                item
                                xs={12}
                                style={{padding: '20px'}}
                                display='flex'
                                justifyContent='center'
                                alignItems='center'
                            >
                                <label style={{fontWeight: 'bold', fontFamily: fontHeader}}> Отчет:</label>
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
                                            onClick={async () => {
                                                validateFields()
                                                    ? await handleSaveFile(
                                                          allMoney,
                                                          trainingDays,
                                                          trainingsPerTrainer,
                                                          selectedAuthor,
                                                      )
                                                    : null;
                                            }}
                                            sx={{
                                                WebkitTextStrokeWidth: 'medium',
                                                width: '-webkit-fill-available',
                                            }}
                                        >
                                            Генерирай
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        id='outlined-basic'
                                        variant='outlined'
                                        value={infoBox}
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
