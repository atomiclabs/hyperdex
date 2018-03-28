'use strict';
const path = require('path');
const electron = require('electron');
const {is, runJS} = require('electron-util');
const config = require('./config');
const {openGitHubIssue} = require('./util');
const {repoUrl, appViews} = require('./constants');

const {app, BrowserWindow, shell} = electron;
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

const viewSubmenu = [];

for (const [i, view] of appViews.entries()) {
	viewSubmenu.push({
		label: view,
		accelerator: `CommandOrControl+${i + 1}`,
		click() {
			setActiveView(view);
		},
	});
}

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

const debugMenu = {
	label: 'Debug',
	submenu: [
		{
			label: 'Log Container State',
			async click() {
				const [win] = BrowserWindow.getAllWindows();
				await runJS('__UNSTATED__.logState()', win);
			},
		},
		{
			label: 'Toggle Logging on State Changes',
			async click() {
				const [win] = BrowserWindow.getAllWindows();
				await runJS('__UNSTATED__.logStateChanges = !__UNSTATED__.logStateChanges', win);
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
			label: 'Delete Data App',
			click() {
				shell.moveItemToTrash(app.getPath('userData'));
				app.relaunch();
				app.quit();
			},
		},
	],
};

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
				accelerator: 'Cmd+,',
				click() {
					setActiveView('Preferences');
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Log Out',
				click() {
					sendAction('log-out');
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
	// {
	// 	label: 'File',
	// 	submenu: [
	// 		{
	// 			label: 'New Transaction', // TODO
	// 			accelerator: 'Cmd+N',
	// 			click() {
	// 				// - sendAction('something');
	// 			},
	// 		},
	// 	],
	// },
	{
		role: 'editMenu',
	},
	{
		label: 'View',
		submenu: viewSubmenu,
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
				accelerator: 'Control+Tab',
				click() {
					sendAction('set-next-view');
				},
			},
			{
				label: 'Select Previous View',
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
		submenu: helpSubmenu,
	},
];

const otherTpl = [
	{
		label: 'File',
		submenu: [
			// {
			// 	label: 'New Transaction', // TODO
			// 	accelerator: 'Cmd+N',
			// 	click() {
			// 		// - sendAction('something');
			// 	},
			// },
			// {
			// 	type: 'separator',
			// },
			{
				label: 'Log Out',
				click() {
					sendAction('log-out');
				},
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
		label: 'Edit',
		submenu: [
			{
				role: 'undo',
			},
			{
				role: 'redo',
			},
			{
				type: 'separator',
			},
			{
				role: 'cut',
			},
			{
				role: 'copy',
			},
			{
				role: 'paste',
			},
			{
				role: 'delete',
			},
			{
				type: 'separator',
			},
			{
				role: 'selectall',
			},
			{
				type: 'separator',
			},
			{
				label: 'Preferences',
				accelerator: 'Ctrl+,',
				click() {
					setActiveView('Preferences');
				},
			},
		],
	},
	{
		label: 'View',
		submenu: viewSubmenu,
	},
	{
		role: 'help',
		submenu: helpSubmenu,
	},
];

const tpl = process.platform === 'darwin' ? macosTpl : otherTpl;

if (is.development) {
	tpl.push(debugMenu);
}

module.exports = electron.Menu.buildFromTemplate(tpl);
