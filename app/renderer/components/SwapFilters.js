import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import title from 'title';
import moment from 'moment';
import DateInput from 'components/DateInput';
import Select from 'components/Select';
import {translate} from '../translate';
import './SwapFilters.scss';

const t = translate('swap');

const getFromDate = swaps => {
	const oldestSwap = swaps.reduce((timeStarted, swap) => swap.timeStarted < timeStarted ? swap.timeStarted : timeStarted, Date.now());
	const yearAgo = moment().startOf('day').subtract(1, 'year').valueOf();

	return new Date((oldestSwap > yearAgo ? oldestSwap : yearAgo));
};

class SwapFilters extends React.Component {
	state = {
		dateFrom: getFromDate(this.props.swaps),
		dateTo: new Date(),
		pair: null,
		type: null,
	};

	dateToInput = React.createRef();

	filterSwap = swap => {
		const {dateFrom, dateTo, pair, type} = this.state;

		if (pair) {
			const [baseCurrency, quoteCurrency] = pair.split('/');

			if (swap.baseCurrency !== baseCurrency || swap.quoteCurrency !== quoteCurrency) {
				return false;
			}
		}

		if (type && swap.orderType !== type) {
			return false;
		}

		if (dateFrom && swap.timeStarted < dateFrom.getTime()) {
			return false;
		}

		if (dateTo && swap.timeStarted > dateTo.getTime()) {
			return false;
		}

		return true;
	}

	handleDateChange = (value, modifiers, input) => {
		this.setState({[input.props.name]: value});
	}

	handleSelectChange = field => selectedOption => {
		this.setState({[field]: selectedOption === null ? selectedOption : selectedOption.value});
	}

	render() {
		const {children, swaps} = this.props;
		const {dateFrom, dateTo} = this.state;
		const modifiers = {
			start: dateFrom,
			end: dateTo,
			startAfter: day => moment(day).isSame(moment(dateFrom).add(1, 'day'), 'day'),
			endBefore: day => moment(day).isSame(moment(dateTo).subtract(1, 'day'), 'day'),
		};
		const selectFilters = [
			{
				name: 'pair',
				searchable: true,
				options: _.uniqBy(swaps, swap => `${swap.baseCurrency}${swap.quoteCurrency}`).map(swap => {
					const pair = `${swap.baseCurrency}/${swap.quoteCurrency}`;

					return {
						label: pair,
						value: pair,
					};
				}),
			},
			{
				name: 'type',
				searchable: false,
				options: _.uniqBy(swaps, 'orderType').map(swap => ({
					label: title(swap.orderType),
					value: swap.orderType,
				})),
			},
		];

		return (
			<React.Fragment>
				<div className="SwapFilters">
					<div className="SwapFilters__section">
						<label>{t('filter.date')}:</label>
						<DateInput
							autoCorrect
							name="dateFrom"
							placeholder={`${t('filter.dateFrom')}...`}
							value={dateFrom}
							dayPickerProps={{
								disabledDays: {after: dateTo},
								modifiers,
								month: dateFrom || dateTo,
								numberOfMonths: 2,
								pagedNavigation: true,
								selectedDays: [dateFrom || dateTo, {from: dateFrom, to: dateTo}],
								toMonth: dateTo,
								onDayClick: () => {
									this.dateToInput.current.getInput().focus();
								},
							}}
							onDayChange={this.handleDateChange}
						/>
						{' - '}
						<DateInput
							ref={this.dateToInput}
							autoCorrect
							name="dateTo"
							placeholder={`${t('filter.dateTo')}...`}
							value={dateTo}
							dayPickerProps={{
								disabledDays: {after: new Date(), before: dateFrom},
								fromMonth: dateFrom,
								modifiers,
								month: dateFrom || dateTo,
								numberOfMonths: 2,
								pagedNavigation: true,
								selectedDays: [dateFrom || dateTo, {from: dateFrom, to: dateTo}],
								toMonth: new Date(),
							}}
							onDayChange={this.handleDateChange}
						/>
					</div>
					{selectFilters.map(filter => (
						<div key={filter.name} className="SwapFilters__section">
							<label>{t(`filter.${filter.name}`)}:</label>
							<Select
								clearable
								options={filter.options}
								searchable={filter.searchable}
								value={this.state[filter.name]}
								onChange={this.handleSelectChange(filter.name)}
							/>
						</div>
					))}
				</div>
				{children(this.props.swaps.filter(swap => this.filterSwap(swap)))}
			</React.Fragment>
		);
	}
}

SwapFilters.propTypes = {
	children: PropTypes.func,
	swaps: PropTypes.arrayOf(PropTypes.object),
};

SwapFilters.defaultProps = {
	children: () => {},
	swaps: [],
};

export default SwapFilters;
