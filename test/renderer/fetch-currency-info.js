import test from 'ava';
import proxyquire from 'proxyquire';

const fetchCurrencyInfo = proxyquire.noCallThru()('../../app/renderer/fetch-currency-info', {
	'../constants': {
		ignoreExternalPrice: new Set(),
	},
}).default;

test('fetches info', async t => {
	const symbol = 'KMD';
	const info = (await fetchCurrencyInfo([symbol]))[0];
	t.is(info.symbol, symbol);
	t.is(typeof info.price, 'number');
	t.is(typeof info.percentChange24h, 'number');
});

test('returns fallback when not supported', async t => {
	const symbol = 'AFHGASFGAAD';
	const info = (await fetchCurrencyInfo([symbol]))[0];
	t.is(info.symbol, symbol);
	t.is(info.price, 0);
	t.is(info.percentChange24h, 0);
});
