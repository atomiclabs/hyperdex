'use strict';
const Store = require('electron-store');

module.exports = new Store({
	defaults: {
		windowState: {
			width: 800,
			height: 600
		},
		darkMode: false
	}
});
