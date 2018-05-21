'use strict';
const {api} = require('electron-util');

const isNightlyBuild = api.app.getName() === 'HyperDEX Nightly';

/// TODO: Change this before the official launch
/// const isDevelopment = is.development || isNightlyBuild;
const isDevelopment = true;

module.exports = {
	isNightlyBuild,
	isDevelopment,
};
