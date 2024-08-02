import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {calcStatistics, generateExportText} from "./Statistics";

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
            const exportBuffer = generateExportText(username, statistics);
            const {ipcRenderer} = window.require('electron');
            ipcRenderer.send('write-to-file', {fileName: 'output.txt', content: exportBuffer.toString('utf8')});
            setResult('File has been saved!');
        } else {
            console.log('Not running in Electron environment');
        }
    };

    return (
        <div>
            <button onClick={calculateAndGenerateExport}>Calculate</button>
            <p>{result}</p>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));