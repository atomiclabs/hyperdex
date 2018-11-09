'use strict';
const {debugInfo, openNewGitHubIssue} = require('electron-util');
const {repoUrl} = require('./constants');

exports.openGitHubIssue = message => {
	const body = `
${message}




---

${debugInfo()}`;

	openNewGitHubIssue({repoUrl, body});
};
