import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import delay from 'delay';
import proxyquire from 'proxyquire';
import {spy, stub} from 'sinon';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {formatDate, parseDate} from 'react-day-picker/moment';

const language = 'foo';
const setInputValue = spy();

const dateInput = proxyquire.noCallThru()('../../../app/renderer/components/DateInput', {
	'../../../app/renderer/translate': {
		instance: {
			language,
		},
	},
	'../../../app/renderer/util': {
		setInputValue,
	},
});

const {default: DateInput, WrappedInput} = dateInput;

test('render `DayPickerInput`', t => {
	const component = shallow(<DateInput/>).dive();
	t.is(component.type(), DayPickerInput);
});

test('set `component` prop', t => {
	const component = shallow(<DateInput/>).dive();
	t.is(component.prop('component'), WrappedInput);
});

test('set `format` prop', t => {
	const component = shallow(<DateInput/>).dive();
	t.is(component.prop('format'), 'YYYY-MM-DD');
});

test('set `formatDate` prop', t => {
	const component = shallow(<DateInput/>).dive();
	t.is(component.prop('formatDate'), formatDate);
});

test('set `parseDate` prop', t => {
	const component = shallow(<DateInput/>).dive();
	t.is(component.prop('parseDate'), parseDate);
});

test('set `dayPickerProps` prop', t => {
	const dayPickerProps = {foo: 'foo'};
	const component = shallow(<DateInput dayPickerProps={dayPickerProps}/>).dive();
	t.deepEqual(component.prop('dayPickerProps'), {
		...dayPickerProps,
		locale: language,
		localeUtils: MomentLocaleUtils,
	});
});

test('has `autoCorrect` prop', async t => {
	const value = 'foo';
	const invalidValue = 'bar';
	const locale = 'locale';
	const format = 'format';
	const formatDate = stub().returns(value);
	const ref = {current: {props: {dayPickerProps: {locale}, format, formatDate}, getInput: () => ({value: invalidValue})}};
	const modifiers = {disabled: true};
	const onDayChange = spy();
	const event = {target: 'unicorn', persist: () => {}};
	const component = shallow(<DateInput autoCorrect ref={ref} value={value} onDayChange={onDayChange}/>).dive();
	const input = component.dive().find(WrappedInput);
	component.simulate('dayChange', invalidValue, modifiers, ref.current);
	input.simulate('blur', event);
	await delay(600);
	t.true(onDayChange.calledWith(invalidValue, modifiers, ref.current));
	t.true(formatDate.calledWith(component.state('value'), format, locale));
	t.true(setInputValue.calledWith(event.target, value));
});
