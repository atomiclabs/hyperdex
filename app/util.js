/* eslint-disable import/prefer-default-export */
'use strict';
const os = require('os');
const {app, shell} = require('electron');
const {repoUrl} = require('./constants');

exports.openGitHubIssue = message => {
	const body = `
${message}




---

${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${os.release()}
Locale: ${app.getLocale()}`;

	shell.openExternal(`${repoUrl}/issues/new?body=${encodeURIComponent(body)}`);
};
