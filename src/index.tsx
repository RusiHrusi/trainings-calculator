import React, { useState } from 'react'; import ReactDOM from 'react-dom';

declare global { interface Process { type?: string; }

    interface Window {
        process?: Process;
        require?: NodeRequire;
    }
}

const isElectron = () => { return typeof window !== 'undefined' && window.process && window.process.type === 'renderer'; };

const App = () => { const [result, setResult] = useState('');

    const calculate = async () => {
        // const data = 'Some calculated data';
        if (isElectron()) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('write-to-file', { fileName: 'output.txt', content: 'abrakadabra' });
            setResult('File has been saved!');
        } else {
            console.log('Not running in Electron environment');
        }
    };

    return (
        <div>
            <button onClick={calculate}>Calculate</button>
            <p>{result}</p>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));