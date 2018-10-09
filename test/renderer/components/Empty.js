import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Empty from 'components/Empty';

test('render `null`', t => {
	const component = shallow(<Empty/>);
	t.is(component.type(), null);
});

test('render `div` when `show` is `true`', t => {
	const component = shallow(<Empty show/>);
	t.is(component.type(), 'div');
});

test('set `className` prop', t => {
	const component = shallow(<Empty show/>);
	t.is(component.prop('className'), 'Empty');
});

test('render `text`', t => {
	const text = 'foo';
	const component = shallow(<Empty show text={text}/>);
	t.is(component.find('p').text(), text);
});
