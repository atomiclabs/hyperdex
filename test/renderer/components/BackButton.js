import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import BackButton from '../../../app/renderer/components/BackButton';

test('render `button`', t => {
	const m = shallow(<BackButton/>);
	t.is(m.type(), 'button');
});

test('set `type` prop', t => {
	const m = shallow(<BackButton/>);
	t.is(m.prop('type'), 'button');
});

test('set `className` prop', t => {
	const m = shallow(<BackButton/>);
	t.true(m.prop('className').includes('BackButton'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const m = shallow(<BackButton foo={foo}/>);
	t.is(m.prop('foo'), foo);
});

test('has `className` prop', t => {
	const className = 'foo';
	const m = shallow(<BackButton className={className}/>);
	t.true(m.prop('className').includes(className));
});
