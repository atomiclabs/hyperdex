import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import {spy} from 'sinon';
import BackButton from 'components/BackButton';

const setActiveView = spy();
const setProgress = spy();
const LoginBackButton = proxyquire.noCallThru()('../../../app/renderer/components/LoginBackButton', {
	'../../../app/renderer/containers/Login': {
		setActiveView,
		setProgress,
	},
}).default;

test('render `BackButton`', t => {
	const component = shallow(<LoginBackButton/>);
	t.is(component.type(), BackButton);
});

test('set `onClick` prop', t => {
	const view = 'foo';
	const progress = 'bar';
	const component = shallow(<LoginBackButton view={view} progress={progress}/>);
	component.simulate('click');
	t.true(setActiveView.calledWith(view));
	t.true(setProgress.calledWith(progress));
});

test('has `className` prop', t => {
	const className = 'foo';
	const component = shallow(<LoginBackButton className={className}/>);
	t.true(component.prop('className').includes(className));
});
