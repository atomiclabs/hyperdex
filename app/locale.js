'use strict';
const path = require('path');
const {app} = require('electron');
const {appReady} = require('electron-util');
const ipc = require('electron-better-ipc');
const i18next = require('i18next');
const i18nextBackend = require('i18next-sync-fs-backend');
const {isDevelopment} = require('./util-common');
const config = require('./config');

i18next
	.use(i18nextBackend)
	.init({
		debug: isDevelopment,
		fallbackLng: 'en-US',
		ns: [
			'app',
			'chart',
			'common',
			'dashboard',
			'exchange',
			'forgot-password',
			'login',
			'menu',
			'nav',
			'portfolio',
			'settings',
			'swap',
			'trades',
		],
		initImmediate: false,
		backend: {
			loadPath: path.join(__dirname, 'locales', '{{lng}}', '{{ns}}.json'),
			jsonIndent: 4,
		},
	});

(async () => {
	if (isDevelopment && config.has('debug_forcedLanguage')) {
		i18next.changeLanguage(config.get('debug_forcedLanguage'));
		return;
	}

	await appReady;
	i18next.changeLanguage(app.getLocale());
})();

ipc.answerRenderer('get-translations', async () => {
	await appReady;
	return i18next;
});

exports.i18n = i18next;
exports.translate = namespaces => namespaces ? i18next.getFixedT(null, namespaces) : i18next.t.bind(i18next);
