'use strict';
const path = require('path');
const electron = require('electron');
const {runJS} = require('electron-util');
const config = require('./config');
const {openGitHubIssue} = require('./util');
const {websiteUrl, repoUrl, appViews} = require('./constants');

const {app, BrowserWindow, shell, clipboard, ipcMain: ipc, Menu} = electron;
const appName = app.getName();

const sendAction = (action, data) => {
	const [win] = BrowserWindow.getAllWindows();

	if (process.platform === 'darwin') {
		win.restore();
	}

	win.webContents.send(action, data);
};

const setActiveView = view => {
	sendAction('set-active-view', view);
};

const createHelpMenu = () => {
	const helpSubmenu = [
		{
			label: `Website`,
			click() {
				shell.openExternal(websiteUrl);
			},
		},
		{
			label: `Source Code`,
			click() {
				shell.openExternal(repoUrl);
			},
		},
		{
			label: 'Report an Issue…',
			click() {
				openGitHubIssue('<!-- Please succinctly describe your issue and steps to reproduce it -->');
			},
		},
	];

	if (process.platform !== 'darwin') {
		helpSubmenu.push({
			type: 'separator',
		}, {
			role: 'about',
			click() {
				electron.dialog.showMessageBox({
					title: `About ${appName}`,
					message: `${appName} ${app.getVersion()}`,
					detail: 'Copyright © Luke Childs',
					icon: path.join(__dirname, 'static/icon.png'),
				});
			},
		});
	}

	return helpSubmenu;
};

const createDebugMenu = () => {
	const debugMenu = {
		label: 'Debug',
		submenu: [
			{
				label: 'Log Container State',
				async click() {
					const [win] = BrowserWindow.getAllWindows();
					await runJS('UNSTATED.logState()', win);
				},
			},
			{
				label: 'Toggle Logging on State Changes',
				async click() {
					const [win] = BrowserWindow.getAllWindows();
					await runJS('UNSTATED.logStateChanges = !UNSTATED.logStateChanges', win);
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Log Swaps',
				async click() {
					const [win] = BrowserWindow.getAllWindows();
					await runJS('_swapDB.getSwaps().then(console.log)', win);
				},
			},
			{
				label: 'Copy Swaps to Clipboard',
				async click() {
					const [win] = BrowserWindow.getAllWindows();
					const swaps = await runJS('_swapDB.getSwaps()', win);
					clipboard.writeText(JSON.stringify(swaps, null, '\t'));
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Show Portfolios',
				click() {
					shell.openItem(path.join(app.getPath('userData'), 'portfolios'));
				},
			},
			{
				label: 'Show Preferences',
				click() {
					config.openInEditor();
				},
			},
			{
				label: 'Show App Data',
				click() {
					shell.openItem(app.getPath('userData'));
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Delete Portfolios',
				click() {
					shell.moveItemToTrash(path.join(app.getPath('userData'), 'portfolios'));
					BrowserWindow.getAllWindows()[0].webContents.reload();
				},
			},
			{
				label: 'Delete Preferences',
				click() {
					config.clear();
					app.relaunch();
					app.quit();
				},
			},
			{
				label: 'Delete App Data',
				click() {
					shell.moveItemToTrash(app.getPath('userData'));
					app.relaunch();
					app.quit();
				},
			},
		],
	};

	return debugMenu;
};

const createAppMenu = options => {
	const {isLoggedIn, activeView} = Object.assign({
		isLoggedIn: false,
		activeView: 'Login',
	}, options);

	const portfolioSubmenu = [];
	for (const [i, view] of appViews.entries()) {
		portfolioSubmenu.push({
			label: view,
			type: 'radio',
			checked: activeView === view,
			accelerator: `CommandOrControl+${i + 1}`,
			click() {
				setActiveView(view);
			},
		});
	}

	portfolioSubmenu.push(
		{
			type: 'separator',
		},
		{
			label: 'Log Out',
			click() {
				sendAction('log-out');
			},
		}
	);

	const macosTpl = [
		{
			label: appName,
			submenu: [
				{
					role: 'about',
				},
				{
					type: 'separator',
				},
				{
					label: 'Preferences…',
					visible: isLoggedIn,
					accelerator: 'Cmd+,',
					click() {
						setActiveView('Preferences');
					},
				},
				{
					type: 'separator',
				},
				{
					role: 'services',
					submenu: [],
				},
				{
					type: 'separator',
				},
				{
					role: 'hide',
				},
				{
					role: 'hideothers',
				},
				{
					role: 'unhide',
				},
				{
					type: 'separator',
				},
				{
					role: 'quit',
				},
			],
		},
		{
			role: 'editMenu',
		},
		{
			label: 'Portfolio',
			visible: isLoggedIn,
			submenu: portfolioSubmenu,
		},
		{
			role: 'window',
			submenu: [
				{
					role: 'minimize',
				},
				{
					role: 'close',
				},
				{
					type: 'separator',
				},
				{
					label: 'Select Next View',
					visible: isLoggedIn,
					accelerator: 'Control+Tab',
					click() {
						sendAction('set-next-view');
					},
				},
				{
					label: 'Select Previous View',
					visible: isLoggedIn,
					accelerator: 'Control+Shift+Tab',
					click() {
						sendAction('set-previous-view');
					},
				},
				{
					type: 'separator',
				},
				{
					role: 'front',
				},
				{
					role: 'togglefullscreen',
				},
			],
		},
		{
			role: 'help',
			submenu: createHelpMenu(),
		},
	];

	const otherTpl = [
		{
			label: 'File',
			submenu: [
				{
					role: 'quit',
				},
			],
		},
		{
			role: 'editMenu',
		},
		{
			label: 'Portfolio',
			visible: isLoggedIn,
			submenu: portfolioSubmenu,
		},
		{
			role: 'help',
			submenu: createHelpMenu(),
		},
	];

	const tpl = process.platform === 'darwin' ? macosTpl : otherTpl;

	// TODO: Uncomment this before doing the public release
	/// if (is.development) {
	tpl.push(createDebugMenu());
	/// }

	Menu.setApplicationMenu(Menu.buildFromTemplate(tpl));
};

ipc.on('app-container-state-updated', (event, state) => {
	createAppMenu({
		isLoggedIn: state.activeView !== 'Login',
		activeView: state.activeView,
	});
});

module.exports = createAppMenu;
