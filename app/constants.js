'use strict';
const {is} = require('electron-util');

// TODO: Put website URL here
exports.websiteUrl = 'https://github.com/hyperdexapp/hyperdex';

exports.repoUrl = 'https://github.com/hyperdexapp/hyperdex';

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

exports.supportedLanguagesWithNames = new Map([
	['ar', 'Arabic'],
	['bn', 'Bengali'],
	['de', 'German'],
	['en-US', 'English'],
	['es-ES', 'Spanish'],
	['fa', 'Persian'],
	['fr', 'French'],
	['hi', 'Hindi'],
	['id', 'Indonesian'],
	['it', 'Italian'],
	['ja', 'Japanese'],
	['ko', 'Korean'],
	['nb', 'Norwegian Bokmål'],
	['pl', 'Polish'],
	['ru', 'Russian'],
	['sv-SE', 'Swedish'],
	['sw', 'Swahili'],
	['th', 'Thai'],
	['tr', 'Turkish'],
	['ur-PK', 'Urdu (Pakistan)'],
	['vi', 'Vietnamese'],
	['zh-CN', 'Simplified Chinese'],
	['zh-TW', 'Traditional Chinese'],
]);

exports.supportedLanguages = [...exports.supportedLanguagesWithNames.keys()];
