import PouchDB from 'pouchdb-browser';
import pouchDBFind from 'pouchdb-find';
import pouchDBUpsert from 'pouchdb-upsert';
import cryptoPouch from 'crypto-pouch';
import Emittery from 'emittery';
import PQueue from 'p-queue';
import roundTo from 'round-to';
import ow from 'ow';
import {subDays, isAfter} from 'date-fns';
import appContainer from 'containers/App';
import {appTimeStarted} from '../constants';
import {translate} from './translate';
import formatOrder from './format-order-data';

const t = translate('swap');

PouchDB.plugin(pouchDBFind);
PouchDB.plugin(pouchDBUpsert);
PouchDB.plugin(cryptoPouch);

class SwapDB {
	constructor(portfolioId, seedPhrase) {
		// Using `orders2` so it won't conflict with prev db
		this.db = new PouchDB(`swaps2-${portfolioId}`, {adapter: 'idb'});

		this.db2 = new PouchDB(`orders2-${portfolioId}`, {adapter: 'idb'});

		this.db.crypto(seedPhrase);

		this.db2.crypto(seedPhrase);

		const ee = new Emittery();
		this.on = ee.on.bind(ee);
		this.off = ee.off.bind(ee);
		this.once = ee.once.bind(ee);

		this.db2.changes({
			since: 'now',
			live: true,
			include_docs: true, // eslint-disable-line camelcase
		}).on('change', ({doc: order}) => ee.emit('change', order));

		// To be able to sort via timeStarted it MUST be the fist item in the index.
		// https://github.com/pouchdb/pouchdb/issues/7207
		this.ready = (async () => {
			await this.db.createIndex({index: {fields: ['timeStarted', 'uuid']}});
			// NOTE: new api
			await this.db2.createIndex({index: {fields: ['timeStarted', 'uuid']}});
			await this.migrate();

			// We need to regularly check if pending swaps have timed out.
			// https://github.com/jl777/SuperNET/issues/775
			const ONE_MINUTE = 1000 * 60;
			setInterval(() => ee.emit('change'), ONE_MINUTE);
		})();

		this.pQueue = new PQueue({concurrency: 1});

		// NOTE: this is only for debug
		// please remove these lines when we merge code
		if (typeof window !== 'undefined') {
			window.swapDB = this;
		}
	}

	async migrate() {
		const {docs: swaps} = await this.db.find({
			selector: {timeStarted: {$gt: true}},
			sort: [{timeStarted: 'desc'}],
		});

		swaps.filter(swap => (
			typeof swap.request.amount === 'string' ||
			typeof swap.request.price === 'string' ||
			typeof swap.request.total === 'string'
		)).forEach(swap => this.db.remove(swap));
	}

	queue(fn) {
		this.pQueue.add(async () => {
			await this.ready;
			fn();
		});
	}

	// NOTE: new api
	insertOrderData(order, requestOpts) {
		return this.queue(() => this.db2.post({
			uuid: order.uuid,
			timeStarted: Date.now(),
			request: requestOpts,
			response: order,
			messages: [],
			swaps: {},
    		startedSwaps:[],
			// NOTE: taker order will be converted to maker order if it is not matched in 30s
			type: "taker",
			status: "active"
		}));
	}

	insertSwapData(swap, requestOpts) {
		return this.queue(() => this.db.post({
			uuid: swap.uuid,
			timeStarted: Date.now(),
			request: requestOpts,
			response: swap,
			messages: [],
		}));
	}

	async _getSwapData(uuid) {
		await this.ready;

		const {docs} = await this.db.find({
			selector: {uuid},
			limit: 1,
		});

		return docs[0];
	}

	// NOTE: new api
	async _getOrderData(uuid) {
		await this.ready;

		const {docs} = await this.db2.find({
			selector: {uuid},
			limit: 1,
		});

		return docs[0];
	}

	// NOTE: new api
	updateOrderData = (orderData, /*swapsData*/) => {
		return this.queue(async () => {
			const order = await this._getOrderData(orderData.uuid);

			await this.db2.upsert(order._id, doc => {
				doc.type = orderData.type;
				// for(let i = 0; i < swapsData.length; i+=1) {
				// 	const swap = swapsData[i];
				// 	if(doc.startedSwaps.indexOf(swap.uuid) === -1) {
				// 		doc.startedSwaps.push(swap.uuid);
				// 	}
				// 	doc.swaps[swap.uuid] = swap;
				// }
				return doc;
			});
		});
	}

