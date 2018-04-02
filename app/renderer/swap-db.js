import PouchDB from 'pouchdb-browser';
import pouchDBFind from 'pouchdb-find';

PouchDB.plugin(pouchDBFind);

class SwapDB {
	constructor() {
		this.db = new PouchDB('swaps', {adapter: 'idb'});

		// This is a bug in PouchDB but to be able to sort via timeStarted it MUST
		// be the fist item in the index.
		// https://github.com/pouchdb/pouchdb/issues/6399#issuecomment-361938113
		this.ready = this.db.createIndex({
			index: {
				fields: ['timeStarted', 'tradeId', 'aliceId', 'requestId', 'quoteId'],
			},
		});
	}

	insertSwap(swap, requestOpts) {
		const formattedSwap = {
			tradeId: swap.tradeid,
			aliceId: swap.aliceid,
			requestId: swap.requestid,
			quoteId: swap.quoteid,
			timeStarted: Date.now(),
			swapStatus: 'open',
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
		if (requestId && quoteId) {
			query.selector = {requestId, quoteId};
		} else if (tradeId && aliceId) {
			query.selector = {tradeId, aliceId};
		}

		if (!query.selector) {
			throw new Error(`Swap must have tradeId/aliceId or requestId/quoteId: ${JSON.stringify(ids)}`);
		}

		// We need `{$gt: true}` so PouchDB can sort.
		// https://github.com/pouchdb/pouchdb/issues/6399#issuecomment-295858705
		query.selector.timeStarted = {$gt: true};
		query.sort = [{timeStarted: 'desc'}];

		const {docs} = await this.db.find(query);

		if (docs.length > 1) {
			const collisionProps = Object.keys(query.selector).filter(p => p !== 'timeStarted').join('/');
			console.warn(`swapDB ${collisionProps} collision detected!`, {query, docs});
		}

		return docs[0];
	}
}

const swapDB = new SwapDB();

export default swapDB;
