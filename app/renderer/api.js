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

	enableCoin(coin) {
		return this.request({method: 'enable', coin});
	}

	portfolio() {
		return this.request({method: 'portfolio'});
	}

	coins() {
		return this.request({method: 'getcoins'});
	}

	ticker() {
		return this.request({method: 'ticker'});
	}
}
