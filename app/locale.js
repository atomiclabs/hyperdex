'use strict';
const path = require('path');
const i18next = require('i18next');
const i18nextBackend = require('i18next-sync-fs-backend');
const {isDevelopment} = require('./util-common');

i18next
	.use(i18nextBackend)
	.init({
		debug: isDevelopment,
		lng: 'en',
		whitelist: ['en'],
		ns: ['login', 'menu'],
		initImmediate: false,
		backend: {
			loadPath: path.join(__dirname, 'locales', '{{lng}}', '{{ns}}.json'),
			jsonIndent: 4,
		},
	});

exports.i18n = i18next;
exports.translate = namespaces => namespaces ? i18next.getFixedT(null, namespaces) : i18next.t.bind(i18next);
