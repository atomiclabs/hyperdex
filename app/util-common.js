'use strict';
const {api, is} = require('electron-util');

exports.isNightlyBuild = is.development || api.app.getName() === 'HyperDEX Nightly';
