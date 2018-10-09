import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import {spy} from 'sinon';

const writeText = spy();
const CopyButton = proxyquire.noCallThru()('../../../app/renderer/components/CopyButton', {
	electron: {
		clipboard: {
			writeText,
		},
	},
}).default;

test('render `button`', t => {
	const component = shallow(<CopyButton/>);
	t.is(component.type(), 'button');
});

test('set `type` prop', t => {
	const component = shallow(<CopyButton/>);
	t.is(component.prop('type'), 'button');
});

test('set `className` prop', t => {
	const component = shallow(<CopyButton/>);
	t.true(component.prop('className').includes('CopyButton'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<CopyButton foo={foo}/>);
	t.is(component.prop('foo'), foo);
});

test('has `className` prop', t => {
	const className = 'foo';
	const component = shallow(<CopyButton className={className}/>);
	t.true(component.prop('className').includes(className));
});

test('has `onClick` prop', t => {
	const event = {};
	const value = 'foo';
	const onClick = spy();
	const component = shallow(<CopyButton onClick={onClick} value={value}/>);
	component.simulate('click', event);
	t.true(onClick.calledWith(event));
	t.true(writeText.calledWith(value));
});
