'use strict';
const Store = require('electron-store');
const {minWindowSize} = require('./constants');
const {isNightlyBuild} = require('./util-common');

const defaults = {
	windowState: {
		width: minWindowSize.width,
		height: minWindowSize.height,
	},
	darkMode: true,
	enabledCoins: [
		'BCH',
		'BEER',
		'BTC',
		'CHIPS',
		'DASH',
		'DNR',
		'DOGE',
		'HUSH',
		'KMD',
		'LTC',
		'MSHARK',
		'PIZZA',
		'REVS',
		'SUPERNET',
		'VTC',
		'ZEC',
		'OOT',
	],
};

if (isNightlyBuild) {
	defaults.enabledCoins.push('PIZZA', 'BEER');
}

module.exports = new Store({defaults});
