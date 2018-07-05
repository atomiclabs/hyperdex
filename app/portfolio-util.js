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

const portfolioPath = path.join(app.getPath('userData'), 'portfolios');

const idToFileName = id => `hyperdex-portfolio-${id}.json`;
const fileNameToId = fileName => fileName.replace(/^hyperdex-portfolio-/, '').replace(/\.json$/, '');
const generateId = name => `${slugify(name).slice(0, 40)}-${randomString(6)}`;

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
	const newId = generateId(newName);
	const newFilePath = path.join(portfolioPath, idToFileName(newId));
	portfolio.name = newName;
	await writeJsonFile(newFilePath, portfolio);
	await deletePortfolio(id);
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
	deletePortfolio,
	renamePortfolio,
	changePortfolioPassword,
	getPortfolios,
	decryptSeedPhrase: decrypt,
};
