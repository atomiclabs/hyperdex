import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import CopyCurrencyAddress from 'components/CopyCurrencyAddress';
import Input from 'components/Input';

test('render `Input`', t => {
	const component = shallow(<CopyCurrencyAddress/>);
	t.is(component.type(), Input);
});

test('has `value` prop', t => {
	const value = 'foo';
	const component = shallow(<CopyCurrencyAddress value={value}/>);
	t.is(component.prop('value'), value);
});

test('set `className` prop', t => {
	const component = shallow(<CopyCurrencyAddress/>);
	t.is(component.prop('className'), 'CopyCurrencyAddress');
});
