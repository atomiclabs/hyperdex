'use strict';
const Store = require('electron-store');
const {minWindowSize} = require('./constants');

module.exports = new Store({
	defaults: {
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
	},
});
