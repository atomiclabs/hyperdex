'use strict';
const {api, is} = require('electron-util');

const isNightlyBuild = api.app.getName() === 'HyperDEX Nightly';
const isDevelopment = is.development || isNightlyBuild;

module.exports = {
	isNightlyBuild,
	isDevelopment,
};
