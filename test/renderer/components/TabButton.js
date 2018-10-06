import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import TabButton from '../../../app/renderer/components/TabButton';

test('render `span`', t => {
	const m = shallow(<TabButton/>);
	t.is(m.type(), 'span');
});

test('has `role` prop', t => {
	const m = shallow(<TabButton/>);
	t.is(m.prop('role'), 'button');
});

test('set `className` prop', t => {
	const m = shallow(<TabButton/>);
	t.true(m.prop('className').includes('TabButton'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const m = shallow(<TabButton foo={foo}/>);
	t.is(m.prop('foo'), foo);
});

test('has `active` className', t => {
	const m = shallow(<TabButton active/>);
	t.true(m.prop('className').includes('active'));
});

test('has `className` prop', t => {
	const className = 'foo';
	const m = shallow(<TabButton className={className}/>);
	t.true(m.prop('className').includes(className));
});
