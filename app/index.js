'use strict';
require('strict-import')(module, {
	_allowedModules: [
		'electron-debug',
	],
});
const electron = require('electron');
const {autoUpdater} = require('electron-updater');
const {is, disableZoom} = require('electron-util');
const serve = require('electron-serve');
const logger = require('electron-timber');
const ipc = require('electron-better-ipc');
const appMenu = require('./menu');
const config = require('./config');
const marketmaker = require('./marketmaker');
const {loginWindowSize} = require('./constants');
const {isDevelopment} = require('./util-common');

require('electron-unhandled')({
	showDialog: !isDevelopment,
});
require('electron-debug')({
	enabled: isDevelopment,
	showDevTools: 'undocked',
});
require('electron-context-menu')();

try {
	require('electron-reloader')(module, {watchRenderer: false});
} catch (err) {}

const {app, session} = electron;

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
		useContentSize: true,
		width: loginWindowSize.width,
		height: loginWindowSize.height,
		resizable: false,
		maximizable: false,
		fullscreenable: false,
		titleBarStyle: 'hiddenInset',
		backgroundColor: '#1b232f', // Same as `--background-color`
		darkTheme: isDarkMode, // GTK+3
		webPreferences: {
			webviewTag: false, // Disabled for security reasons since we don't use it
			blinkFeatures: 'CSSBackdropFilter',
		},
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	if (is.development) {
		win.loadURL('http://localhost:8080/dev.html');
	} else {
		loadUrl(win);
	}

	disableZoom(win);

	return win;
}

app.on('ready', () => {
	session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
		if (permission === 'notifications') {
			callback(true);
			return;
		}

		// We deny almost everything for extra security as we don't need it
		callback(false);
	});

	logger.log(`HyperDEX ${app.getVersion()}`);

	appMenu();

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
	// TODO: Only save this when logged in.
	// config.set('windowState', mainWindow.getBounds());
});

ipc.answerRenderer('start-marketmaker', async seedPhrase => {
	await marketmaker.start({seedPhrase});
	return marketmaker.port;
});

ipc.answerRenderer('stop-marketmaker', async () => {
	await marketmaker.stop();
});
