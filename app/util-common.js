'use strict';
const {api} = require('electron-util');

const isNightlyBuild = api.app.getName() === 'HyperDEX Nightly';

/// TODO: Change this before the official launch
/// const isDevelopment = process.argv.slice(1).includes('--debug') || is.development || isNightlyBuild;
const isDevelopment = true;

module.exports = {
	isNightlyBuild,
	isDevelopment,
};
