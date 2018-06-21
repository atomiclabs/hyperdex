'use strict';
require('strict-import')(module, {
	_allowedModules: [
		'electron-debug',
	],
});
const {URL} = require('url');
const electron = require('electron');
const {autoUpdater} = require('electron-updater');
const {is, disableZoom, appReady} = require('electron-util');
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
});
require('electron-context-menu')();

try {
	require('electron-reloader')(module, {watchRenderer: false});
} catch (_) {}

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
			electron.shell.openExternal('https://github.com/hyperdexapp/hyperdex/releases/latest');
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
		win.loadURL('http://localhost:8080');
	} else {
		loadUrl(win);
	}

	disableZoom(win);

	return win;
}

// TODO(sindresorhus): Move this to `electron-util`
const setContentSecuriyPolicy = async (policy, options) => {
	await appReady;

	options = Object.assign({
		session: session.defaultSession,
	}, options);

	options.session.webRequest.onHeadersReceived((details, callback) => {
		let policyString = typeof policy === 'function' ? policy(details) : policy;

		if (!policyString.split('\n').filter(x => x.trim()).every(x => x.endsWith(';'))) {
			throw new Error('Each line must end in a semicolon');
		}

		policyString = policyString.replace(/[\t\n]/g, '').trim();

		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': [policyString],
			},
		});
	});
};

if (!is.development) {
	/// Note: Validate it with https://csp-evaluator.withgoogle.com after doing changes
	setContentSecuriyPolicy(() => {
		let host = marketmaker.port && `127.0.0.1:${marketmaker.port}`;

		const mmUrl = config.get('marketmakerUrl');
		if (mmUrl) {
			({host} = new URL(mmUrl));
		}

		const mmPolicy = host ? `http://${host} ws://${host}` : '';

		return `
			default-src 'none';
			script-src 'self';
			img-src 'self' data:;
			style-src 'self' 'unsafe-inline';
			font-src 'self';
			connect-src 'self' ${mmPolicy} https://api.coinmarketcap.com https://min-api.cryptocompare.com;

			base-uri 'none';
			form-action 'none';
			frame-ancestors 'none';
		`;
	});
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

ipc.answerRenderer('set-active-view-on-dom-ready', async view => {
	mainWindow.webContents.once('dom-ready', () => {
		mainWindow.webContents.send('set-active-view', view);
	});
});
