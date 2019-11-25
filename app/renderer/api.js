/* eslint-disable camelcase */
import util from 'util';
import PQueue from 'p-queue';
import ow from 'ow';
import _ from 'lodash';
import {getCurrency} from '../marketmaker/supported-currencies';
// import {isDevelopment} from '../util-common';

// NOTE: temporarily turn off this feature
// enable when we merge code
const isDevelopment = false;

const symbolPredicate = ow.string.uppercase;
const uuidPredicate = ow.string.matches(/[a-z\d-]/);

/* eslint-disable no-unused-vars */
const errorWithObject = (message, object) => new Error(`${message}:\n${util.format(object)}`);
const genericError = object => errorWithObject('Encountered an error', object);
/* eslint-enable no-unused-vars */

const reportError = error => {
	console.error(error);
	// eslint-disable-next-line no-new
	new Notification(error);
};

export default class Api {
	constructor({endpoint, rpcPassword, concurrency = Infinity}) {
		ow(endpoint, 'endpoint', ow.string);
		ow(rpcPassword, 'rpcPassword', ow.string);
		ow(concurrency, 'concurrency', ow.number.positive.integerOrInfinite);

		this.endpoint = endpoint;
		this.rpcPassword = rpcPassword;
		this.queue = new PQueue({concurrency});
	}

