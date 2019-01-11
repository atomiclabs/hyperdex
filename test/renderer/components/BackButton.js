import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import BackButton from '../../../app/renderer/components/BackButton';

test('render `button`', t => {
	const component = shallow(<BackButton/>);
	t.is(component.type(), 'button');
});

test('set `type` prop', t => {
	const component = shallow(<BackButton/>);
	t.is(component.prop('type'), 'button');
});

test('set `className` prop', t => {
	const component = shallow(<BackButton/>);
	t.true(component.prop('className').includes('BackButton'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<BackButton foo={foo}/>);
	t.is(component.prop('foo'), foo);
});

test('has `className` prop', t => {
	const className = 'foo';
	const component = shallow(<BackButton className={className}/>);
	t.true(component.prop('className').includes(className));
});
