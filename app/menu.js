'use strict';
const path = require('path');
const electron = require('electron');
const {runJS, is, appMenu, openUrlMenuItem, aboutMenuItem} = require('electron-util');
const ipc = require('electron-better-ipc');
const i18next = require('i18next');
const config = require('./config');
const {openGitHubIssue} = require('./util');
const {websiteUrl, repoUrl, appViews, supportedLanguagesWithNames} = require('./constants');
const {isDevelopment, isNightlyBuild} = require('./util-common');
const {translate} = require('./locale');
const {portfoliosDirectoryPath, getPortfolioFilePath} = require('./portfolio-util');

const {app, BrowserWindow, shell, clipboard, Menu} = electron;
const t = translate('menu');

const sendAction = (action, data) => {
	const [win] = BrowserWindow.getAllWindows();

	if (is.macos) {
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
			label: t('help.debugMode'),
			type: 'checkbox',
			checked: isDevelopment,
			enabled: !isNightlyBuild && !is.development, // Enable it only in production
			click() {
				config.set('isDebugMode', !isDevelopment);
				app.relaunch();
				app.quit();
			},
		},
		{
			type: 'separator',
		},
		openUrlMenuItem({
			label: t('help.website'),
			url: websiteUrl,
		}),
		openUrlMenuItem({
			label: t('help.sourceCode'),
			url: repoUrl,
		}),
		openUrlMenuItem({
			label: t('help.reportSecurityIssue'),
			url: 'mailto:hyperdex@protonmail.com',
		}),
		{
			label: t('help.reportIssue'),
			click() {
				openGitHubIssue('<!-- Please succinctly describe your issue and steps to reproduce it -->');
			},
		},
	];

	if (!is.macos) {
		helpSubmenu.push(
			{
				type: 'separator',
			},
			aboutMenuItem({
				icon: path.join(__dirname, 'static/icon.png'),
				// FIXME: Doing it like this for now so I don't have to update all the translations
				title: t('help.about', {appName: ''}).trim(),
				copyright: 'Copyright © Luke Childs',
			})
		);
	}

	return helpSubmenu;
};

const createDebugMenu = () => {
	const createLanguageMenu = () => {
		const menu = {
			label: 'Language',
			submenu: [],
		};

		for (const [language, name] of supportedLanguagesWithNames) {
			menu.submenu.push({
				label: `${name} (${language})`,
				type: 'radio',
				checked: i18next.language === language,
				click() {
					config.set('debug_forcedLanguage', language);
					app.relaunch();
					app.quit();
				},
			});
		}

		return menu;
	};

	const debugMenu = {
		label: 'Debug',
		submenu: [
			createLanguageMenu(),
			{
				type: 'separator',
			},
			{
				label: 'Log Container State',
				async click(menuItem, win) {
					await runJS('UNSTATED.logState()', win);
				},
			},
			{
				label: 'Toggle Logging on State Changes',
				async click(menuItem, win) {
					await runJS('UNSTATED.logStateChanges = !UNSTATED.logStateChanges', win);
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Log Swaps',
				async click(menuItem, win) {
					await runJS('console.log(await _swapDB.getSwaps())', win);
				},
			},
			{
				label: 'Copy Swaps to Clipboard',
				async click(menuItem, win) {
					const swaps = await runJS('_swapDB.getSwaps()', win);
					clipboard.writeText(JSON.stringify(swaps, null, '\t'));
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Show Settings',
				click() {
					config.openInEditor();
				},
			},
			{
				label: 'Show Current Portfolio',
				async click(menuItem, win) {
					const id = await ipc.callRenderer(win, 'current-portfolio-id');
					shell.openItem(getPortfolioFilePath(id));
				},
			},
			{
				label: 'Show Portfolios',
				click() {
					shell.openItem(portfoliosDirectoryPath);
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
				label: 'Delete Swap History',
				async click(menuItem, win) {
					await runJS('_swapDB.destroy()', win);
					app.relaunch();
					app.quit();
				},
			},
			{
				label: 'Delete Portfolios',
				click(menuItem, win) {
					shell.moveItemToTrash(path.join(app.getPath('userData'), 'portfolios'));
					win.webContents.reload();
				},
			},
			{
				label: 'Delete Settings',
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
	const {isLoggedIn, activeView} = {
		isLoggedIn: false,
		activeView: 'Login',
		...options,
	};

	const portfolioSubmenu = [];
	for (const [index, view] of appViews.entries()) {
		portfolioSubmenu.push({
			label: t(`portfolio.${view.toLowerCase()}`),
			type: 'radio',
			checked: activeView === view,
			accelerator: `CommandOrControl+${index + 1}`,
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
			label: t('portfolio.goToNextView'),
			accelerator: 'Control+Tab',
			click() {
				sendAction('set-next-view');
			},
		},
		{
			label: t('portfolio.goToPrevView'),
			accelerator: 'Control+Shift+Tab',
			click() {
				sendAction('set-previous-view');
			},
		},
		{
			type: 'separator',
		},
		{
			label: t('portfolio.logOut'),
			click() {
				sendAction('log-out');
			},
		}
	);

	const macosTemplate = [
		appMenu([
			{
				label: t('app.preferences'),
				accelerator: 'Command+,',
				click() {
					setActiveView('Settings');
				},
			},
		]),
		{
			role: 'editMenu',
		},
		isLoggedIn && {
			label: t('portfolio.title'),
			// TODO: Can't use `visible` because of Electron bug:
			// https://github.com/electron/electron/issues/8703
			// visible: isLoggedIn,
			submenu: portfolioSubmenu,
		},
		{
			role: 'windowMenu',
		},
		{
			role: 'help',
			submenu: createHelpMenu(),
		},
	];

	const otherTemplate = [
		{
			label: t('other.file'),
			submenu: [
				{
					role: 'quit',
				},
			],
		},
		{
			role: 'editMenu',
		},
		isLoggedIn && {
			label: t('portfolio.title'),
			// TODO: Can't use `visible` because of Electron bug:
			// https://github.com/electron/electron/issues/8703
			// visible: isLoggedIn,
			submenu: portfolioSubmenu,
		},
		{
			role: 'help',
			submenu: createHelpMenu(),
		},
	];

	const template = is.macos ? macosTemplate : otherTemplate;

	if (isDevelopment) {
		template.push(createDebugMenu());
	}

	Menu.setApplicationMenu(Menu.buildFromTemplate(template.filter(Boolean)));
};

ipc.on('app-container-state-updated', (event, state) => {
	createAppMenu({
		// TODO: Get the logged in state from the container
		isLoggedIn: state.activeView !== 'Login' && state.activeView !== 'AppSettings',
		activeView: state.activeView,
	});
});

module.exports = createAppMenu;
