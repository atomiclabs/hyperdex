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

exports.reportError = errorStack => {
	exports.openGitHubIssue(`\`\`\`\n${errorStack}\n\`\`\`\n\n<!-- Please succinctly describe your issue and steps to reproduce it -->`);
};
