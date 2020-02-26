import test from 'ava';
import proxyquire from 'proxyquire';
import order from './__mocks__/a26144dc-237c-4d32-b34d-e73ce9b34f83.json';

const formatOrder = proxyquire.noCallThru()('../../app/renderer/format-order-data', {
	'./translate': {
		translate: namespace => {
			return () => 'Open';
		},
	},
}).default;

test('format order data', t => {
	const formatedData = formatOrder(order);
	t.is(formatedData.uuid, order.uuid);
});
