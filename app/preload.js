'use strict';
const {remote} = require('electron');

process.once('loaded', () => {
	global.global = global;
	global.require = require;
	global.process = process;
	global.Buffer = Buffer;
});

const {require: r} = remote;

global.mainModules = {
	getPort: r('get-port'),
	config: r('./config'),
	portfolioUtil: r('./portfolio-util'),
	i18n: r('./locale').i18n,
	util: r('./util'),
};
