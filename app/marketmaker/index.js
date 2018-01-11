'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');
const electron = require('electron');
const util = require('electron-util');
const getPort = require('get-port');

let binPath = path.join(__dirname, 'bin', process.platform, `marketmaker${util.is.windows ? '.exe' : ''}`);
binPath = util.fixPathForAsarUnpack(binPath);

class Marketmaker {
	_getCoins() {
		// `coins.json` from below with the commented parts removed:
		// https://github.com/jl777/SuperNET/blob/f8418476d7bb96ac567c2cf3a03c74766b1a78b2/iguana/exchanges/coins.json
		const json = fs.readFileSync(path.join(__dirname, 'coins.json'), 'utf8')
			.replace(/\\/g, '')
			.replace(/\${HOME#}/g, os.homedir().replace(/"/g, '\\"'));

		return JSON.parse(json);
	}

	_isReady() {
		return new Promise((resolve, reject) => {
			const interval = setInterval(() => {
				const request = electron.net.request(`http://localhost:${this.port}`);

				request.on('response', response => {
					if (response.statusCode === 200) {
						clearInterval(interval);
						resolve();
					}
				});
				request.on('error', () => {});
				request.end();
			}, 100);

			setTimeout(() => {
				clearInterval(interval);
				reject(new Error('Giving up trying to connect to marketmaker'));
			}, 5000);
		});
	}

	async start(options) {
		options = Object.assign({}, options, {
			client: 1,
			gui: 'nogui',
			userHome: os.homedir(),
			rpcport: await getPort(),
			coins: this._getCoins()
		});

		this.port = options.rpcport;

		if (util.is.development) {
			console.log('Marketmaker running on port:', this.port);
		}

		if (options.seedPhrase) {
			options.passphrase = options.seedPhrase;
			delete options.seedPhrase;
		} else {
			throw new Error('The `seedPhrase` option is required');
		}

		this.cp = childProcess.spawn(binPath, [JSON.stringify(options)], {
			cwd: path.dirname(binPath)
		});

		this.isRunning = true;

		if (util.is.development) {
			// Turn these on manually if wanted. They're super noisy.
			// - this.cp.stdout.pipe(process.stdout);
			// - this.cp.stderr.pipe(process.stderr);
		}

		electron.app.on('quit', () => {
			if (this.isRunning) {
				this.cp.kill();
			}
		});

		// `marketmaker` takes ~500ms to get ready to accepts requests
		await this._isReady();
	}

	stop() {
		this.cp.kill();
		this.cp = null;
		this.isRunning = false;
	}
}

module.exports = new Marketmaker();
