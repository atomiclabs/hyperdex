import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import View from 'components/View';

const activeView = 'foo';
const AppView = proxyquire.noCallThru()('../../../app/renderer/components/AppView', {
	'../../../app/renderer/containers/App': {
		state: {
			activeView,
		},
	},
}).default;

test('render `View`', t => {
	const component = shallow(<AppView/>);
	t.is(component.type(), View);
});

test('set `activeView`', t => {
	const component = shallow(<AppView/>);
	t.is(component.prop('activeView'), activeView);
});

test('set `component`', t => {
	const div = <div/>;
	const component = shallow(<AppView component={div}/>);
	t.is(component.prop('component'), div);
});
