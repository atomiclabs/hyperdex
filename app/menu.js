'use strict';
const os = require('os');
const path = require('path');
const electron = require('electron');
const {is, runJS} = require('electron-util');
const config = require('./config');

const {app, BrowserWindow, shell} = electron;
const appName = app.getName();
const githubRepo = 'https://github.com/lukechilds/hyperdex';

function sendAction(action) {
	const [win] = BrowserWindow.getAllWindows();

	if (process.platform === 'darwin') {
		win.restore();
	}

	win.webContents.send(action);
}

const viewSubmenu = [
	// {
	// 	label: 'Toggle Dark Mode',
	// 	accelerator: 'CmdOrCtrl+D',
	// 	click() {
	// 		sendAction('toggle-dark-mode');
	// 	},
	// },
];

const helpSubmenu = [
	{
		label: `Website`,
		click() {
			// TODO: Put website URL here
			shell.openExternal(githubRepo);
		},
	},
	{
		label: `Source Code`,
		click() {
			shell.openExternal(githubRepo);
		},
	},
	{
		label: 'Report an Issue…',
		click() {
			const body = `
<!-- Please succinctly describe your issue and steps to reproduce it -->


---

${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

			shell.openExternal(`${githubRepo}/issues/new?body=${encodeURIComponent(body)}`);
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
				await runJS('__UNSTATED__.logState()');
			},
		},
		{
			label: 'Toggle Logging on State Changes',
			async click() {
				await runJS('__UNSTATED__.logStateChanges = !__UNSTATED__.logStateChanges');
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
					sendAction('show-preferences');
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
					sendAction('show-preferences');
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
