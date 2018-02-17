import PQueue from 'p-queue';
import electrumServers from './electrum-servers';

export default class Api {
	constructor({endpoint, seedPhrase, concurrency = 1}) {
		if (!(endpoint && seedPhrase)) {
			throw new Error('The `endpoint` and `seedPhrase` options are required');
		}

		this.endpoint = endpoint;
		this.seedPhrase = seedPhrase;

		this.queue = new PQueue({concurrency});
		this.token = this._token();
	}

	async _request(data) {
		const response = await this.queue.add(() => fetch(this.endpoint, {
			method: 'post',
			body: JSON.stringify(data),
		}));

		return response.json();
	}

	async _token() {
		const {userpass: defaultToken} = await this._request({method: 'passphrase'});
		const {userpass: token} = await this._request({
			method: 'passphrase',
			passphrase: this.seedPhrase,
			userpass: defaultToken,
		});

		return token;
	}

	async request(data) {
		return this._request({
			...data,
			...{userpass: await this.token},
		});
	}

	async debug(data) {
		console.log(await this.request(data));
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
