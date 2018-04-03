import PouchDB from 'pouchdb-browser';
import pouchDBFind from 'pouchdb-find';

PouchDB.plugin(pouchDBFind);

class SwapDB {
	constructor() {
		this.db = new PouchDB('swaps', {adapter: 'idb'});

		// To be able to sort via timeStarted it MUST be the fist item in the index.
		// https://github.com/pouchdb/pouchdb/issues/7207
		//
		// Also, we need both indexes, we can't just have a single index of:
		// ['timeStarted', 'tradeId', 'aliceId', 'requestId', 'quoteId']
		// because then querying by requestId/quoteId and sorting by timeStarted throws.
		// https://github.com/pouchdb/pouchdb/issues/7205
		this.ready = Promise.all([
			this.db.createIndex({index: {fields: ['timeStarted', 'tradeId', 'aliceId']}}),
			this.db.createIndex({index: {fields: ['timeStarted', 'requestId', 'quoteId']}}),
		]);
	}

	insertSwap(swap, requestOpts) {
		const formattedSwap = {
			tradeId: swap.tradeid,
			aliceId: swap.aliceid,
			requestId: swap.requestid,
			quoteId: swap.quoteid,
			timeStarted: Date.now(),
			status: 'open',
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
	}

	async getSwap(ids) {
		const {tradeId, aliceId, requestId, quoteId} = ids;

		const query = {};
		if (tradeId && aliceId) {
			query.selector = {tradeId, aliceId};
		} else if (requestId && quoteId) {
			query.selector = {requestId, quoteId};
		}

		if (!query.selector) {
			throw new Error(`Swap must have tradeId/aliceId or requestId/quoteId: ${JSON.stringify(ids)}`);
		}

		// We need `{$gt: true}` so PouchDB can sort.
		// https://github.com/pouchdb/pouchdb/issues/7206
		query.selector.timeStarted = {$gt: true};
		query.sort = [{timeStarted: 'desc'}];

		const {docs} = await this.db.find(query);

		if (docs.length > 1) {
			const collisionProps = Object.keys(query.selector).filter(p => p !== 'timeStarted').join('/');
			console.warn(`swapDB ${collisionProps} collision detected!`, {query, docs});
		}

		return docs[0];
	}

	updateSwap = async message => {
		const {
			tradeid: tradeId,
			aliceid: aliceId,
			requestid: requestId,
			quoteid: quoteId,
		} = message;

		const swap = await this.getSwap({tradeId, aliceId, requestId, quoteId});

		if (requestId && quoteId) {
			swap.requestId = requestId;
			swap.quoteId = quoteId;
		}

		if (message.method === 'connected') {
			swap.status = 'matched';
		}

		if (message.method === 'update') {
			swap.status = 'swapping';
			swap.flags.push(message.name);
		}

		if (message.method === 'tradestatus' && message.status === 'finished') {
			swap.status = 'complete';
		}

		if (message.method === 'failed') {
			swap.status = 'failed';
		}

		swap.debug.messages.push(JSON.stringify(message));

		return this.db.put(swap);
	}
}

const swapDB = new SwapDB();

export default swapDB;
