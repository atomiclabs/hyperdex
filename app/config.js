'use strict';
const {is} = require('electron-util');
const Store = require('electron-store');
const {minWindowSize} = require('./constants');

const defaults = {
	windowState: {
		width: minWindowSize.width,
		height: minWindowSize.height,
	},
	theme: is.macos ? 'system' : 'dark',
	swapModalShowAdvanced: false,
};

const store = new Store({defaults});
module.exports = store;
