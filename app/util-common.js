'use strict';
const {api} = require('electron-util');
/// const config = require('./config');

const isNightlyBuild = api.app.getName() === 'HyperDEX Nightly';

/// TODO: Change this before the official launch
/// const isDevelopment = config.get('isDebugMode') || is.development || isNightlyBuild;
const isDevelopment = true;

module.exports = {
	isNightlyBuild,
	isDevelopment,
};
