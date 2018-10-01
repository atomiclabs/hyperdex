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
	swapModalShowAdvanced: false,
	enabledCoins: [
		'BCH',
		'BEER',
		'BTC',
		'CHIPS',
		'DASH',
		'DNR',
		'DOGE',
		'EQLI',
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

const renameEqlToEqli = store => {
	let enabledCoins = store.get('enabledCoins');
	if (enabledCoins.includes('EQL')) {
		enabledCoins = enabledCoins.filter(x => x !== 'EQL' && x !== 'EQLI');
		enabledCoins.push('EQLI');
		store.set('enabledCoins', enabledCoins);
	}
};

const migrate = store => {
	renameEqlToEqli(store);
};

const store = new Store({defaults});
migrate(store);
module.exports = store;
