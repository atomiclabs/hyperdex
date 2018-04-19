'use strict';
const path = require('path');
const {app} = require('electron');
const iocane = require('iocane');
const slugify = require('@sindresorhus/slugify');
const randomString = require('crypto-random-string');
const writeJsonFile = require('write-json-file');
const dir = require('node-dir');
const loadJsonFile = require('load-json-file');

const {encryptWithPassword: encrypt, decryptWithPassword: decrypt} = iocane.crypto;
const portfolioPath = path.join(app.getPath('userData'), 'portfolios');

const idToFileName = id => `hyperdex-portfolio-${id}.json`;
const fileNameToId = fileName => fileName.replace(/^hyperdex-portfolio-/, '').replace(/\.json$/, '');

const createPortfolio = async ({name, seedPhrase, password}) => {
	const safeName = slugify(name).slice(0, 40);
	const id = `${safeName}-${randomString(6)}`;
	const filePath = path.join(portfolioPath, idToFileName(id));

	const portfolio = {
		name,
		encryptedSeedPhrase: await encrypt(seedPhrase, password),
		appVersion: app.getVersion(),
	};

	await writeJsonFile(filePath, portfolio);

	return id;
};

const changePortfolioPassword = async ({id, seedPhrase, newPassword}) => {
	const filePath = path.join(portfolioPath, idToFileName(id));
	const portfolio = await loadJsonFile(filePath);
	portfolio.encryptedSeedPhrase = await encrypt(seedPhrase, newPassword);
	await writeJsonFile(filePath, portfolio);
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
		portfolio.id = fileNameToId(portfolio.fileName);

		return portfolio;
	}));

	return portfolios.sort((a, b) => a.fileName.localeCompare(b.fileName));
};

module.exports = {
	createPortfolio,
	changePortfolioPassword,
	getPortfolios,
	decryptSeedPhrase: decrypt,
};
