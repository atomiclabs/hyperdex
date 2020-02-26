'use strict';
const path = require('path');
const {app} = require('electron');
const slugify = require('@sindresorhus/slugify');
const randomString = require('crypto-random-string');
const dir = require('node-dir');
const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');
const del = require('del');
const {encrypt, decrypt} = require('./encryption');
const {translate} = require('./locale');
const config = require('./config');
const {defaultEnabledCurrencies} = require('./constants');

const t = translate('login');
const portfoliosDirectoryPath = path.join(app.getPath('userData'), 'portfolios');
const idToFileName = id => `hyperdex-portfolio-${id}.json`;
const fileNameToId = fileName => fileName.replace(/^hyperdex-portfolio-/, '').replace(/\.json$/, '');
const idToFilePath = id => path.join(portfoliosDirectoryPath, idToFileName(id));
const generateId = name => `${slugify(name).slice(0, 40)}-${randomString({length: 6})}`;

class IncorrectPasswordError extends Error {
	constructor() {
		super(t('incorrectPassword'));
		Error.captureStackTrace(this, IncorrectPasswordError);
	}
}

// Currencies that are removed from the app and should be removed from the user's portfolio
const removedCurrencies = [
	'DNR',
	'BCBC',
	'QMC',
	'MNZ',
	'GBX',
	'XMCC',
	'POLIS',
	'PGT',
	'CC',
	'THETA',
	'MAN',
	'CMT',
	'NULS',
	'ICX',
	'AION',
	'VEN',
	'EOS',
	'BTCZ',
	'ZCL',
	'BTCP',
	'BTX',
	'CRW',
	'EQLI',
	'GLXT',
	'RAP',
	'STAK',
	'VIA',
	'XSG',
	'BEER',
	'PIZZA',
	'BLK',
	'FAIR',
	'SIB',
	"HODLC",
];

const createPortfolio = async ({name, seedPhrase, password}) => {
	const id = generateId(name);
	const filePath = idToFilePath(id);

	const portfolio = {
		name,
		encryptedSeedPhrase: await encrypt(seedPhrase, password),
		appVersion: app.getVersion(),
		currencies: defaultEnabledCurrencies,
	};

	await writeJsonFile(filePath, portfolio);

	return id;
};

const deletePortfolio = async id => {
	const filePath = idToFilePath(id);
	await del(filePath, {force: true});
};

const modifyPortfolio = async (id, modifyCallback) => {
	const filePath = idToFilePath(id);
	const portfolio = await loadJsonFile(filePath);
	await modifyCallback(portfolio);
	await writeJsonFile(filePath, portfolio);
};

const renamePortfolio = async ({id, newName}) => {
	await modifyPortfolio(id, portfolio => {
		portfolio.name = newName;
	});
};

const changePortfolioPassword = async ({id, seedPhrase, newPassword}) => {
	await modifyPortfolio(id, async portfolio => {
		portfolio.encryptedSeedPhrase = await encrypt(seedPhrase, newPassword);
	});
};

const _enabledCoins = config.get('enabledCoins');
config.delete('enabledCoins');
const migrateEnabledCurrencies = async id => {
	await modifyPortfolio(id, portfolio => {
		if (portfolio.currencies) {
			return;
		}

		if (!Array.isArray(_enabledCoins)) {
			portfolio.currencies = [];
			return;
		}

		portfolio.currencies = _enabledCoins;
	});
};

const removeCurrenciesMigration = async id => {
	await modifyPortfolio(id, portfolio => {
		portfolio.currencies = portfolio.currencies.filter(currency => !removedCurrencies.includes(currency));
	});
};

const getPortfolios = async () => {
	let portfolioFiles;
	try {
		portfolioFiles = await dir.promiseFiles(portfoliosDirectoryPath);
	} catch (error) {
		if (error.code === 'ENOENT') {
			return [];
		}

		throw error;
	}

	portfolioFiles = portfolioFiles.filter(file => file.endsWith('.json'));

	const portfolios = await Promise.all(portfolioFiles.map(async filePath => {
		const portfolio = await loadJsonFile(filePath);
		portfolio.fileName = path.basename(filePath);
		portfolio.id = fileNameToId(portfolio.fileName);

		// TODO: Remove this sometime far in the future when everyone has migrated
		await migrateEnabledCurrencies(portfolio.id);

		await removeCurrenciesMigration(portfolio.id);

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

const setCurrencies = async (id, currencies) => {
	await modifyPortfolio(id, portfolio => {
		portfolio.currencies = currencies;
	});
};

module.exports = {
	createPortfolio,
	deletePortfolio,
	renamePortfolio,
	changePortfolioPassword,
	getPortfolios,
	decryptSeedPhrase,
	setCurrencies,
	portfoliosDirectoryPath,
	getPortfolioFilePath: idToFilePath,
};
