'use strict';
const got = require('got');

module.exports = class {
	constructor({endpoint, passphrase}) {
		this.endpoint = endpoint;
		this.passphrase = passphrase;
	}

	async _request(data) {
		const {body} = await got.post(this.endpoint, {
			json: true,
			body: data
		});

		return body;
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
};
