'use strict';
const {is} = require('electron-util');
const Store = require('electron-store');
const {minWindowSize} = require('./constants');
const {isNightlyBuild} = require('./util-common');

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
