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
			'KMD',
			'REVS',
			'SUPERNET',
			'CHIPS',
			'BTC',
			'VTC',
			'LTC',
		],
	},
});
