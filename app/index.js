'use strict';
const childProcess = require('child_process');
const electron = require('electron');
const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const serve = require('electron-serve');
const logger = require('electron-timber');
const appMenu = require('./menu');
const config = require('./config');
const marketmaker = require('./marketmaker');

require('electron-unhandled')();
require('electron-debug')({
	enabled: true, // TODO: Remove this when we ship the app
	showDevTools: true,
});
require('electron-context-menu')();

try {
	require('electron-reloader')(module, {watchRenderer: false});
} catch (err) {}

const {app} = electron;

app.setAppUserModelId('com.lukechilds.hyperdex');

if (!is.development) {
	autoUpdater.logger = logger.log;

	autoUpdater.on('update-available', () => {
		const notification = new electron.Notification({
			title: `${app.getName()} Update Available!`,
			body: 'Click to view the latest version.',
		});

		notification.on('click', () => {
			electron.shell.openExternal('https://github.com/lukechilds/hyperdex/releases/latest');
		});

		notification.show();
	});

	autoUpdater.autoDownload = false;
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

const loadUrl = serve({directory: 'renderer-dist'});

function createMainWindow() {
	const isDarkMode = config.get('darkMode');

	const win = new electron.BrowserWindow({
		show: false,
		title: app.getName(),
		width: 660,
		height: 450,
		resizable: false,
		maximizable: false,
		fullscreenable: false,
		titleBarStyle: 'hiddenInset',
		darkTheme: isDarkMode, // GTK+3
		webPreferences: {
			blinkFeatures: 'CSSBackdropFilter',
		},
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	if (is.development) {
		win.loadURL('http://localhost:8080');

		win.webContents.on('dom-ready', () => {
			childProcess.execFile('killall', ['marketmaker']);
		});
	} else {
		loadUrl(win);
	}

	return win;
}

app.on('ready', () => {
	electron.Menu.setApplicationMenu(appMenu);
	mainWindow = createMainWindow();

	logger.log(`HyperDEX ${app.getVersion()}`);
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
	// TODO: Only save this when logged in.
	// config.set('windowState', mainWindow.getBounds());
});

electron.ipcMain.on('start-marketmaker', async (event, {seedPhrase}) => {
	await marketmaker.start({seedPhrase});
	mainWindow.send('marketmaker-started', marketmaker.port);
});

electron.ipcMain.on('stop-marketmaker', () => {
	marketmaker.stop();
});
