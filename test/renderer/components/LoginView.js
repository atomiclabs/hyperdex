import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import View from 'components/View';

const activeView = 'foo';
const LoginView = proxyquire.noCallThru()('../../../app/renderer/components/LoginView', {
	'../../../app/renderer/containers/Login': {
		state: {
			activeView,
		},
	},
}).default;

test('render `View`', t => {
	const component = shallow(<LoginView/>);
	t.is(component.type(), View);
});

test('set `activeView`', t => {
	const component = shallow(<LoginView/>);
	t.is(component.prop('activeView'), activeView);
});

test('set `component`', t => {
	const div = <div/>;
	const component = shallow(<LoginView component={div}/>);
	t.is(component.prop('component'), div);
});
