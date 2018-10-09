import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import Image from 'components/Image';

test('render `img`', t => {
	const component = shallow(<Image/>);
	t.is(component.type(), 'img');
});

test('pass `props`', t => {
	const foo = 'foo';
	const component = shallow(<Image foo={foo}/>);
	t.is(component.prop('foo'), foo);
});

test('has `url` prop', t => {
	const url = 'foo';
	const component = shallow(<Image url={url}/>);
	t.is(component.prop('src'), url);
});

test('set `src` on target when `fallbackUrl` is defined', t => {
	const currentTarget = {};
	const fallbackUrl = 'foo';
	const component = shallow(<Image fallbackUrl={fallbackUrl}/>);
	component.simulate('error', {currentTarget});
	t.is(currentTarget.src, fallbackUrl);
});

test('hide target when `fallbackUrl` isn\'t defined', t => {
	const currentTarget = {style: {}};
	const component = shallow(<Image/>);
	component.simulate('error', {currentTarget});
	t.is(currentTarget.style.visibility, 'hidden');
});
