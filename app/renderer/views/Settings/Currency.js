import {remote} from 'electron';
import React from 'react';
import _ from 'lodash';
import appContainer from 'containers/App';
import settingsContainer from 'containers/Settings';
import CurrencySelectOption from 'components/CurrencySelectOption';
import Select from 'components/Select';
import {getCurrencySymbols, getCurrencyName} from '../../../marketmaker/supported-currencies';
import {isDevelopment} from '../../../util-common';
import {alwaysEnabledCurrencies} from '../../../constants';
import {translate} from '../../translate';

const config = remote.require('./config');
const t = translate('settings');

class CurrencySetting extends React.Component {
	wrapperRef = React.createRef();

	selectRef = React.createRef();

	handleSelectChange = options => {
		const enabledCurrencies = appContainer.state.enabledCoins;
		const newCurrencies = options.map(x => x.value);

		config.set('hasChangedCurrencies', true);

		// We have to do our own diffing as `react-select` just returns the new `value` array
		const [added] = _.difference(newCurrencies, enabledCurrencies);
		if (added) {
			appContainer.enableCurrency(added);
		} else {
			const [removed] = _.difference(enabledCurrencies, newCurrencies);
			appContainer.disableCoin(removed);
		}
	};

	componentDidMount() {
		if (settingsContainer.state.isUpdatingCurrencies) {
			this.selectRef.current.focus();
		}
	}

	render() {
		const excludedCurrencies = isDevelopment ? [] : ['RICK', 'MORTY'];
		const currencySymbols = _.without(getCurrencySymbols(), ...excludedCurrencies);
		const {isUpdatingCurrencies} = settingsContainer.state;

		const selectData = currencySymbols.map(symbol => ({
			label: `${getCurrencyName(symbol)} (${symbol})`,
			value: symbol,
			clearableValue: !alwaysEnabledCurrencies.includes(symbol),
		}));

		return (
			<div ref={this.wrapperRef} className="form-group">
				<label>
					{t('enabledCurrencies')}
				</label>
				<Select
					ref={this.selectRef}
					multi
					searchable
					className="enabled-currencies"
					value={appContainer.state.enabledCoins}
					options={selectData}
					valueRenderer={CurrencySelectOption}
					optionRenderer={CurrencySelectOption}
					openOnFocus={isUpdatingCurrencies}
					onChange={this.handleSelectChange}
					onOpen={() => {
						// TODO: This is ugly, but not worth doing better since
						// React Select v2 will soon be out and will be completely different.
						// We can perfect it more then.
						this.wrapperRef.current.scrollIntoView();
					}}
					onClose={() => {
						if (isUpdatingCurrencies) {
							settingsContainer.setIsUpdatingCurrencies(false);
						}
					}}
				/>
			</div>
		);
	}
}

export default CurrencySetting;
