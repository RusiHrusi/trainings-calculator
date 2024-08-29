import {Button, Divider, Grid, Stack, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';

// @ts-ignore
import Logo from './assets/logo1.svg';
import {fontHeader, LabeledSelection, LabelledTextField, TrainerField, TrainerField2} from './components';
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

    const [trainingsPerTrainer, setTrainingsPerTrainer] = useState({});

    const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        setSelectedAuthor(event.target.value as string);
    };

    const handleMoneyChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        setAllMoney(parseInt(event.target.value as string));
    };

    const handleTrainingsCountChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        setTrainingDays(parseInt(event.target.value as string));
    };

    const addTrainer = (trainerName: string) => {
        setTrainingsPerTrainer((prevState) => ({
            ...prevState,
            [trainerName]: 0,
        }));
    };

    const removeTrainer = (name: string) => {
        setTrainingsPerTrainer((prevState) => {
            const newState = {...prevState};
            // @ts-ignore
            delete newState[name];
            return newState;
        });
    };

    // const allMoney = 5764;
    // const trainingDays = 9;
    // const trainingsPerTrainer = {
    //     mario: 6,
    //     yoan: 3,
    //     rus: 9,
    // };

    useEffect(() => {
        console.log('Selected author: ', selectedAuthor);
    }, [selectedAuthor]);

    useEffect(() => {
        console.log('All money: ', allMoney);
    }, [allMoney]);

    useEffect(() => {
        console.log('Training days: ', trainingDays);
    }, [trainingDays]);

    useEffect(() => {
        console.log('Trainings per trainer: ', JSON.stringify(trainingsPerTrainer));
    }, [trainingsPerTrainer]);

    const calculateAndGenerateExport = async () => {
        if (isElectron()) {
            const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
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
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
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

                            <Grid item xs={12} display='flex' flexDirection='row' style={{padding: '20px'}}>
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
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 6}}
                                        value={allMoney ? allMoney.toString() : ''}
                                        onChange={handleMoneyChange}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <LabelledTextField
                                        label='Тренировки:'
                                        width='50px'
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        value={trainingDays ? trainingDays.toString() : ''}
                                        onChange={handleTrainingsCountChange}
                                    />
                                </Grid>
                            </Grid>

                            <Divider/>

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
                                xs={12}
                                display='flex'
                                flexDirection='row'
                                style={{padding: '20px', paddingTop: '0px'}}
                            >
                                <Grid item xs={6} display='flex' flexDirection='column'>
                                    <TrainerField
                                        name={'Алекс'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                    <TrainerField
                                        name={'Йоан'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                    <TrainerField
                                        name={'Калоян'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                    <TrainerField
                                        name={'Кико'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                    <TrainerField
                                        name={'Марио'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                </Grid>
                                <Divider orientation='vertical' flexItem/>
                                <Grid item xs={6} display='flex' flexDirection='column'>
                                    <TrainerField2
                                        name={'Марто'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                    <TrainerField2
                                        name={'Пеца'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                    <TrainerField2
                                        name={'Рус'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                    <TrainerField2
                                        name={'Стели'}
                                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                                        addTrainer={addTrainer}
                                        removeTrainer={removeTrainer}
                                    />
                                    <Grid item xs={12} display='flex' flexDirection='row' alignItems='center'/>
                                </Grid>
                            </Grid>

                            <Divider/>

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
                                        value='Тука ще се показва дали е успешно или не'
                                        InputProps={{readOnly: true}}
                                        sx={{width: '-webkit-fill-available'}}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={4} display='flex' justifyContent='center' alignItems='center'>
                            <Logo width='80%' height='80%'/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </>
    );
};

root.render(<App/>);
