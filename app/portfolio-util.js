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

const createPortfolio = async ({name, seedPhrase, password}) => {
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

const getPortfolios = async () => {
	let portfolioFiles;
	try {
		portfolioFiles = await dir.promiseFiles(portfolioPath);
	} catch (err) {
		if (err.code === 'ENOENT') {
			return [];
		}

		throw err;
	}

	portfolioFiles = portfolioFiles.filter(x => x.endsWith('.json'));

	const portfolios = await Promise.all(portfolioFiles.map(async filePath => {
		const portfolio = await loadJsonFile(filePath);
		portfolio.fileName = path.basename(filePath);

		return portfolio;
	}));

	return portfolios.sort((a, b) => a.fileName.localeCompare(b.fileName));
};

module.exports = {
	createPortfolio,
	getPortfolios,
	decryptSeedPhrase: decrypt,
};
