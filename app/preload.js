'use strict';
const {remote} = require('electron');

// Mock for electron-util
// TODO: Open electron issue. They need to let us expose variables before any modules are loaded
global.process = {
	versions: {
		chrome: ''
	}
};

process.once('loaded', () => {
	global.global = global;
	global.process = process;
});

const {require: r} = remote;

global.mainModules = {
	getPort: r('get-port'),
	/// TODO: I might be able to use the webpack externals thing here
	electronUtil: r('electron-util'),
	config: r('./config'),
	portfolioUtil: r('./portfolio-util'),
	i18n: r('./locale').i18n,
	util: r('./util'),
	/// TODO: Need to selectively expose `electron` sub-modules
	electron: require('electron'),
};
