import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import avatar from '../../../app/renderer/avatar';

const id = 'foo';
const Avatar = proxyquire.noCallThru()('../../../app/renderer/components/Avatar', {
	'../../../app/renderer/containers/App': {
		state: {
			portfolio: {
				id,
			},
		},
	},
}).default;

test('render `img`', t => {
	const component = shallow(<Avatar/>);
	t.is(component.type(), 'img');
});

test('set `src` prop', t => {
	const component = shallow(<Avatar/>);
	t.is(component.prop('src'), avatar(id));
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<Avatar foo={foo}/>);
	t.is(component.prop('foo'), foo);
});
