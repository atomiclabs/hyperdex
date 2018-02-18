import PQueue from 'p-queue';
import electrumServers from './electrum-servers';

export default class Api {
	constructor({endpoint, concurrency = 1}) {
		if (!endpoint) {
			throw new Error('The `endpoint` option is required');
		}

		this.endpoint = endpoint;
		this.token = '1d8b27b21efabcd96571cd56f91a40fb9aa4cc623d273c63bf9223dc6f8cd81f';

		this.queue = new PQueue({concurrency});
	}

	async _request(data) {
		const response = await this.queue.add(() => fetch(this.endpoint, {
			method: 'post',
			body: JSON.stringify(data),
		}));

		return response.json();
	}

	async request(data) {
		return this._request({
			...data,
			...{userpass: this.token},
		});
	}

	async debug(data) {
		console.log(await this.request(data));
	}

	async loadSeed(seedPhrase) {
		const {userpass: token} = await this.request({
			method: 'passphrase',
			passphrase: seedPhrase,
		});

		this.token = token;

		return token;
	}

	botList() {
		return this.request({method: 'bot_list'});
	}

	async enableCoin(coin, opts = {}) {
		if (opts.isFullNode) {
			const response = await this.enableCoinFullNode(coin);
			return response.status === 'active';
		}

		const responses = await this.enableCoinElectrum(coin);
		return responses.filter(response => response.result === 'success') > 0;
	}

	enableCoinFullNode(coin) {
		return this.request({method: 'enable', coin});
	}

	async enableCoinElectrum(coin) {
		const servers = electrumServers[coin];

		if (!servers) {
			throw new Error('Electrum mode not supported for this coin');
		}

		const requests = servers.map(server => this.request({
			method: 'electrum',
			coin,
			...server,
		}));

		return Promise.all(requests);
	}

	portfolio() {
		return this.request({method: 'portfolio'});
	}

	balance(coin, address) {
		return this.request({
			method: 'balance',
			coin,
			address,
		});
	}

	coins() {
		return this.request({method: 'getcoins'});
	}

	async funds() {
		const coins = (await this.coins()).filter(coin => coin.status === 'active');
		return Promise.all(coins.map(coin => this.balance(coin.coin, coin.smartaddress)));
	}

	ticker() {
		return this.request({method: 'ticker'});
	}

	async stop() {
		try {
			await this.request({method: 'stop'});
		} catch (err) {} // Ignoring the error as `marketmaker` doesn't return a response
	}
}
