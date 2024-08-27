import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {calcStatistics, generateExportText} from "./Statistics";
import {Button, Divider, Grid, Stack, TextField} from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// @ts-ignore
import Logo from "./assets/logo1.svg";

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

const fontHeader = `"Roboto","Helvetica","Arial",sans-serif`;

interface LabelledTextFieldProps {
    label: string;
    width: string;
    inputProps?: object;
}

const LabelledTextField: React.FC<LabelledTextFieldProps> = ({label, width, inputProps}) => (
    <Grid item xs={12} display="flex" flexDirection="row" alignItems="center" justifyContent="center">
        <label style={{fontFamily: fontHeader, paddingRight: "10px"}}>{label}</label>
        <TextField id="outlined-basic" variant="outlined" style={{width, paddingRight: "10px"}} inputProps={inputProps}/>
    </Grid>
);

interface TrainerFieldProps {
    name: string;
}

const TrainerField: React.FC<TrainerFieldProps> = ({name}) => (
    <Grid item xs={12} display="flex" flexDirection="row" alignItems="center">
        <Grid item xs={6} style={{paddingRight: "10px"}}>
            <FormControlLabel control={<Checkbox checked={false} onChange={() => {
            }}/>} label={name}/>
        </Grid>
        <Grid item xs={3} style={{padding: "10px"}}>
            <TextField id="outlined-basic" variant="outlined" style={{width: '50px'}}/>
        </Grid>
        <Grid item xs={3}></Grid>
    </Grid>
);

const TrainerField2: React.FC<TrainerFieldProps> = ({name}) => (
    <Grid item xs={12} display="flex" flexDirection="row" alignItems="center">
        <Grid item xs={3}></Grid>
        <Grid item xs={6} style={{paddingRight: "10px"}}>
            <FormControlLabel control={<Checkbox checked={false} onChange={() => {
            }}/>} label={name}/>
        </Grid>
        <Grid item xs={3} style={{padding: "10px"}}>
            <TextField id="outlined-basic" variant="outlined" style={{width: '50px'}}/>
        </Grid>
    </Grid>
);

const App: React.FC = () => {
    const [result, setResult] = useState('');
    const username = 'RusHrus';

    const allMoney = 5764;
    const trainingDays = 9;
    const trainingsPerTrainer = {
        mario: 6,
        yoan: 3,
        rus: 9,
    }

    const calculateAndGenerateExport = async () => {
        if (isElectron()) {
            const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
            const exportText = generateExportText(username, statistics);

            const datetime = new Date().toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '-');
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
                    <Grid item xs={12} display="flex" flexDirection="row">
                        <Grid item xs={8} display="flex" flexDirection="column">
                            <Grid item xs={12} display="flex" justifyContent="center"
                                  alignItems="center">
                                <label style={{fontWeight: "bold", fontFamily: fontHeader}}>Параметри:</label>
                            </Grid>

                            <Grid item xs={12} display="flex" flexDirection="row" style={{padding: "20px"}}>
                                <Grid item xs={4}>
                                    <LabelledTextField label="Изготвил:" width="150px" inputProps={{maxLength: 25}}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <LabelledTextField label="Пари:" width="100px"
                                                       inputProps={{onKeyPress: handleKeyPress, maxLength: 6}}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <LabelledTextField label="Тренировки:" width="50px"
                                                       inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}/>
                                </Grid>
                            </Grid>

                            <Divider/>

                            <Grid item xs={12} style={{padding: "20px"}} display="flex" justifyContent="center"
                                  alignItems="center">
                                <label style={{fontWeight: "bold", fontFamily: fontHeader}}>Треньори:</label>
                            </Grid>

                            <Grid item xs={12} display="flex" flexDirection="row" style={{padding: "20px", paddingTop: "0px"}}>
                                <Grid item xs={6} display="flex" flexDirection="column">
                                    <TrainerField name={'Алекс'}/>
                                    <TrainerField name={'Йоан'}/>
                                    <TrainerField name={'Калоян'}/>
                                    <TrainerField name={'Кико'}/>
                                </Grid>
                                <Divider orientation="vertical" flexItem/>
                                <Grid item xs={6} display="flex" flexDirection="column">
                                    <TrainerField2 name={'Марио'}/>
                                    <TrainerField2 name={'Пеца'}/>
                                    <TrainerField2 name={'Рус'}/>
                                    <TrainerField2 name={'Стели'}/>
                                </Grid>
                            </Grid>

                            <Divider/>

                            <Grid item xs={12} style={{padding: "20px"}} display="flex" justifyContent="center"
                                  alignItems="center">
                                <label style={{fontWeight: "bold", fontFamily: fontHeader}}>Експорт:</label>
                            </Grid>

                            <Grid item xs={12} display="flex" justifyContent="center"
                                  style={{paddingLeft: "20px", paddingRight: "20px"}}
                                  alignItems="center">
                                <Grid item xs={3}>
                                    <Stack direction="row">
                                        <Button variant="contained"
                                                onClick={calculateAndGenerateExport}
                                                sx={{
                                                    WebkitTextStrokeWidth: 'medium',
                                                    width: '-webkit-fill-available'
                                                }}>Calculate</Button>
                                        <p>{result}</p>
                                    </Stack>
                                </Grid>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        value="Тука ще се показва дали е успешно или не"
                                        InputProps={{ readOnly: true }}
                                        sx={{width: '-webkit-fill-available'}}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>

                        <Grid item xs={4} display="flex" justifyContent="center" alignItems="center">
                            <Logo width="80%" height="80%"/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));