import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Button from 'components/Button';

test('render `button`', t => {
	const component = shallow(<Button/>);
	t.is(component.type(), 'button');
});

test('set `type` prop', t => {
	const component = shallow(<Button/>);
	t.is(component.prop('type'), 'button');
});

test('set `className` prop', t => {
	const component = shallow(<Button/>);
	t.true(component.prop('className').includes('Button'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<Button foo={foo}/>);
	t.is(component.prop('foo'), foo);
});

test('has `className` prop', t => {
	const className = 'foo';
	const component = shallow(<Button className={className}/>);
	t.true(component.prop('className').includes(className));
});

test('has `primary` prop', t => {
	const component = shallow(<Button primary/>);
	t.true(component.prop('className').includes('Button--primary'));
});

test('has `fullwidth` prop', t => {
	const component = shallow(<Button fullwidth/>);
	t.true(component.prop('className').includes('Button--fullwidth'));
});

test('has `color` prop', t => {
	const color = 'foo';
	const component = shallow(<Button color={color}/>);
	t.true(component.prop('className').includes(`Button--${color}`));
});

test('has `disabled` prop', t => {
	const component = shallow(<Button disabled/>);
	t.true(component.prop('className').includes('Button--disabled'));
});
