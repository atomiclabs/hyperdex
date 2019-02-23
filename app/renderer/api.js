/* eslint-disable camelcase */
import util from 'util';
import electron from 'electron';
import {sha256} from 'crypto-hash';
import PQueue from 'p-queue';
import ow from 'ow';
import _ from 'lodash';
import {getCurrency} from '../marketmaker/supported-currencies';
import {isDevelopment} from '../util-common';
import MarketmakerSocket from './marketmaker-socket';

const getPort = electron.remote.require('get-port');

const symbolPredicate = ow.string.uppercase;
const uuidPredicate = ow.string.alphanumeric.lowercase;

const errorWithObject = (message, object) => new Error(`${message}:\n${util.format(object)}`);
const genericError = object => errorWithObject('Encountered an error', object);

export default class Api {
	constructor({endpoint, seedPhrase, concurrency = 1}) {
		ow(endpoint, 'endpoint', ow.string);
		ow(seedPhrase, 'seedPhrase', ow.string);
		ow(concurrency, 'concurrency', ow.number.positive.integerOrInfinite);

		this.endpoint = endpoint;
		this.token = sha256(seedPhrase);
		this.socket = false;
		this.useQueue = false;
		this.currentQueueId = 0;

		this.queue = new PQueue({concurrency});
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
		ow(data, 'data', ow.object);

		const queueId = (this.useQueue && this.socket) ? ++this.currentQueueId : 0;

		const body = {
			...data,
			needjson: 1,
			queueid: queueId,
			userpass: await this.token,
		};

		let result;
		try {
			let requestTime;

			const response = await this.queue.add(() => {
				requestTime = Date.now();

				return fetch(this.endpoint, {
					method: 'post',
					body: JSON.stringify(body),
				});
			});

			result = await ((this.useQueue && this.socket) ? this.socket.getResponse(queueId) : response.json());

			if (isDevelopment) {
				// TODO: Use `Intl.RelativeTimeFormat` here when we use an Electron version with Chrome 71
				const requestDuration = (Date.now() - requestTime) / 1000;
				const groupLabel = `API method: ${body.method} (${requestDuration}s)`;
				console.groupCollapsed(groupLabel);
				console.log('Request:', _.omit(body, ['needjson', 'userpass', this.useQueue ? null : 'queueid']));
				console.log('Response:', response.status, result);
				console.groupEnd(groupLabel);
			}
		} catch (error) {
			if (error.message === 'Failed to fetch') {
				error.message = 'Could not connect to Marketmaker';
			}

			throw error;
		}

		return result;
	}

	async debug(data) {
		const result = await this.request(data);
		console.log(result);
		return result;
	}

	botList() {
		return this.request({method: 'bot_list'});
	}

	async enableCurrency(symbol) {
		ow(symbol, 'symbol', symbolPredicate);

		const currency = getCurrency(symbol);

		if (!currency) {
			console.error('Tried to enable unsupported currency:', symbol);
			return;
		}

		if (currency.electrumServers) {
			const requests = currency.electrumServers.map(server => this.request({
				method: 'electrum',
				coin: symbol,
				ipaddr: server.host,
				port: server.port,
			}));

			const responses = await Promise.all(requests);
			const success = responses.filter(response => response.result === 'success').length > 0;

			if (!success) {
				const error = `Could not connect to ${symbol} Electrum server`;
				console.error(error);
				// eslint-disable-next-line no-new
				new Notification(error);
			}

			console.log('Enabled Electrum for currency:', symbol);

			return success;
		}

		const response = await this.request({method: 'enable', coin: symbol});
		return response.status === 'active';
	}

	disableCoin(coin) {
		ow(coin, 'coin', symbolPredicate);

		return this.request({
			method: 'disable',
			coin,
		});
	}

	portfolio() {
		return this.request({method: 'portfolio'});
	}

	balance(coin, address) {
		ow(coin, 'coin', symbolPredicate);
		ow(address, 'address', ow.string);

		return this.request({
			method: 'balance',
			coin,
			address,
		});
	}

	coins() {
		return this.request({method: 'getcoins'});
	}

	async orderBook(base, rel) {
		ow(base, 'base', symbolPredicate);
		ow(rel, 'rel', symbolPredicate);

		const response = await this.request({
			method: 'orderbook',
			base,
			rel,
		});

		const formatOrders = orders => orders
			.filter(order => order.numutxos > 0)
			.map(order => ({
				address: order.address,
				depth: order.depth,
				price: order.price,
				utxoCount: order.numutxos,
				averageVolume: order.avevolume,
				maxVolume: order.maxvolume,
				zCredits: order.zcredits,
			}));

		const formattedResponse = {
			baseCurrency: response.base,
			quoteCurrency: response.rel,
			asks: formatOrders(response.asks),
			bids: formatOrders(response.bids),
		};

		return formattedResponse;
	}

