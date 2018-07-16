import util from 'util';
import electron from 'electron';
import {sha256} from 'crypto-hash';
import PQueue from 'p-queue';
import ow from 'ow';
import {getCurrency} from '../marketmaker/supported-currencies';
import MarketmakerSocket from './marketmaker-socket';

const getPort = electron.remote.require('get-port');

const symbolPredicate = ow.string.uppercase;
const uuidPredicate = ow.string.alphanumeric.lowercase;

const errorWithObject = (message, object) => new Error(`${message}:\n${util.format(object)}`);
const genericError = object => errorWithObject('Encountered an error', object);

/* eslint-disable camelcase */
export default class Api {
	constructor({endpoint, seedPhrase, concurrency = 1}) {
		ow(endpoint, ow.string.label('endpoint'));
		ow(seedPhrase, ow.string.label('seedPhrase'));
		ow(concurrency, ow.any(ow.number.integer.label('concurrency'), ow.number.infinite.label('concurrency')));

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
		ow(data, ow.object.label('data'));

		return this._request({
			needjson: 1,
			...data,
			...{userpass: await this.token},
		});
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
		ow(symbol, symbolPredicate.label('symbol'));

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

			return success;
		}

		const response = await this.request({method: 'enable', coin: symbol});
		return response.status === 'active';
	}

	disableCoin(coin) {
		ow(coin, symbolPredicate.label('coin'));

		return this.request({
			method: 'disable',
			coin,
		});
	}

	portfolio() {
		return this.request({method: 'portfolio'});
	}

	balance(coin, address) {
		ow(coin, symbolPredicate.label('coin'));
		ow(address, ow.string.label('address'));

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
		ow(base, symbolPredicate.label('base'));
		ow(rel, symbolPredicate.label('rel'));

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
		ow(opts.type, ow.string.oneOf(['buy', 'sell']).label('type'));
		ow(opts.baseCurrency, symbolPredicate.label('baseCurrency'));
		ow(opts.quoteCurrency, symbolPredicate.label('quoteCurrency'));
		ow(opts.amount, ow.number.finite.label('amount'));
		ow(opts.total, ow.number.finite.label('total'));
		ow(opts.price, ow.number.finite.label('price'));

		return this.request({
			method: opts.type,
			base: opts.baseCurrency,
			rel: opts.quoteCurrency,
			basevolume: opts.amount,
			relvolume: opts.total,
			price: opts.price,
		});
	}

	async cancelOrder(uuid) {
		ow(uuid, uuidPredicate.label('uuid'));

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
		ow(coin, symbolPredicate.label('coin'));

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
		ow(opts.symbol, symbolPredicate.label('symbol'));
		ow(opts.address, ow.string.label('address'));
		ow(opts.amount, ow.number.positive.finite.label('amount'));

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
		ow(symbol, symbolPredicate.label('symbol'));
		ow(rawTransaction, ow.string.label('rawTransaction'));

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
		ow(opts.symbol, symbolPredicate.label('symbol'));
		ow(opts.address, ow.string.label('address'));
		ow(opts.amount, ow.number.positive.finite.label('amount'));

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
		ow(opts.symbol, symbolPredicate.label('symbol'));
		ow(opts.address, ow.string.label('address'));
		ow(opts.amount, ow.number.positive.finite.label('amount'));

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
		ow(opts.symbol, symbolPredicate.label('symbol'));
		ow(opts.address, ow.string.label('address'));
		ow(opts.amount, ow.number.positive.finite.label('amount'));

		return getCurrency(opts.symbol).etomic ? this._withdrawEth(opts) : this._withdrawBtcFork(opts);
	}

	kickstart(opts) {
		ow(opts.requestId, ow.number.positive.finite.label('requestId'));
		ow(opts.quoteId, ow.number.positive.finite.label('quoteId'));

		return this.request({
			method: 'kickstart',
			requestid: opts.requestId,
			quoteid: opts.quoteId,
		});
	}

	listUnspent(coin, address) {
		ow(coin, symbolPredicate.label('coin'));
		ow(address, ow.string.label('address'));

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
