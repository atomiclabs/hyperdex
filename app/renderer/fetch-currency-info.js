import coinlist from 'coinlist';
import roundTo from 'round-to';
import ow from 'ow';
import {ignoreExternalPrice} from '../constants';

const baseURL = 'https://api.coingecko.com/api/v3';

const fetchCurrencyInfo = async symbols => {
	ow(symbols, ow.array.ofType(ow.string.uppercase));

	const filteredSymbols = symbols.filter(symbol => !ignoreExternalPrice.has(symbol));

	const ids = filteredSymbols
		.map(symbol => coinlist.get(symbol, 'id'))
		.filter(symbol => symbol !== undefined); // For example, SUPERNET

	// Docs: https://www.coingecko.com/api/docs/v3#/coins/get_coins_markets
	let data;
	try {
		const response = await fetch(`${baseURL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}`);
		data = await response.json();
	} catch (error) {
		console.error('Failed to fetch from CoinGecko API:', error);
		data = [];
	}

	// The API just ignores IDs it doesn't support, so we need to iterate
	// our list of symbols instead of the result so we can add the fallbacks.
	const currencies = symbols.map(symbol => {
		const currency = data.find(currency => currency.symbol.toUpperCase() === symbol);
		return {
			symbol,
			price: currency ? currency.current_price : 0,
			percentChange24h: currency ? roundTo(Number(currency.price_change_percentage_24h), 1) : 0,
		};
	});

	return currencies;
};

export default fetchCurrencyInfo;
