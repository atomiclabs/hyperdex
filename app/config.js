'use strict';
const {api, is} = require('electron-util');
const Store = require('electron-store');
const {minWindowSize} = require('./constants');

// Note: This is hardcoded here instead of being imported
// from `util-common` to prevent cyclic dependencies
const isNightlyBuild = api.app.getName() === 'HyperDEX Nightly';

const defaults = {
	windowState: {
		width: minWindowSize.width,
		height: minWindowSize.height,
	},
	theme: is.macos ? 'system' : 'dark',
	enabledCoins: [
		'BCH',
		'BEER',
		'BTC',
		'CHIPS',
		'DASH',
		'DNR',
		'DOGE',
		'EQL',
		'HUSH',
		'KMD',
		'LTC',
		'MSHARK',
		'MYTH',
		'OOT',
		'PIZZA',
		'REVS',
		'SUPERNET',
		'VTC',
		'ZEC',
	],
};

if (isNightlyBuild) {
	defaults.enabledCoins.push('PIZZA', 'BEER');
}

module.exports = new Store({defaults});
