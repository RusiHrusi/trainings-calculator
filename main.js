const {app, BrowserWindow, ipcMain} = require('electron');
const {writeFile} = require("fs/promises");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('./dist/index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('write-to-file', async (event, {fileName, content}) => {
    try {
        const buffer = Buffer.from(content, 'utf8');
        await writeFile(fileName, buffer);
        console.log(`File ${fileName} has been saved.`);
    } catch (error) {
        console.error(`Error writing file ${fileName}:`, error);
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});