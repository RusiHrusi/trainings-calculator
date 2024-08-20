const {app, BrowserWindow, ipcMain} = require('electron');
const {writeFile} = require("fs/promises");
const path = require('path');

if (require('electron-squirrel-startup')) app.quit();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const indexPath = path.join(__dirname, 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('write-to-file', async (event, {fileName, content}) => {
    try {
        await writeFile(fileName, content, {encoding: 'utf8'});
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