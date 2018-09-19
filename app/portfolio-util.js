'use strict';
const path = require('path');
const {app} = require('electron');
const slugify = require('@sindresorhus/slugify');
const randomString = require('crypto-random-string');
const writeJsonFile = require('write-json-file');
const dir = require('node-dir');
const loadJsonFile = require('load-json-file');
const del = require('del');
const {encrypt, decrypt} = require('./encryption');
const {translate} = require('./locale');

const portfolioPath = path.join(app.getPath('userData'), 'portfolios');
const t = translate('login');

const idToFileName = id => `hyperdex-portfolio-${id}.json`;
const fileNameToId = fileName => fileName.replace(/^hyperdex-portfolio-/, '').replace(/\.json$/, '');
const generateId = name => `${slugify(name).slice(0, 40)}-${randomString(6)}`;

class IncorrectPasswordError extends Error {
	constructor() {
		super(t('incorrectPassword'));
		Error.captureStackTrace(this, IncorrectPasswordError);
	}
}

const createPortfolio = async ({name, seedPhrase, password}) => {
	const id = generateId(name);
	const filePath = path.join(portfolioPath, idToFileName(id));

	const portfolio = {
		name,
		encryptedSeedPhrase: await encrypt(seedPhrase, password),
		appVersion: app.getVersion(),
	};

	await writeJsonFile(filePath, portfolio);

	return id;
};

const deletePortfolio = async id => {
	const filePath = path.join(portfolioPath, idToFileName(id));
	await del(filePath, {force: true});
};

const renamePortfolio = async ({id, newName}) => {
	const filePath = path.join(portfolioPath, idToFileName(id));
	const portfolio = await loadJsonFile(filePath);

	portfolio.name = newName;

	await writeJsonFile(filePath, portfolio);
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
	} catch (error) {
		if (error.code === 'ENOENT') {
			return [];
		}

		throw error;
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

const decryptSeedPhrase = async (seedPhrase, password) => {
	try {
		return await decrypt(seedPhrase, password);
	} catch (error) {
		if (/Authentication failed/.test(error.message)) {
			throw new IncorrectPasswordError();
		}

		throw error;
	}
};

module.exports = {
	createPortfolio,
	deletePortfolio,
	renamePortfolio,
	changePortfolioPassword,
	getPortfolios,
	decryptSeedPhrase,
};
