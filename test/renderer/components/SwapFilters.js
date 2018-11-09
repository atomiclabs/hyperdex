import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import proxyquire from 'proxyquire';
import {spy, stub} from 'sinon';
import moment from 'moment';
import Select from 'components/Select';

const t = stub();
const translate = stub().withArgs('swap').returns(t);

t.withArgs('filter.dateFrom').returns('dateFrom');
t.withArgs('filter.dateTo').returns('dateTo');

const DateInput = proxyquire.noCallThru()('../../../app/renderer/components/DateInput', {
	'../../../app/renderer/translate': {
		instance: {},
	},
	'../../../app/renderer/util': {
		setInputValue: () => {},
	},
}).default;

const SwapFilters = proxyquire.noCallThru()('../../../app/renderer/components/SwapFilters', {
	'../../../app/renderer/components/DateInput': DateInput,
	'../../../app/renderer/translate': {
		translate,
	},
}).default;

test('render `React.Fragment`', t => {
	const component = shallow(<SwapFilters/>);
	t.is(component.type(), React.Fragment);
});

test('render `DateInput`', t => {
	const filters = ['dateFrom', 'dateTo'];
	const component = shallow(<SwapFilters/>);
	const inputs = component.find(DateInput);

	t.is(inputs.length, filters.length);

	inputs.forEach((input, index) => {
		t.truthy(input.prop('dayPickerProps'));
		t.is(input.prop('name'), filters[index]);
		t.is(input.prop('placeholder'), `${filters[index]}...`);
		t.is(input.prop('value'), component.state(filters[index]));
		t.is(input.prop('onDayChange'), component.instance().handleDateChange);
	});
});

test('render `Select`', t => {
	const filters = ['pair', 'type'];
	const component = shallow(<SwapFilters/>);
	const selects = component.find(Select);

	t.is(selects.length, filters.length);

	selects.forEach((select, index) => {
		t.true(select.prop('clearable'));
		t.truthy(select.prop('onChange'));
		t.is(select.prop('value'), component.state(filters[index]));
	});
});

test('set initial `state`', t => {
	const yearAgo = moment().startOf('day').valueOf();
	const timeStarted = moment().startOf('day').valueOf();
	const swaps = [{
		baseCurrency: 'FOO',
		quoteCurrency: 'BAR',
		orderType: 'buy',
		timeStarted,
	}];
	const component = shallow(<SwapFilters swaps={swaps}/>);
	const {dateFrom, dateTo, pair, type} = component.state();
	t.is(dateFrom.getTime(), timeStarted);
	t.is(moment(dateTo).startOf('day').valueOf(), moment().startOf('day').valueOf());
	t.is(pair, null);
	t.is(type, null);
	component.setProps({swaps: []});
	t.is(moment(dateFrom).startOf('day').valueOf(), yearAgo);
});

test('return filtered `swaps` as `children`', t => {
	const dateFrom = new Date('2019-01-01Z');
	const swaps = [{
		baseCurrency: 'FOO',
		quoteCurrency: 'BAR',
		orderType: 'buy',
		timeStarted: Date.parse('2018-01-01Z'),
	}];
	const children = spy();
	const component = shallow(<SwapFilters swaps={swaps}>{children}</SwapFilters>);

	component.find(DateInput).at(0).simulate('dayChange', dateFrom, null, {
		props: {
			name: 'dateFrom',
		},
	});

	t.is(component.state('dateFrom'), dateFrom);
	t.is(children.callCount, 2);
	t.true(children.withArgs(swaps).calledOnce);
	t.true(children.withArgs([]).calledOnce);
});
