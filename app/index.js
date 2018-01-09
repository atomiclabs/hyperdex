'use strict';
const electron = require('electron');
const log = require('electron-log');
const {autoUpdater} = require('electron-updater');
const {is, loadFile} = require('electron-util');
const appMenu = require('./menu');
const config = require('./config');
const marketmaker = require('./marketmaker');

require('electron-unhandled')();
require('electron-debug')({enabled: true, showDevTools: true});
require('electron-context-menu')();

try {
	require('electron-reloader')(module, {
		ignore: [
			'renderer',
			'marketmaker/bin'
		]
	});
} catch (err) {}

const {app} = electron;

app.setAppUserModelId('com.lukechilds.hyperdex');

if (!is.development) {
	autoUpdater.logger = log;
	autoUpdater.logger.transports.file.level = 'info';
	autoUpdater.checkForUpdates();
}

let mainWindow;

const isAlreadyRunning = app.makeSingleInstance(() => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

if (isAlreadyRunning) {
	app.quit();
}

function createMainWindow() {
	const windowState = config.get('windowState');
	const isDarkMode = config.get('darkMode');

	const win = new electron.BrowserWindow({
		show: false,
		title: app.getName(),
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
		minWidth: 400,
		minHeight: 200,
		darkTheme: isDarkMode // GTK+3
	});

	loadFile(win, 'renderer-dist/index.html');

	win.on('ready-to-show', () => {
		win.show();
	});

	return win;
}

app.on('ready', () => {
	electron.Menu.setApplicationMenu(appMenu);
	mainWindow = createMainWindow();
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('window-all-closed', () => {
	app.quit();
});

app.on('before-quit', () => {
	if (!mainWindow.isFullScreen()) {
		config.set('windowState', mainWindow.getBounds());
	}
});

electron.ipcMain.on('start-marketmaker', async (event, {seedPhrase}) => {
	await marketmaker.start({seedPhrase});
	mainWindow.send('marketmaker-started', marketmaker.port);
});
