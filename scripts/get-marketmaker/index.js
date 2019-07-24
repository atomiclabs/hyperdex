'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const got = require('got');
const hasha = require('hasha');
const pkgConf = require('pkg-conf');
const decompress = require('decompress');

/**
The hash used in `marketmaker.hashes` is SHA512.
*/

const baseUrl = 'http://195.201.0.6/mm2/';

const cacheDirectory = path.join(os.homedir(), '.marketmaker');

const osNames = [
	'Darwin',
	'Linux',
	'Windows_NT',
];

const osNameMap = new Map([
	['Darwin', 'macos'],
	['Linux', 'linux'],
	['Windows_NT', 'windows'],
]);

const osNameToDirectory = new Map([
	['Darwin', 'mac'],
	['Linux', 'linux'],
	['Windows_NT', 'win'],
]);

const checkHash = (/* filename, hash, expectedHash */) => {
	/// Disabled until https://github.com/KomodoPlatform/atomicDEX-API/issues/496 is fixed
	// if (hash !== expectedHash) {
	// 	throw new Error(`The ${filename} hash ${hash} doesn't match the expected hash: ${expectedHash}`);
	// }
};

const unzip = async (osName, cachedBuildPath) => {
	const rootDirectory = path.resolve(__dirname, '../..');
	const destinationDirectory = path.join(rootDirectory, 'app', 'marketmaker', 'bin', osNameToDirectory.get(osName));

	await decompress(cachedBuildPath, destinationDirectory);

	// Rename the binary from `mm2` to `marketmaker`
	const fromFilename = osName === 'Windows_NT' ? 'mm2.exe' : 'mm2';
	const toFilename = osName === 'Windows_NT' ? 'marketmaker.exe' : 'marketmaker';
	fs.renameSync(path.join(destinationDirectory, fromFilename), path.join(destinationDirectory, toFilename));
};

const main = async () => {
	const {version, hashes} = pkgConf.sync('marketmaker');

	console.log('Fetching marketmaker binaries…');

	await Promise.all(osNames.map(async osName => {
		const expectedHash = hashes[osNameMap.get(osName)];
		const filename = `mm2-${version}-${osName}.zip`;
		const cachedBuildPath = path.join(cacheDirectory, filename);

		if (fs.existsSync(cachedBuildPath)) {
			checkHash(filename, await hasha.fromFile(cachedBuildPath), expectedHash);
			console.log(`Using cached build: ${cachedBuildPath}`);
			await unzip(osName, cachedBuildPath);
			return;
		}

		const downloadUrl = `${baseUrl}${filename}`;
		console.log(`Downloading: ${downloadUrl}`);
		const {body} = await got(downloadUrl, {encoding: 'buffer'});

		checkHash(filename, hasha(body), expectedHash);
		try {
			fs.mkdirSync(cacheDirectory);
		} catch (_) {}

		fs.writeFileSync(cachedBuildPath, body);

		await unzip(osName, cachedBuildPath);
	}));
};

main().catch(error => {
	console.error(error);
	process.exit(1); // eslint-disable-line unicorn/no-process-exit
});
