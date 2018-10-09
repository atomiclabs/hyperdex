import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import {stub} from 'sinon';
import CopyButton from 'components/CopyButton';
import Tooltip from 'components/Tooltip';

const t = stub();
const translate = stub();

translate.withArgs('common').returns(t);
t.withArgs('copy').returns('copy');
t.withArgs('copied').returns('copied');

const CopyIconButton = proxyquire.noCallThru()('../../../app/renderer/components/CopyIconButton', {
	'../../../app/renderer/translate': {
		translate,
	},
}).default;

test('render `Tooltip`', t => {
	const component = shallow(<CopyIconButton/>);
	t.is(component.type(), Tooltip);
});

test('render `CopyButton` and pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<CopyIconButton foo={foo}/>);
	t.is(component.find(CopyButton).length, 1);
	t.is(component.find(CopyButton).prop('foo'), foo);
});

test('set `content` prop when `isCopied` is `false`', t => {
	const component = shallow(<CopyIconButton/>);
	t.false(component.state('isCopied'));
	t.is(component.prop('content'), 'copy');
});

test('set `content` prop when `isCopied` is `true`', t => {
	const component = shallow(<CopyIconButton/>);
	component.find(CopyButton).simulate('click');
	t.true(component.state('isCopied'));
	t.is(component.prop('content'), 'copied');
});

test('set `onClose` prop', t => {
	const component = shallow(<CopyIconButton/>);
	component.find(CopyButton).simulate('click');
	t.true(component.state('isCopied'));
	component.simulate('close');
	t.false(component.state('isCopied'));
});
