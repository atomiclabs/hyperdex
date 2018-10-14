import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import TabButton from 'components/TabButton';

test('render `span`', t => {
	const tabButton = shallow(<TabButton/>);
	t.is(tabButton.type(), 'span');
});

test('set `role` prop', t => {
	const tabButton = shallow(<TabButton/>);
	t.is(tabButton.prop('role'), 'button');
});

test('set `className` prop', t => {
	const tabButton = shallow(<TabButton/>);
	t.true(tabButton.prop('className').includes('TabButton'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const tabButton = shallow(<TabButton foo={foo}/>);
	t.is(tabButton.prop('foo'), foo);
});

test('has `isActive` prop', t => {
	const tabButton = shallow(<TabButton isActive/>);
	t.true(tabButton.prop('className').includes('active'));
});

test('has `className` prop', t => {
	const className = 'foo';
	const tabButton = shallow(<TabButton className={className}/>);
	t.true(tabButton.prop('className').includes(className));
});
