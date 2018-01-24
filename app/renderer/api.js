import electrumServers from './electrum-servers';

export default class Api {
	constructor({endpoint, seedPhrase}) {
		if (!(endpoint && seedPhrase)) {
			throw new Error('The `endpoint` and `seedPhrase` options are required');
		}

		this.endpoint = endpoint;
		this.seedPhrase = seedPhrase;
	}

	async _request(data) {
		const response = await fetch(this.endpoint, {
			method: 'post',
			body: JSON.stringify(data),
		});

		return response.json();
	}

	async _token() {
		const {userpass: token} = await this._request({
			method: 'passphrase',
			passphrase: this.seedPhrase,
		});

		return token;
	}

	async request(data) {
		if (!this.token) {
			this.token = await this._token();
		}

		return this._request({
			...data,
			...{userpass: this.token},
		});
	}

	botList() {
		return this.request({method: 'bot_list'});
	}

	async enableCoin(coin, opts = {}) {
		if (opts.isFullNode) {
			const res = await this.request({method: 'enable', coin});
			return res.status === 'active';
		}

		const server = electrumServers[coin];

		if (!server) {
			throw new Error('Electrum mode not supported for this coin');
		}

		const res = await this.request({
			method: 'electrum',
			coin,
			...server,
		});
		return res.result === 'success';
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
