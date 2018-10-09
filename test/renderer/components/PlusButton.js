import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import PlusButton from 'components/PlusButton';
import PlusIcon from 'icons/Plus';

test('render `button`', t => {
	const component = shallow(<PlusButton/>);
	t.is(component.type(), 'button');
});

test('render `PlusIcon`', t => {
	const component = shallow(<PlusButton/>);
	t.is(component.find(PlusIcon).length, 1);
	t.is(component.find(PlusIcon).prop('size'), '7px');
});

test('set `type` prop', t => {
	const component = shallow(<PlusButton/>);
	t.is(component.prop('type'), 'button');
});

test('set `className` prop', t => {
	const component = shallow(<PlusButton/>);
	t.true(component.prop('className').includes('PlusButton'));
});

test('has `className` prop', t => {
	const className = 'foo';
	const component = shallow(<PlusButton className={className}/>);
	t.true(component.prop('className').includes(className));
});
