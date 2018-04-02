import PouchDB from 'pouchdb-browser';
import pouchDBFind from 'pouchdb-find';

PouchDB.plugin(pouchDBFind);

class SwapDB {
	constructor() {
		this.db = new PouchDB('swaps', {adapter: 'idb'});

		this.ready = this.db.createIndex({
			index: {
				fields: ['tradeId', 'aliceId', 'requestId', 'quoteId', 'timeStarted']
			}
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

	updateSwap(swap) {

	}
}

const swapDB = new SwapDB();

export default swapDB;
