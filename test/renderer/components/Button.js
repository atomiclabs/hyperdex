import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Button from '../../../app/renderer/components/Button';

test('render `button`', t => {
	const m = shallow(<Button/>);
	t.is(m.type(), 'button');
});

test('set `type` prop', t => {
	const m = shallow(<Button/>);
	t.is(m.prop('type'), 'button');
});

test('set `className` prop', t => {
	const m = shallow(<Button/>);
	t.true(m.prop('className').includes('Button'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const m = shallow(<Button foo={foo}/>);
	t.is(m.prop('foo'), foo);
});

test('has `className` prop', t => {
	const className = 'foo';
	const m = shallow(<Button className={className}/>);
	t.true(m.prop('className').includes(className));
});

test('has `primary` prop', t => {
	const m = shallow(<Button primary/>);
	t.true(m.prop('className').includes('Button--primary'));
});

test('has `fullwidth` prop', t => {
	const m = shallow(<Button fullwidth/>);
	t.true(m.prop('className').includes('Button--fullwidth'));
});

test('has `color` prop', t => {
	const color = 'foo';
	const m = shallow(<Button color={color}/>);
	t.true(m.prop('className').includes(`Button--${color}`));
});

test('has `disabled` prop', t => {
	const m = shallow(<Button disabled/>);
	t.true(m.prop('className').includes('Button--disabled'));
});
