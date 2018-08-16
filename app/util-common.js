'use strict';
const {api, is} = require('electron-util');
const config = require('./config');

const isNightlyBuild = api.app.getName() === 'HyperDEX Nightly';

const isDevelopment = config.get('isDebugMode') || is.development || isNightlyBuild;

module.exports = {
	isNightlyBuild,
	isDevelopment,
};
