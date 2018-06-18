'use strict';
const path = require('path');
const {app} = require('electron');
const i18next = require('i18next');
const i18nextBackend = require('i18next-sync-fs-backend');
const {isDevelopment} = require('./util-common');

i18next
	.use(i18nextBackend)
	.init({
		debug: isDevelopment,
		fallbackLng: 'en',
		whitelist: ['en'],
		nonExplicitWhitelist: true,
		ns: ['login', 'menu'],
		initImmediate: false,
		backend: {
			loadPath: path.join(__dirname, 'locales', '{{lng}}', '{{ns}}.json'),
			jsonIndent: 4,
		},
	});

app.on('ready', () => {
	i18next.changeLanguage(app.getLocale());
});

exports.i18n = i18next;
exports.translate = namespaces => namespaces ? i18next.getFixedT(null, namespaces) : i18next.t.bind(i18next);
