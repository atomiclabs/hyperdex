import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import CurrencyIcon from 'components/CurrencyIcon';
import CurrencySelectOption from 'components/CurrencySelectOption';
import SelectOption from 'components/SelectOption';

test('render `SelectOption`', t => {
	const component = shallow(<CurrencySelectOption/>);
	t.is(component.type(), SelectOption);
});

test('pass `option`', t => {
	const option = {label: 'foo', value: 'bar'};
	const component = shallow(<CurrencySelectOption {...option}/>);
	t.is(component.prop('label'), 'foo');
	t.is(component.prop('value'), 'bar');
});

test('set `imageRenderer` prop', t => {
	const option = {value: 'bar'};
	const component = shallow(<CurrencySelectOption {...option}/>);
	const Component = component.prop('imageRenderer');
	const imageRenderer = shallow(<Component/>);
	t.is(imageRenderer.type(), CurrencyIcon);
	t.is(imageRenderer.prop('symbol'), option.value);
	t.is(imageRenderer.prop('size'), '20');
});
