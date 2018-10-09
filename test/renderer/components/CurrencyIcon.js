import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import CurrencyIcon from 'components/CurrencyIcon';
import Image from 'components/Image';

const symbol = 'symbol';

test('render `Image`', t => {
	const m = shallow(<CurrencyIcon symbol={symbol}/>);
	t.is(m.type(), Image);
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<CurrencyIcon symbol={symbol} foo={foo}/>);
	t.is(component.prop('foo'), foo);
});

test('has `size` prop', t => {
	const size = 'foo';
	const component = shallow(<CurrencyIcon symbol={symbol} size={size}/>);
	t.is(component.prop('width'), size);
	t.is(component.prop('height'), size);
});

test('set `url` prop for regular currency', t => {
	const url = `/assets/cryptocurrency-icons/${symbol}.svg`;
	const component = shallow(<CurrencyIcon symbol={symbol}/>);
	t.is(component.prop('url'), url);
});

test('set `url` prop for custom currency', t => {
	const url = '/assets/custom-cryptocurrency-icons/beer.svg';
	const component = shallow(<CurrencyIcon symbol="BEER"/>);
	t.is(component.prop('url'), url);
});
