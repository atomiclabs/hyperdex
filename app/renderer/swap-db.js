import PouchDB from 'pouchdb-browser';
import pouchDBFind from 'pouchdb-find';
import Emittery from 'emittery';
import PQueue from 'p-queue';
import roundTo from 'round-to';
import swapTransactions from './swap-transactions';

PouchDB.plugin(pouchDBFind);

class SwapDB {
	constructor(portfolioId) {
		this.db = new PouchDB(`swaps-${portfolioId}`, {adapter: 'idb'});

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
		this.ready = this.db.createIndex({index: {fields: ['timeStarted', 'uuid']}});

		this.pQueue = new PQueue({concurrency: 1});
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

	_formatSwap(data) {
		const MATCHED_STEP = 1;
		const TOTAL_PROGRESS_STEPS = swapTransactions.length + MATCHED_STEP;

		const {uuid, timeStarted, request, response, messages} = data;

		const swap = {
			uuid,
			timeStarted,
			status: 'pending',
			statusFormatted: 'pending',
			progress: 0,
			baseCurrency: response.base,
			quoteCurrency: response.rel,
			baseCurrencyAmount: roundTo(response.basevalue, 8),
			quoteCurrencyAmount: roundTo(response.relvalue, 8),
			price: roundTo(response.relvalue / response.basevalue, 8),
			requested: {
				baseCurrencyAmount: roundTo(request.amount, 8),
				quoteCurrencyAmount: roundTo(request.total, 8),
				price: roundTo(request.price, 8),
			},
			broadcast: {
				baseCurrencyAmount: roundTo(response.basevalue, 8),
				quoteCurrencyAmount: roundTo(response.relvalue, 8),
				price: roundTo(response.relvalue / response.basevalue, 8),
			},
			executed: {
				baseCurrencyAmount: undefined,
				quoteCurrencyAmount: undefined,
				price: undefined,
			},
			transactions: [],
			_debug: {
				request,
				response,
				messages,
			},
		};

		messages.forEach(message => {
			if (message.method === 'connected') {
				swap.status = 'matched';
				swap.progress = MATCHED_STEP / TOTAL_PROGRESS_STEPS;
			}

			if (message.method === 'update') {
				swap.status = 'swapping';
				swap.transactions.push({
					stage: message.name,
					coin: message.coin,
					txid: message.txid,
					amount: message.amount,
				});
			}

			if (message.method === 'tradestatus' && message.status === 'finished') {
				swap.status = 'completed';
				swap.progress = 1;

				swap.transactions.push({
					stage: 'alicespend',
					coin: message.bob,
					txid: message.paymentspent,
					amount: message.srcamount,
				});

				swap.baseCurrencyAmount = roundTo(message.srcamount, 8);
				swap.quoteCurrencyAmount = roundTo(message.destamount, 8);
				swap.price = roundTo(message.destamount / message.srcamount, 8);
				swap.executed.baseCurrencyAmount = swap.baseCurrencyAmount;
				swap.executed.quoteCurrencyAmount = swap.quoteCurrencyAmount;
				swap.executed.price = swap.price;
			}

			if (message.method === 'failed') {
				swap.status = 'failed';
			}

			swap.statusFormatted = swap.status;
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
		});

		return swap;
	}

	async _getAllSwapData() {
		await this.ready;

		// We need `timeStarted: {$gt: true}` so PouchDB can sort.
		// https://github.com/pouchdb/pouchdb/issues/7206
		const {docs} = await this.db.find({
			selector: {timeStarted: {$gt: true}},
			sort: [{timeStarted: 'desc'}],
		});

		return docs;
	}

	async getSwaps() {
		const swapData = await this._getAllSwapData();

		return swapData.map(this._formatSwap);
	}
}

export default SwapDB;
