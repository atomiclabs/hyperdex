'use strict';
const {is} = require('electron-util');

// TODO: Put website URL here
exports.websiteUrl = 'https://github.com/lukechilds/hyperdex-bugtracker';

exports.repoUrl = 'https://github.com/lukechilds/hyperdex-bugtracker';

exports.minWindowSize = {
	width: 1060,
	height: is.windows ? 650 : 600,
};

exports.loginWindowSize = {
	width: 660,
	height: is.windows ? 520 : 450,
};

exports.appViews = [
	'Dashboard',
	'Swap',
	'Exchange',
	'Trades',
	'Preferences',
];
