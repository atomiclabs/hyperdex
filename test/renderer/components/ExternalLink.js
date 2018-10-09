import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import {spy} from 'sinon';
import Link from 'components/Link';

const openExternal = spy();
const ExternalLink = proxyquire.noCallThru()('../../../app/renderer/components/ExternalLink', {
	electron: {
		shell: {
			openExternal,
		},
	},
}).default;

test('render `Link`', t => {
	const component = shallow(<ExternalLink/>);
	t.is(component.type(), Link);
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<ExternalLink foo={foo}/>);
	t.is(component.prop('foo'), foo);
});

test('has `url` prop', t => {
	const url = 'foo';
	const component = shallow(<ExternalLink url={url}/>);
	component.simulate('click');
	t.true(openExternal.calledWith(url));
});