	// NOTE: new api
	updateOrderStatus = (uuid, status) => {
		return this.queue(async () => {
			const order = await this._getOrderData(uuid);
			await this.db2.upsert(order._id, doc => {
				doc.status = status;
				return doc;
			});
		});
	}

	// NOTE: new api
	markOrderType = (uuid, type) => {
		return this.queue(async () => {
			const order = await this._getOrderData(uuid);
			await this.db2.upsert(order._id, doc => {
				doc.type = type;
				return doc;
			});
		});
	}

	// NOTE: new api
	updateSwapData2 = (uuid, swapsData) => {
		return this.queue(async () => {
			const order = await this._getOrderData(uuid);

			await this.db2.upsert(order._id, doc => {
				for(let i = 0; i < swapsData.length; i+=1) {
					const swap = swapsData[i];
					if(doc.startedSwaps.indexOf(swap.uuid) === -1) {
						doc.startedSwaps.push(swap.uuid);
					}
					doc.swaps[swap.uuid] = swap;
				}
				return doc;
			});
		});
	}

	updateSwapData = swapData => {
		return this.queue(async () => {
			const swap = await this._getSwapData(swapData.uuid);

			await this.db.upsert(swap._id, doc => {
				doc.swapData = swapData;
				return doc;
			});
		});
	}

	// TODO: We should refactor this into a seperate file
	_formatSwap(data) {
		// Console.log('swap data', data);
		const {
			uuid,
			timeStarted,
			request,
			response,
			swapData,
		} = data;

		const {
			action,
			base: baseCurrency,
			rel: quoteCurrency,
			baseAmount,
			quoteAmount,
		} = response;

		const swap = {
			uuid,
			timeStarted,
			orderType: action === 'Buy' ? 'buy' : 'sell',
			status: 'pending',
			statusFormatted: t('status.open').toLowerCase(),
			error: false,
			progress: 0,
			baseCurrency,
			quoteCurrency,
			baseCurrencyAmount: roundTo(baseAmount, 8),
			quoteCurrencyAmount: roundTo(quoteAmount, 8),
			price: roundTo(quoteAmount / baseAmount, 8),
			requested: {
				baseCurrencyAmount: roundTo(request.amount, 8),
				quoteCurrencyAmount: roundTo(request.total, 8),
				price: roundTo(request.price, 8),
			},
			broadcast: {
				baseCurrencyAmount: roundTo(baseAmount, 8),
				quoteCurrencyAmount: roundTo(quoteAmount, 8),
				price: roundTo(quoteAmount / baseAmount, 8),
			},
			executed: {
				baseCurrencyAmount: undefined,
				quoteCurrencyAmount: undefined,
				price: undefined,
				percentCheaperThanRequested: undefined,
			},
			totalStages: [],
			stages: [],
			_debug: {
				request,
				response,
				swapData,
			},
			get isActive() {
				return !['completed', 'failed'].includes(this.status);
			},
		};

		// Console.log('swapData', swapData);

		if (swapData) {
			const {
				events,
				error_events: errorEvents,
				success_events: successEvents,
			} = swapData;

			// Console.log('events', events);

			const failedEvent = events.find(event => errorEvents.includes(event.event.type));
			const nonSwapEvents = ['Started', 'Negotiated', 'Finished'];
			const totalSwapEvents = successEvents.filter(type => !nonSwapEvents.includes(type));
			const swapEvents = events.filter(event => (
				!nonSwapEvents.includes(event.event.type) &&
				!errorEvents.includes(event.event.type)
			));
			const isFinished = !failedEvent && events.some(event => event.event.type === 'Finished');
			const isSwapping = !failedEvent && !isFinished && swapEvents.length > 0;
			const maxSwapProgress = 0.8;
			const newestEvent = events[events.length - 1];

			// Console.log('failedEvent', failedEvent);
			// console.log('totalSwapEvents', totalSwapEvents);
			// console.log('swapEvents', swapEvents);
			// console.log('isFinished', isFinished);
			// console.log('isSwapping', isSwapping);

			swap.totalStages = totalSwapEvents;
			swap.stages = swapEvents;

			if (failedEvent) {
				swap.status = 'failed';
				swap.progress = 1;

				swap.error = {
					code: failedEvent.event.type,
					message: failedEvent.event.data.error,
				};
			} else if (isFinished) {
				swap.status = 'completed';
				swap.progress = 1;
			} else if (isSwapping) {
				swap.status = 'swapping';
				swap.statusFormatted = `swap ${swapEvents.length}/${totalSwapEvents.length}`;
				swap.progress = 0.1 + ((swapEvents.length / totalSwapEvents.length) * maxSwapProgress);
			} else if (newestEvent && newestEvent.event.type === 'Negotiated') {
				swap.status = 'matched';
				swap.progress = 0.1;
			}

			// TODO(sindresorhus): I've tried to preserve the existing behavior when using mm2. We should probably update the events and naming for mm2 conventions though.

			if (!isSwapping) {
				swap.statusFormatted = t(`status.${swap.status}`).toLowerCase();
			}
		}

		if (swap.status === 'pending') {
			swap.statusFormatted = t('status.open').toLowerCase();
		}

		// Show open orders from previous session as cancelled
		const cancelled = swap.status === 'pending' && isAfter(appTimeStarted, swap.timeStarted);
		if (cancelled) {
			swap.status = 'failed';
			swap.error = {
				code: undefined,
				message: undefined,
			};
			swap.statusFormatted = t('status.cancelled').toLowerCase();
		}

		// Console.log('progress', swap.progress);

		return swap;
	}

