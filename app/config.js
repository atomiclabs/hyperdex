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
		'BTC',
		'KMD',
		'CHIPS',
		'SUPERNET',
		'REVS',
		'OOT',
		'LTC',
		'VTC',
		'DOGE',
	],
};

if (isNightlyBuild) {
	defaults.enabledCoins.push('PIZZA', 'BEER');
}

module.exports = new Store({defaults});
