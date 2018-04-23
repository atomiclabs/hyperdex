import util from 'util';
import electron from 'electron';
import {sha256} from 'crypto-hash';
import PQueue from 'p-queue';
import electrumServers from './electrum-servers';
import MarketmakerSocket from './marketmaker-socket';

const getPort = electron.remote.require('get-port');

export default class Api {
	constructor({endpoint, seedPhrase, concurrency = Infinity}) {
		if (!(endpoint && seedPhrase)) {
			throw new Error('The `endpoint` and `seedPhrase` options are required');
		}

		this.endpoint = endpoint;
		this.token = sha256(seedPhrase);
		this.socket = false;
		this.useQueue = false;
		this.currentQueueId = 0;

		this.queue = new PQueue({concurrency});
	}

	async _request(data) {
		const queueId = (this.useQueue && this.socket) ? ++this.currentQueueId : 0;

		const response = await this.queue.add(() => fetch(this.endpoint, {
			method: 'post',
			body: JSON.stringify({
				...{queueid: queueId},
				...data},
			),
		}));

		return (this.useQueue && this.socket) ? this.socket.getResponse(queueId) : response.json();
	}

	async enableSocket() {
		const port = await getPort();
		const {endpoint} = await this.request({method: 'getendpoint', port});
		const socket = new MarketmakerSocket(endpoint);
		await socket.connected;
		this.socket = socket;

		return this.socket;
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

	orderBook(base, rel) {
		return this.request({
			method: 'orderbook',
			base,
			rel,
		});
	}

	order(opts) {
		return this.request({
			method: opts.type,
			base: opts.baseCurrency,
			rel: opts.quoteCurrency,
			basevolume: opts.amount,
			relvolume: opts.total,
			price: opts.price,
		});
	}

	getFee(coin) {
		return this.request({
			method: 'getfee',
			coin,
		});
	}

	async withdraw(opts) {
		if (typeof opts.currency !== 'string') {
			throw new TypeError(`opts.currency must be a string: ${opts.currency}`);
		}

		// TODO: Also validate address based on opts.currency
		if (typeof opts.address !== 'string') {
			throw new TypeError(`opts.address must be a string: ${opts.address}`);
		}

		if (!Number.isFinite(opts.amount) || opts.amount <= 0) {
			throw new TypeError(`opts.amount must be a positive number: ${opts.amount}`);
		}

		const result = await this.request({
			method: 'withdraw',
			coin: opts.currency,
			outputs: [{[opts.address]: opts.amount}],
			broadcast: 1,
		});

		if (!result.complete) {
			throw new Error(`Couldn't complete withdrawal:\n${util.format(result)}`);
		}

		return result;
	}

	listUnspent(coin, address) {
		return this.request({
			method: 'listunspent',
			coin,
			address,
		});
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

	subscribeToSwap(swap) {
		if (!this.socket) {
			throw new Error('Swap subscriptions require the socket to be enabled');
		}

		return this.socket.subscribeToSwap(swap);
	}
}
