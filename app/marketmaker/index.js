'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');
const electron = require('electron');
const util = require('electron-util');
const getPort = require('get-port');
const logger = require('electron-timber');

let binPath = path.join(__dirname, 'bin', process.platform, `marketmaker${util.is.windows ? '.exe' : ''}`);
binPath = util.fixPathForAsarUnpack(binPath);

const mmLogger = logger.create({
	name: 'mm',
	ignore: /cant open\.\(|connected to push\.\(/,
});

class Marketmaker {
	_getCoins() {
		// `coins.json` from:
		// https://github.com/jl777/SuperNET/blob/c5227cd60248dd9b36274152161b13cc5cf9c0ea/iguana/exchanges/coins.json
		const json = fs.readFileSync(path.join(__dirname, 'coins.json'), 'utf8').replace(/\\/g, '');
		const coins = JSON.parse(json);

		for (const coin of coins) {
			delete coin.confpath;
		}

		return coins;
	}

	_isReady() {
		return new Promise((resolve, reject) => {
			const interval = setInterval(() => {
				const request = electron.net.request(`http://127.0.0.1:${this.port}`);

				request.on('response', response => {
					if (response.statusCode === 200) {
						clearInterval(interval);

						// Give it a little more time to avoid issues
						setTimeout(resolve, 500);
					}
				});
				request.on('error', () => {});
				request.end();
			}, 100);

			setTimeout(() => {
				clearInterval(interval);
				reject(new Error('Giving up trying to connect to marketmaker'));
			}, 10000);
		});
	}

	async start(options) {
		options = Object.assign({}, options, {
			client: 1,
			gui: 'hyperdex',
			userhome: os.homedir(),
			rpcport: await getPort(),
			coins: this._getCoins(),
		});

		this.port = options.rpcport;

		logger.log('Marketmaker running on port', this.port);

		if (options.seedPhrase) {
			options.passphrase = options.seedPhrase;
			delete options.seedPhrase;
		} else {
			throw new Error('The `seedPhrase` option is required');
		}

		this.cp = childProcess.spawn(binPath, [JSON.stringify(options)], {
			cwd: path.dirname(binPath),
		});

		this.isRunning = true;

		mmLogger.streamLog(this.cp.stdout);
		mmLogger.streamError(this.cp.stderr);

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
