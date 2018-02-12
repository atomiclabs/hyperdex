'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		windowState: {
			width: 620,
			height: 440,
		},
		darkMode: true,
	},
});
