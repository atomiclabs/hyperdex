export default class Api {
	constructor({endpoint, passphrase}) {
		if (!(endpoint && passphrase)) {
			throw new Error('The `endpoint` and `passphrase` options are required');
		}

		this.endpoint = endpoint;
		this.passphrase = passphrase;
	}

	async _request(data) {
		const response = await fetch(this.endpoint, {
			method: 'post',
			body: JSON.stringify(data)
		});

		return response.json();
	}

	async _userpass() {
		const {userpass} = await this._request({
			method: 'passphrase',
			passphrase: this.passphrase
		});

		return userpass;
	}

	async request(data) {
		if (!this.userpass) {
			this.userpass = await this._userpass();
		}

		return this._request(Object.assign({}, data, {userpass: this.userpass}));
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
