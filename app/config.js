'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		windowState: {
			width: 900,
			height: 600,
		},
		darkMode: true,
	},
});