	async request(data) {
		ow(data, 'data', ow.object);

		const body = {
			...data,
			// TODO: When https://github.com/artemii235/SuperNET/issues/298 is fixed, rename `userpass` to `rpc_password` and also reduce the places we pass around `seedPhrase`.
			userpass: this.rpcPassword,
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

			result = await response.json();

			if (isDevelopment) {
				// TODO: Use `Intl.RelativeTimeFormat` here when we use an Electron version with Chrome 71
				const requestDuration = (Date.now() - requestTime) / 1000;
				const groupLabel = `API method: ${body.method} (${requestDuration}s)`;
				console.groupCollapsed(groupLabel);
				console.log('Request:', _.omit(body, ['needjson', 'userpass']));
				console.log('Response:', response.status, result);
				console.groupEnd(groupLabel);
			}
		} catch (error) {
			if (isDevelopment) {
				console.error('Request error', error, body);
			}

			if (error.message === 'Failed to fetch') {
				error.message = 'Request to Marketmaker failed';
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

	// Mm v2
	async enableCurrency(symbol) {
		ow(symbol, 'symbol', symbolPredicate);

		// TODO: Remove `OOT` when https://github.com/KomodoPlatform/atomicDEX-API/issues/492 is fixed
		// above TODO should be fixed.
		// if (symbol === 'OOT' || symbol === 'USDT') {
		if (symbol === 'USDT') {
			console.error(`Ignoring ${symbol} currency as it's not working with mm2`);
			return;
		}

		const currency = getCurrency(symbol);

		if (!currency) {
			console.error('Tried to enable unsupported currency:', symbol);
			return;
		}

		if (currency.electrumServers) {
			const servers = currency.electrumServers.map(server => ({
				url: `${server.host}:${server.port}`,
				// TODO: Use HTTPS for the Electrum servers that supports it.
				// protocol: 'SSL',
			}));


			try {
				const response = await this.request({
					method: 'electrum',
					coin: symbol,
					mm2: currency.mm2,
					servers,
				});

				const isSuccess = response.result === 'success';
				if (!isSuccess) {
					reportError(`Could not connect to ${symbol} Electrum server`);
				}
			} catch (error) {
				reportError(`Could not connect to ${symbol} Electrum server: ${error}`);
				return;
			}

			console.log('Enabled Electrum for currency:', symbol);
			return;
		}

		try {
			// ETH/ERC20-based token
			const response = await this.request({
				method: 'enable',
				coin: symbol,
				urls: [
					'http://eth1.cipig.net:8555',
					'http://eth2.cipig.net:8555',
					'http://eth3.cipig.net:8555',
				],
				swap_contract_address: '0x8500AFc0bc5214728082163326C2FF0C73f4a871',
				gas_station_url: 'https://ethgasstation.info/json/ethgasAPI.json',
				mm2: 1,
			});

			const isSuccess = response.result === 'success';
			if (!isSuccess) {
				reportError(`Could not enable ETH/ERC20 currency ${symbol}`);
			}
		} catch (error) {
			reportError(`Could not enable ETH/ERC20 currency ${symbol}: ${error}`);
		}
	}

	async disableCurrency(symbol) {
		ow(symbol, 'symbol', symbolPredicate);

		return this.request({
			method: 'disable_coin',
			coin: symbol,
		});
	}

	// Mm v2
	async orderBook(baseCurrency, quoteCurrency) {
		ow(baseCurrency, 'baseCurrency', symbolPredicate);
		ow(quoteCurrency, 'quoteCurrency', symbolPredicate);

		const response = await this.request({
			method: 'orderbook',
			base: baseCurrency,
			rel: quoteCurrency,
		});

		const formatOrders = orders => orders
			.map(order => ({
				address: order.address,
				depth: order.depth,
				price: Number(order.price),
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

	// Mm v2
	async order(options) {
		ow(options, 'options', ow.object.exactShape({
			type: ow.string.oneOf(['buy', 'sell']),
			baseCurrency: symbolPredicate,
			quoteCurrency: symbolPredicate,
			price: ow.number.finite,
			volume: ow.number.finite,
		}));

		const {result} = await this.request({
			method: options.type,
			gtc: 1, // TODO: Looks like this is missing from mm v2
			base: options.baseCurrency,
			rel: options.quoteCurrency,
			price: options.price,
			volume: options.volume,
		});

		result.baseAmount = Number(result.base_amount);
		delete result.base_amount;

		result.quoteAmount = Number(result.rel_amount);
		delete result.rel_amount;

		return result;
	}

	// Mm v2
	// Note: new api
	async cancelAllOrdersByPair(baseCurrency, quoteCurrency) {
		const {result} = await this.request({
			method: 'cancel_all_orders',
			cancel_by: {
				type: 'Pair',
				data: {
					base: baseCurrency,
					rel: quoteCurrency
				}
			}
		});

		return result;
	}

	// Mm v2
	orderStatus(uuid) {
		ow(uuid, 'uuid', uuidPredicate);

		return this.request({
			method: 'order_status',
			uuid,
		});
	}

	// Mm v2
	async mySwapStatus(uuid) {
		ow(uuid, 'uuid', uuidPredicate);

		const {result} = await this.request({
			method: 'my_swap_status',
			params: {uuid},
		});

		return result;
	}

	// Mm v2
	// https://developers.atomicdex.io/basic-docs/atomicdex/atomicdex-api.html#my-orders
	async myOrders() {
		const {result} = await this.request({
			method: 'my_orders',
		});

		return result;
	}

	// Mm v2
	// https://github.com/artemii235/developer-docs/blob/mm/docs/basic-docs/atomicdex/atomicdex-api.md#my_recent_swaps
	// TODO: Add support for the input arguments it supports.
	async myRecentSwaps(fromUUID = null) {
		const query = {
			method: 'my_recent_swaps'
		};
		if(!fromUUID) {
			query.from_uuid = fromUUID;
		}
		const {result} = await this.request(query);
		return result.swaps;
	}

	// Mm v2
	// https://github.com/artemii235/developer-docs/blob/mm/docs/basic-docs/atomicdex/atomicdex-api.md#get_enabled_coins
	async getEnabledCurrencies() {
		const {result} = await this.request({
			method: 'get_enabled_coins',
		});

		return result;
	}

	// Mm v2
	// https://developers.atomicdex.io/basic-docs/atomicdex/atomicdex-api.html#cancel-all-orders
	async cancelAllOrders() {
		const {result} = await this.request({
			method: 'cancel_all_orders',
			cancel_by: {
				type: 'All'
			}
		});

		return result;
	}

	// Mm v2
	// https://developers.atomicdex.io/basic-docs/atomicdex/atomicdex-api.html#get-trade-fee
	async getTradeFee(currency) {
		ow(currency, 'currency', symbolPredicate);

		const {result} = await this.request({
			method: 'get_trade_fee',
			coin: currency,
		});

		return result;
	}

	// Mm v2
	// https://github.com/artemii235/developer-docs/blob/mm/docs/basic-docs/atomicdex/atomicdex-api.md#cancel_order
	async cancelOrder(uuid) {
		ow(uuid, 'uuid', uuidPredicate);

		const response = await this.request({
			method: 'cancel_order',
			uuid,
		});

		if (response.error) {
			throw new Error(response.error);
		}
	}

	// Mm v2
	// https://github.com/artemii235/developer-docs/blob/mm/docs/basic-docs/atomicdex/atomicdex-api.md#my_balance
	async myBalance(currency) {
		ow(currency, 'currency', symbolPredicate);

		const response = await this.request({
			method: 'my_balance',
			coin: currency,
		});

		return {
			address: response.address,
			balance: Number(response.balance),
		};
	}

	// Mm v2
	// https://github.com/artemii235/developer-docs/blob/mm/docs/basic-docs/atomicdex/atomicdex-api.md#coins_needed_for_kick_start
	async coinsNeededForKickStart() {
		const {result} = await this.request({
			method: 'coins_needed_for_kick_start',
		});

		return result;
	}

	// Mm v2
	// https://github.com/artemii235/developer-docs/blob/mm/docs/basic-docs/atomicdex/atomicdex-api.md#send_raw_transaction
	async sendRawTransaction(options) {
		ow(options, 'options', ow.object.exactShape({
			symbol: symbolPredicate,
			txHex: ow.string,
		}));

		const {tx_hash: txHash} = await this.request({
			method: 'send_raw_transaction',
			coin: options.symbol,
			tx_hex: options.txHex,
		});

		return txHash;
	}

	// Mm v2
	// https://github.com/artemii235/developer-docs/blob/mm/docs/basic-docs/atomicdex/atomicdex-api.md#withdraw
	async withdraw(options) {
		ow(options, 'options', ow.object.exactShape({
			symbol: symbolPredicate,
			address: ow.string,
			amount: ow.number.positive.finite,
			max: ow.boolean,
		}));

		const {max = false} = options;

		return this.request({
			method: 'withdraw',
			coin: options.symbol,
			to: options.address,
			amount: String(options.amount),
			max,
		});
	}

	async stop() {
		this.queue.clear();
		await this.request({method: 'stop'});
		this.queue.pause();
		this.queue.clear();
	}
}
