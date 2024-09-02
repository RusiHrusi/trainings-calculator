const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const {writeFile} = require('fs/promises');
const path = require('path');

if (require('electron-squirrel-startup')) app.quit();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 980,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: __dirname + '/src/assets/recreate.ico'
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

ipcMain.on('write-to-file', async (event, {filePath, content}) => {
    try {
        await writeFile(filePath, content, {encoding: 'utf8'});
        event.sender.send('file-saved', {success: true});
        console.log(`File ${filePath} has been saved.`);
    } catch (error) {
        event.sender.send('file-saved', {success: false, error: error.message});
        console.error(`Error writing file ${filePath}:`, error);
    }
});

ipcMain.handle('show-save-dialog', async (event, defaultPath) => {
    const result = await dialog.showSaveDialog({
        defaultPath,
        filters: [{name: 'Text Files', extensions: ['txt']}],
    });
    return result.filePath;
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
