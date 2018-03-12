'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		windowState: {
			width: 760,
			height: 500,
		},
		darkMode: true,
	},
});
