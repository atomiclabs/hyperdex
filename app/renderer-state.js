'use strict';
const electron = require('electron');

const {ipcMain: ipc} = electron;

const rendererState = {};

ipc.on('app-container-state-updated', (event, state) => {
	rendererState.appContainer = state;
	rendererState.isLoggedIn = state.activeView !== 'Login' && state.activeView !== 'AppSettings';
});

module.exports = rendererState;
