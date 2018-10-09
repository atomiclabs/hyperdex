import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Link from 'components/Link';

test('render `a`', t => {
	const component = shallow(<Link/>);
	t.is(component.type(), 'a');
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<Link foo={foo}/>);
	t.is(component.prop('foo'), foo);
});

test('set `className`', t => {
	const component = shallow(<Link/>);
	t.true(component.prop('className').includes('Link'));
});

test('has `className` prop', t => {
	const className = 'foo';
	const component = shallow(<Link className={className}/>);
	t.true(component.prop('className').includes(className));
});
