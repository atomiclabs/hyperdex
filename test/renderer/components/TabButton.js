import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import TabButton from 'components/TabButton';

test('render `span`', t => {
	const component = shallow(<TabButton isActive onClick={() => {}}>0</TabButton>);
	t.is(component.type(), 'span');
});

test('set `role` prop', t => {
	const component = shallow(<TabButton isActive onClick={() => {}}>0</TabButton>);
	t.is(component.prop('role'), 'button');
});

test('set `className` prop', t => {
	const component = shallow(<TabButton isActive onClick={() => {}}>0</TabButton>);
	t.true(component.prop('className').includes('TabButton'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<TabButton isActive foo={foo} onClick={() => {}}>0</TabButton>);
	t.is(component.prop('foo'), foo);
});

test('has `isActive` prop', t => {
	const component = shallow(<TabButton isActive onClick={() => {}}>0</TabButton>);
	t.true(component.prop('className').includes('active'));
});

test('has `className` prop', t => {
	const className = 'foo';
	const component = shallow(<TabButton isActive className={className} onClick={() => {}}>0</TabButton>);
	t.true(component.prop('className').includes(className));
});
