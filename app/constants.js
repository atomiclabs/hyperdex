'use strict';
const {is} = require('electron-util');

// TODO: Put website URL here
exports.websiteUrl = 'https://github.com/lukechilds/hyperdex';

exports.repoUrl = 'https://github.com/lukechilds/hyperdex';

exports.minWindowSize = {
	width: 1060,
	height: is.windows ? 650 : 600,
};

exports.loginWindowSize = {
	width: 680,
	height: is.windows ? 550 : 500,
};

exports.appViews = [
	'Dashboard',
	'Swap',
	'Exchange',
	'Trades',
	'Settings',
];

exports.alwaysEnabledCurrencies = [
	'KMD',
	'CHIPS',
];

exports.ignoreExternalPrice = new Set([
	'REVS',
	'SUPERNET',
	'PIZZA',
	'BEER',
	'EQL',
]);

exports.hiddenCurrencies = [
	'ETOMIC',
];

exports.appTimeStarted = Date.now();
