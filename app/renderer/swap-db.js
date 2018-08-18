import PouchDB from 'pouchdb-browser';
import pouchDBFind from 'pouchdb-find';
import cryptoPouch from 'crypto-pouch';
import Emittery from 'emittery';
import PQueue from 'p-queue';
import roundTo from 'round-to';
import {subDays, isAfter} from 'date-fns';
import appContainer from 'containers/App';
import swapTransactions from './swap-transactions';
import {translate} from './translate';
import {appTimeStarted} from '../constants';

const t = translate('swap');

PouchDB.plugin(pouchDBFind);
PouchDB.plugin(cryptoPouch);

class SwapDB {
	constructor(portfolioId, seedPhrase) {
		this.db = new PouchDB(`swaps-${portfolioId}`, {adapter: 'idb'});

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
		this.pQueue.add(() => this.ready.then(fn));
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

	updateSwapData = message => {
		return this.queue(async () => {
			const swap = await this._getSwapData(message.uuid);
			swap.messages.push(message);

			return this.db.put(swap);
		});
	}

	// TODO: We should refactor this into a seperate file
	_formatSwap(data) {
		const MATCHED_STEP = 1;
		const TOTAL_PROGRESS_STEPS = swapTransactions.length + MATCHED_STEP;

		const {uuid, timeStarted, request, response, messages} = data;

		// If we place a sell order marketmaker just inverts the values and places a buy
		// on the opposite pair. We need to normalise this otherwise we'll show the
		// wrong base/quote currencies.
		const isBuyOrder = (request.baseCurrency === response.base);
		const responseBaseCurrencyAmount = isBuyOrder ? response.basevalue : response.relvalue;
		const responseQuoteCurrencyAmount = isBuyOrder ? response.relvalue : response.basevalue;

		const swap = {
			uuid,
			requestId: undefined,
			quoteId: undefined,
			timeStarted,
			orderType: isBuyOrder ? 'buy' : 'sell',
			status: 'pending',
			statusFormatted: t('status.pending').toLowerCase(),
			error: false,
			progress: 0,
			baseCurrency: request.baseCurrency,
			quoteCurrency: request.quoteCurrency,
			baseCurrencyAmount: roundTo(responseBaseCurrencyAmount, 8),
			quoteCurrencyAmount: roundTo(responseQuoteCurrencyAmount, 8),
			price: roundTo(responseQuoteCurrencyAmount / responseBaseCurrencyAmount, 8),
			requested: {
				baseCurrencyAmount: roundTo(request.amount, 8),
				quoteCurrencyAmount: roundTo(request.total, 8),
				price: roundTo(request.price, 8),
			},
			broadcast: {
				baseCurrencyAmount: roundTo(responseBaseCurrencyAmount, 8),
				quoteCurrencyAmount: roundTo(responseQuoteCurrencyAmount, 8),
				price: roundTo(responseQuoteCurrencyAmount / responseBaseCurrencyAmount, 8),
			},
			executed: {
				baseCurrencyAmount: undefined,
				quoteCurrencyAmount: undefined,
				price: undefined,
				percentCheaperThanRequested: undefined,
			},
			transactions: [],
			_debug: {
				request,
				response,
				messages,
			},
		};

		messages.forEach(message => {
			if (message.requestid) {
				swap.requestId = message.requestid;
			}
			if (message.quoteid) {
				swap.quoteId = message.quoteid;
			}

			if (message.method === 'connected') {
				swap.status = 'matched';
				swap.progress = MATCHED_STEP / TOTAL_PROGRESS_STEPS;
			}

			if (message.method === 'update') {
				swap.status = 'swapping';
				// Don't push duplicate messages
				if (!swap.transactions.find(tx => tx.stage === message.name)) {
					swap.transactions.push({
						stage: message.name,
						coin: message.coin,
						txid: message.txid,
						amount: message.amount,
					});
				}
			}

			if (message.method === 'tradestatus' && message.status === 'finished') {
				swap.status = 'completed';
				swap.progress = 1;

				// Nuke transaction history and rebuild it from this message.
				// This will normally result in the same transaction array but
				// if we were offline and missed some messages this will allow us
				// to reconstruct what happened.
				//
				// It also allows us to correctly rebuild the tx chain of swaps that
				// didn't quite go to plan like claiming bobdeposit or alicepayment.
				swap.transactions = message.txChain;

				// Overrride status to failed if we don't have a successful completion transaction
				if (!(
					message.sentflags.includes('alicespend') ||
					message.sentflags.includes('aliceclaim')
				)) {
					swap.status = 'failed';
				}

				const startTx = swap.transactions.find(tx => tx.stage === 'alicepayment');
				const startAmount = startTx ? startTx.amount : 0;
				const endTx = swap.transactions.find(tx => ['alicespend', 'aliceclaim'].includes(tx.stage));
				const endAmount = endTx ? endTx.amount : 0;
				const executedBaseCurrencyAmount = isBuyOrder ? endAmount : startAmount;
				const executedQuoteCurrencyAmount = isBuyOrder ? startAmount : endAmount;
				swap.baseCurrencyAmount = roundTo(executedBaseCurrencyAmount, 8);
				swap.quoteCurrencyAmount = roundTo(executedQuoteCurrencyAmount, 8);
				swap.executed.baseCurrencyAmount = swap.baseCurrencyAmount;
				swap.executed.quoteCurrencyAmount = swap.quoteCurrencyAmount;

				if (endAmount > 0 && startAmount > 0) {
					swap.price = roundTo(executedQuoteCurrencyAmount / executedBaseCurrencyAmount, 8);
					swap.executed.price = swap.price;
					swap.executed.percentCheaperThanRequested = roundTo(100 - ((swap.executed.price / swap.requested.price) * 100), 2);
					if (!isBuyOrder) {
						swap.executed.percentCheaperThanRequested = -swap.executed.percentCheaperThanRequested;
					}
				}
			}

			if (message.method === 'failed') {
				swap.status = 'failed';
				swap.progress = 1;

				// TODO: Add error messages once we have errors documented
				// https://github.com/atomiclabs/hyperdex/issues/180
				swap.error = {
					code: message.error,
					message: `Error Code: ${message.error}`,
				};
			}
		});

		// Show open orders from previous session as unmatched
		const unmatched = swap.status === 'pending' && isAfter(appTimeStarted, swap.timeStarted);
		if (unmatched) {
				swap.status = 'failed';
				swap.error = {
						code: undefined,
						message: t('unmatched'),
				};
		}

		swap.statusFormatted = t(`status.${swap.status}`).toLowerCase();
		if (swap.status === 'swapping') {
			const swapProgress = swap.transactions
				.map(tx => tx.stage)
				.reduce((prevStageLevel, stage) => {
					const newStageLevel = swapTransactions.indexOf(stage) + 1;
					return Math.max(prevStageLevel, newStageLevel);
				}, 0);

			swap.statusFormatted = `swap ${swapProgress}/${swapTransactions.length}`;
			swap.progress = (swapProgress + MATCHED_STEP) / TOTAL_PROGRESS_STEPS;
		}

		if (swap.status === 'failed') {
			if (swap.error.code === -9999 || unmatched) {
				swap.statusFormatted = t('status.unmatched').toLowerCase();
			}
			if (swap.transactions.find(tx => tx.stage === 'alicereclaim')) {
				swap.statusFormatted = t('status.reverted').toLowerCase();
				swap.statusInformation = t('statusInformation.reverted');
			}
		}

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
