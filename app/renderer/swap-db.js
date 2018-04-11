import PouchDB from 'pouchdb-browser';
import pouchDBFind from 'pouchdb-find';
import Emittery from 'emittery';
import PQueue from 'p-queue';

PouchDB.plugin(pouchDBFind);

class SwapDB {
	constructor() {
		this.db = new PouchDB('swaps', {adapter: 'idb'});

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

	insertSwap(swap, requestOpts) {
		return this.queue(() => {
			const formattedSwap = {
				uuid: swap.uuid,
				timeStarted: Date.now(),
				status: 'pending',
				flags: [],
				baseCurrency: swap.base,
				baseCurrencyAmount: swap.basevalue,
				quoteCurrency: swap.rel,
				quoteCurrencyAmount: swap.relvalue,
				debug: {
					request: JSON.stringify(requestOpts),
					response: JSON.stringify(swap),
					messages: [],
				},
			};

			return this.db.post(formattedSwap);
		});
	}

	async getSwap(uuid) {
		await this.ready;

		const {docs} = await this.db.find({selector: {uuid}});

		return docs[0];
	}

	updateSwap = message => {
		return this.queue(async () => {
			const {uuid} = message;

			const swap = await this.getSwap(uuid);

			if (message.method === 'connected') {
				swap.status = 'matched';
			}

			if (message.method === 'update') {
				swap.status = 'swapping';
				swap.flags.push(message.name);
			}

			if (message.method === 'tradestatus' && message.status === 'finished') {
				swap.status = 'completed';
			}

			if (message.method === 'failed') {
				swap.status = 'failed';
			}

			swap.debug.messages.push(JSON.stringify(message));

			return this.db.put(swap);
		});
	}

	async getSwaps() {
		await this.ready;

		// We need `timeStarted: {$gt: true}` so PouchDB can sort.
		// https://github.com/pouchdb/pouchdb/issues/7206
		const {docs} = await this.db.find({
			selector: {timeStarted: {$gt: true}},
			sort: [{timeStarted: 'desc'}],
		});

		return docs;
	}
}

const swapDB = new SwapDB();

export default swapDB;
