import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import NativeSelect from 'components/NativeSelect';

test('render `div`', t => {
	const component = shallow(<NativeSelect/>);
	t.is(component.type(), 'div');
});

test('render `select` and pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<NativeSelect foo={foo}/>);
	t.is(component.find('select').length, 1);
	t.is(component.find('select').prop('foo'), foo);
});

test('set `className` prop', t => {
	const component = shallow(<NativeSelect/>);
	t.is(component.prop('className'), 'NativeSelect');
});