	order(opts) {
		ow(opts, 'opts', ow.object.exactShape({
			type: ow.string.oneOf(['buy', 'sell']),
			baseCurrency: symbolPredicate,
			quoteCurrency: symbolPredicate,
			amount: ow.number.finite,
			total: ow.number.finite,
			price: ow.number.finite,
		}));

		return this.request({
			method: opts.type,
			gtc: 1,
			base: opts.baseCurrency,
			rel: opts.quoteCurrency,
			basevolume: opts.amount,
			relvolume: opts.total,
			price: opts.price,
		});
	}

	async cancelOrder(uuid) {
		ow(uuid, 'uuid', uuidPredicate);

		const response = await this.request({
			method: 'cancel',
			uuid,
		});

		if (response.error) {
			if (/uuid not cancellable/.test(response.error)) {
				throw new Error('Order cannot be cancelled');
			}

			throw new Error(response.error);
		}

		if (response.result !== 'success') {
			throw genericError(response);
		}

		return response.status;
	}

	async getFee(coin) {
		ow(coin, 'coin', symbolPredicate);

		const response = await this.request({
			method: 'getfee',
			coin,
		});

		if (response.result !== 'success') {
			throw genericError(response);
		}

		return response.txfee;
	}

	async _createTransaction(opts) {
		ow(opts, 'opts', ow.object.exactShape({
			symbol: symbolPredicate,
			address: ow.string,
			amount: ow.number.positive.finite,
		}));

		const result = await this.request({
			method: 'withdraw',
			coin: opts.symbol,
			outputs: [{[opts.address]: opts.amount}],
			broadcast: 0,
		});

		if (!result.complete) {
			throw errorWithObject('Couldn\'t create withdrawal transaction', result);
		}

		return {
			...opts,
			...result,
		};
	}

	async _broadcastTransaction(symbol, rawTransaction) {
		ow(symbol, 'symbol', symbolPredicate);
		ow(rawTransaction, 'rawTransaction', ow.string);

		const response = await this.request({
			method: 'sendrawtransaction',
			coin: symbol,
			signedtx: rawTransaction,
		});

		if (!response.result === 'success') {
			throw errorWithObject('Couldn\'t broadcast transaction', response);
		}

		return response.txid;
	}

	async _withdrawBtcFork(opts) {
		ow(opts, 'opts', ow.object.exactShape({
			symbol: symbolPredicate,
			address: ow.string,
			amount: ow.number.positive.finite,
		}));

		const {
			hex: rawTransaction,
			txfee: txFeeSatoshis,
			txid,
			amount,
			symbol,
			address,
		} = await this._createTransaction(opts);

		// Convert from satoshis
		const SATOSHIS = 100000000;
		const txFee = txFeeSatoshis / SATOSHIS;

		const broadcast = async () => {
			await this._broadcastTransaction(opts.symbol, rawTransaction);

			return {txid, amount, symbol, address};
		};

		return {
			txFee,
			broadcast,
		};
	}

	async _withdrawEth(opts) {
		ow(opts, 'opts', ow.object.exactShape({
			symbol: symbolPredicate,
			address: ow.string,
			amount: ow.number.positive.finite,
		}));

		const {
			eth_fee: txFee,
			gas_price: gasPrice,
			gas,
		} = await this.request({
			method: 'eth_withdraw',
			coin: opts.symbol,
			to: opts.address,
			amount: opts.amount,
			broadcast: 0,
		});

		let hasBroadcast = false;
		const broadcast = async () => {
			if (hasBroadcast) {
				throw new Error('Transaction has already been broadcast');
			}

			hasBroadcast = true;

			const response = await this.request({
				method: 'eth_withdraw',
				gas,
				gas_price: gasPrice,
				coin: opts.symbol,
				to: opts.address,
				amount: opts.amount,
				broadcast: 1,
			});

			if (response.error) {
				throw errorWithObject('Couldn\'t create withdrawal transaction', response);
			}

			return {
				txid: response.tx_id,
				symbol: opts.symbol,
				amount: opts.amount,
				address: opts.address,
			};
		};

		return {
			txFee,
			broadcast,
		};
	}

	withdraw(opts) {
		ow(opts, 'opts', ow.object.exactShape({
			symbol: symbolPredicate,
			address: ow.string,
			amount: ow.number.positive.finite,
		}));

		return getCurrency(opts.symbol).etomic ? this._withdrawEth(opts) : this._withdrawBtcFork(opts);
	}

	kickstart(opts) {
		ow(opts, 'opts', ow.object.exactShape({
			requestId: ow.number.positive.finite,
			quoteId: ow.number.positive.finite,
		}));

		return this.request({
			method: 'kickstart',
			requestid: opts.requestId,
			quoteid: opts.quoteId,
		});
	}

	listUnspent(coin, address) {
		ow(coin, 'coin', symbolPredicate);
		ow(address, 'address', ow.string);

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
		this.queue.clear();
		await this.request({method: 'stop'});
		this.queue.pause();
		this.queue.clear();
	}
}
