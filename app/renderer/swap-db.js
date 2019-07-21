import PouchDB from 'pouchdb-browser';
import pouchDBFind from 'pouchdb-find';
import pouchDBUpsert from 'pouchdb-upsert';
import cryptoPouch from 'crypto-pouch';
import Emittery from 'emittery';
import PQueue from 'p-queue';
import roundTo from 'round-to';
import {subDays, isAfter} from 'date-fns';
import appContainer from 'containers/App';
import {appTimeStarted} from '../constants';
import {translate} from './translate';

const t = translate('swap');

PouchDB.plugin(pouchDBFind);
PouchDB.plugin(pouchDBUpsert);
PouchDB.plugin(cryptoPouch);

class SwapDB {
	constructor(portfolioId, seedPhrase) {
		// Using `2` so it won't conflict with HyperDEX versions using marketmaker v1.
		this.db = new PouchDB(`swaps2-${portfolioId}`, {adapter: 'idb'});

		this.db.crypto(seedPhrase);

		const ee = new Emittery();
		this.on = ee.on.bind(ee);
		this.off = ee.off.bind(ee);
		this.once = ee.once.bind(ee);

		this.db.changes({
			since: 'now',
			live: true,
			include_docs: true, // eslint-disable-line camelcase
		}).on('change', ({doc: swap}) => ee.emit('change', swap));

		// To be able to sort via timeStarted it MUST be the fist item in the index.
		// https://github.com/pouchdb/pouchdb/issues/7207
		this.ready = (async () => {
			await this.db.createIndex({index: {fields: ['timeStarted', 'uuid']}});
			await this.migrate();

			// We need to regularly check if pending swaps have timed out.
			// https://github.com/jl777/SuperNET/issues/775
			const ONE_MINUTE = 1000 * 60;
			setInterval(() => ee.emit('change'), ONE_MINUTE);
		})();

		this.pQueue = new PQueue({concurrency: 1});
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
		console.log('swap data', data);

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
			get isActive() {
				return !['completed', 'failed'].includes(this.status);
			},
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
		};

		console.log('swapData', swapData);

		if (swapData) {
			const {
				events,
				error_events: errorEvents,
				success_events: successEvents,
			} = swapData;

			console.log('events', events);

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

			console.log('failedEvent', failedEvent);
			console.log('totalSwapEvents', totalSwapEvents);
			console.log('swapEvents', swapEvents);
			console.log('isFinished', isFinished);
			console.log('isSwapping', isSwapping);

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

		console.log('progress', swap.progress);

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

	async getSwaps(options) {
		const swapData = await this._getAllSwapData(options);
		return swapData.map(this._formatSwap);
	}

	async getSwapCount() {
		const entries = await this.db.allDocs();
		return entries.rows.length - 1; // We don't count the `_design` doc
	}

	async destroy() {
		await this.db.destroy();
	}

	async statsSince(timestamp) {
		const swaps = await this.getSwaps({since: timestamp});
		const successfulSwaps = swaps.filter(swap => swap.status === 'completed');

		const tradedCurrencies = new Set();
		for (const swap of successfulSwaps) {
			tradedCurrencies.add(swap.baseCurrency);
			tradedCurrencies.add(swap.quoteCurrency);
		}

		let totalSwapsWorthInUsd = 0;
		for (const swap of successfulSwaps) {
			totalSwapsWorthInUsd += swap.quoteCurrencyAmount * appContainer.getCurrency(swap.quoteCurrency).cmcPriceUsd;
		}

		return {
			successfulSwapCount: successfulSwaps.length,
			currencyCount: tradedCurrencies.size,
			totalSwapsWorthInUsd,
		};
	}

	statsSinceLastMonth() {
		return this.statsSince(subDays(Date.now(), 30).getTime());
	}
}

export default SwapDB;
