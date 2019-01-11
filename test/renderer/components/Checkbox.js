import test from 'ava';
import React from 'react';
import {spy} from 'sinon';
import {shallow} from 'enzyme';
import Checkbox from '../../../app/renderer/components/Checkbox';

test('render `div`', t => {
	const m = shallow(<Checkbox label="x" value="x"/>);
	t.is(m.dive().type(), 'div');
});

test('forwards `ref`', t => {
	const ref = React.createRef();
	const m = shallow(<Checkbox ref={ref} label="x" value="x"/>);
	t.is(m.prop('forwardedRef'), ref);
});

test('pass `props` to `input`', t => {
	const foo = 'foo';
	const m = shallow(<Checkbox foo={foo} label="x" value="x"/>).dive();
	t.is(m.find('input').prop('foo'), foo);
});

test('set `className` prop', t => {
	const m = shallow(<Checkbox label="x" value="x"/>).dive();
	t.true(m.prop('className').includes('Checkbox'));
});

test('set `type` prop on `input`', t => {
	const m = shallow(<Checkbox label="x" value="x"/>).dive();
	t.is(m.find('input').prop('type'), 'checkbox');
});

test('has `className` prop', t => {
	const className = 'foo';
	const m = shallow(<Checkbox className={className} label="x" value="x"/>).dive();
	t.true(m.prop('className').includes(className));
});

test('has `checked` prop', t => {
	const m = shallow(<Checkbox checked label="x" value="x"/>).dive();
	t.true(m.prop('className').includes('Checkbox--checked'));
});

test('has `disabled` prop', t => {
	const m = shallow(<Checkbox disabled label="x" value="x"/>).dive();
	t.true(m.prop('className').includes('Checkbox--disabled'));
	t.true(m.find('input').prop('disabled'));
});

test('has `value` prop', t => {
	const value = 'foo';
	const m = shallow(<Checkbox label="x" value={value}/>).dive();
	t.is(m.find('input').prop('value'), value);
});

test('has `onChange` prop', t => {
	const event = {};
	const onChange = spy();
	const m = shallow(<Checkbox label="x" value="x" onChange={onChange}/>).dive();
	const checked = m.state('checked');
	m.find('input').simulate('change', event);
	t.true(onChange.calledWith(!checked, event));
	t.is(m.state('checked'), !checked);
});

test('has `label` prop', t => {
	const label = 'foo';
	const m = shallow(<Checkbox label={label} value="x"/>).dive();
	t.is(m.find('.Checkbox__label').text(), label);
});

test('show checkmark icon when `checked` prop is `true`', t => {
	const m = shallow(<Checkbox label="x" value="x"/>).dive();
	m.find('input').simulate('change');
	t.is(m.find('.checkmark-icon').length, 1);
});
