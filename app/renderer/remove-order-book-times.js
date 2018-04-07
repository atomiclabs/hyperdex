import _ from 'lodash';

const removeOrderBookTimes = orderbook => {
	orderbook = _.cloneDeep(orderbook);

	// These properties change every request and trigger unnecessary re-renders
	delete orderbook.timestamp;
	orderbook.bids.forEach(bid => delete bid.age);
	orderbook.asks.forEach(ask => delete ask.age);

	return orderbook;
};

export default removeOrderBookTimes;
