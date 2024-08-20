import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {calcStatistics, generateExportText} from "./Statistics";
import {Button, Grid, Stack, TextField} from "@mui/material";

declare global {
    interface Process {
        type?: string;
    }

    interface Window {
        process?: Process;
        require?: NodeRequire;
    }
}

const isElectron = () => {
    return typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
};

// @ts-ignore
const LabelledTextField = ({label, width, inputProps}) => (
    <Grid
        item
        xs={12}
        display="flex"
        flexDirection="row"
        alignItems="center"
        style={{border: "1px dashed red"}}
    >
        <Grid item xs={4} style={{padding: "10px"}}>
            <label style={{fontWeight: "bold"}}>{label}</label>
        </Grid>
        <Grid item xs={8} style={{padding: "10px"}}>
            <TextField
                id="outlined-basic"
                variant="outlined"
                style={{width: width}}
                inputProps={inputProps}
            />
        </Grid>
    </Grid>
);

// @ts-ignore
const TrainerField = ({name}) => (
    <Grid
        item
        xs={12}
        display="flex"
        flexDirection="row"
        alignItems="center"
        style={{border: "1px dashed red"}}
    >
        <Grid item xs={6} style={{padding: "10px"}}>
            <label>{name}:</label>
        </Grid>
        <Grid item xs={6} style={{padding: "10px"}}>
            <TextField id="outlined-basic" variant="outlined"/>
        </Grid>
    </Grid>
);

const App = () => {
    const [result, setResult] = useState('');
    // const [username, setUsername] = useState('');
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
            // TODO: validate things
            const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
            const exportText = generateExportText(username, statistics);


            const datetime = new Date().toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '-');
            const fileName = `Export_${username}_${datetime}`;
            const {ipcRenderer} = window.require('electron');

            ipcRenderer.send('write-to-file', {fileName: fileName, content: exportText});
            setResult('File has been saved!');
        } else {
            console.log('Not running in Electron environment');
        }
    };

    // @ts-ignore
    const handleKeyPress = (event) => {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    return (
        <>
            <Grid container spacing={2} style={{border: "1px dashed red"}}>
                <Grid
                    item
                    xs={6}
                    display="flex"
                    flexDirection="column"
                    gap="10px"
                    style={{border: "1px dashed red"}}
                >
                    <LabelledTextField
                        label="Author:"
                        width="250px"
                        inputProps={{maxLength: 25}}
                    />
                    <LabelledTextField
                        label="All money:"
                        width="150px"
                        inputProps={{onKeyPress: handleKeyPress, maxLength: 6}}
                    />
                    <LabelledTextField
                        label="Training days:"
                        width="50px"
                        inputProps={{onKeyPress: handleKeyPress, maxLength: 2}}
                    />

                    <Grid
                        item
                        xs={12}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        style={{border: "1px dashed red"}}
                    >
                        <Grid
                            item
                            xs={12}
                            style={{padding: "10px"}}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <label style={{fontWeight: "bold"}}>Trainers:</label>
                        </Grid>
                    </Grid>
                    <TrainerField name="Yoan"/>
                    <TrainerField name="Rus"/>
                </Grid>

                <Grid
                    item
                    xs={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{border: "1px dashed red"}}
                >
                    <label>SHTIBIDI DOP DOP:</label>
                </Grid>

                <Grid item xs={12} style={{border: "1px dashed red"}}>
                    <label>
                        Lorem ipsum odor amet, consectetuer adipiscing elit. Mattis maximus
                        sodales cursus vivamus aenean ligula.
                    </label>
                </Grid>
            </Grid>

            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={calculateAndGenerateExport}>Calculate</Button>
                <p>{result}</p>
            </Stack>
        </>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));