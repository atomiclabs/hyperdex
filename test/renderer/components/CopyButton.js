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
	const m = shallow(<CopyButton/>);
	t.is(m.type(), 'button');
});

test('set `type` prop', t => {
	const m = shallow(<CopyButton/>);
	t.is(m.prop('type'), 'button');
});

test('set `className` prop', t => {
	const m = shallow(<CopyButton/>);
	t.true(m.prop('className').includes('CopyButton'));
});

test('pass `props`', t => {
	const foo = 'foo';
	const m = shallow(<CopyButton foo={foo}/>);
	t.is(m.prop('foo'), foo);
});

test('has `className` prop', t => {
	const className = 'foo';
	const m = shallow(<CopyButton className={className}/>);
	t.true(m.prop('className').includes(className));
});

test('has `onClick` prop', t => {
	const event = {};
	const value = 'foo';
	const onClick = spy();
	const m = shallow(<CopyButton onClick={onClick} value={value}/>);
	m.simulate('click', event);
	t.true(onClick.calledWith(event));
	t.true(writeText.calledWith(value));
});
