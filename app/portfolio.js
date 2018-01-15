'use strict';
const path = require('path');
const {app} = require('electron');
const iocane = require('iocane');
const slug = require('slug');
const filenamify = require('filenamify');
const randomString = require('crypto-random-string');
const writeJsonFile = require('write-json-file');
const dir = require('node-dir');
const loadJsonFile = require('load-json-file');

const {encryptWithPassword: encrypt, decryptWithPassword: decrypt} = iocane.crypto;
const portfolioPath = path.join(app.getPath('userData'), 'portfolios');

const create = async ({name, seedPhrase, password}) => {
	const safeName = filenamify(slug(name, {lower: true, symbols: false}));
	const filename = `hyperdex-portfolio-${safeName}-${randomString(6)}.json`;
	const filePath = path.join(portfolioPath, filename);
	const data = {
		name,
		encryptedSeedPhrase: await encrypt(seedPhrase, password),
		appVersion: app.getVersion(),
	};

	await writeJsonFile(filePath, data);

	return filePath;
};

const getAll = async () => {
	const portfolios = await dir.promiseFiles(portfolioPath);

	return Promise.all(portfolios.map(loadJsonFile));
};

const unlock = async (portfolio, password) => Object.assign(
	{seedPhrase: await decrypt(portfolio.encryptedSeedPhrase, password)},
	portfolio,
);

module.exports = {
	create,
	getAll,
	unlock,
};