	async _getAllSwapData(options = {}) {
		await this.ready;

		options = {
			since: true,
			sort: 'desc',
			...options,
		};

		const query = {
			selector: {
				timeStarted: {
					$gt: options.since,
				},
			},
			sort: [
				{
					timeStarted: options.sort,
				},
			],
		};

		// We need `timeStarted: {$gt: true}` so PouchDB can sort.
		// https://github.com/pouchdb/pouchdb/issues/7206
		const {docs} = await this.db.find(options.query || query);
		return docs;
	}

	// NOTE: new api
	async _getAllOrdersData(options = {}) {
		await this.ready;

		options = {
			since: true,
			sort: 'desc',
			...options,
		};

		const query = {
			selector: {
				timeStarted: {
					$gt: options.since,
				},
			},
			sort: [
				{
					timeStarted: options.sort,
				},
			],
		};

		// We need `timeStarted: {$gt: true}` so PouchDB can sort.
		// https://github.com/pouchdb/pouchdb/issues/7206
		const {docs} = await this.db2.find(options.query || query);

		return docs;
	}

	async getSwaps(options) {
		const swapData = await this._getAllSwapData(options);
		return swapData.map(this._formatSwap);
	}

	// NOTE: new api
	async getOrders(options) {
		const ordersData = await this._getAllOrdersData(options);
		return ordersData.map(formatOrder);
	}

	// NOTE: new api
	async getRawOrders(options) {
		const ordersData = await this._getAllOrdersData(options);
		return ordersData;
	}

	async getOrdersCount() {
		const entries = await this.db2.allDocs();
		return entries.rows.length - 1; // We don't count the `_design` doc
	}

	// NOTE: new api
	// https://pouchdb.com/api.html#delete_document
	async removeAOrder(uuid) {
		ow(uuid, 'uuid', ow.string);
		return this.queue(async () => {
			const order = await this._getOrderData(uuid);
			await this.db2.remove(order);
		});
	}

	async destroy() {
		await this.db.destroy();
	}

	// NOTE: new api
	async destroy2() {
		await this.db2.destroy();
	}

	async statsSince(timestamp) {
		const orders = await this.getOrders({since: timestamp});
		const successfulOrders = orders.filter(swap => swap.status === 'completed');

		const tradedCurrencies = new Set();
		for (const swap of successfulOrders) {
			tradedCurrencies.add(swap.baseCurrency);
			tradedCurrencies.add(swap.quoteCurrency);
		}

		let totalSwapsWorthInUsd = 0;
		for (const swap of successfulOrders) {
			totalSwapsWorthInUsd += swap.quoteCurrencyAmount * appContainer.getCurrency(swap.quoteCurrency).cmcPriceUsd;
		}

		return {
			successfulSwapCount: successfulOrders.length,
			currencyCount: tradedCurrencies.size,
			totalSwapsWorthInUsd,
		};
	}

	statsSinceLastMonth() {
		return this.statsSince(subDays(Date.now(), 30).getTime());
	}
}

export default SwapDB;
