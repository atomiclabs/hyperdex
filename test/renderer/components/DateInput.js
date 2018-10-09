import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {formatDate, parseDate} from 'react-day-picker/moment';

const language = 'foo';

const dateInput = proxyquire.noCallThru()('../../../app/renderer/components/DateInput', {
	'../../../app/renderer/translate': {
		instance: {
			language,
		},
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
