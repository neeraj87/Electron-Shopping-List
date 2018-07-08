const electron = require('electron');
const {
    app,
    BrowserWindow,
    Menu
} = electron;
const path = require('path');
const url = require('url');

const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
            label: 'Add Item',
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear items'
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];

let win;
let addWindow;

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//add dev tools in development
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label : 'Dev Tools',
        submenu : [
            {
                label : 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role : 'reload'
            }
        ]
    });
}

function createWindow() {
    //create browser window
    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: __dirname + '/img/settings-icon.png'
    });

    //build menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert the menu
    Menu.setApplicationMenu(mainMenu);

    //load index html page
    win.loadFile('index.html');

    win.on('closed', function () {
        win = null;
        app.quit();
    });
}

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List',
    });
    //load index html page
    addWindow.loadFile('addWindow.html');

    addWindow.on('closed', function () {
        addWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});