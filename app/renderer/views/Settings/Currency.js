import React from 'react';
import _ from 'lodash';
import appContainer from 'containers/App';
import CurrencySelectOption from 'components/CurrencySelectOption';
import Select from 'components/Select';
import {getCurrencySymbols, getCurrencyName} from '../../../marketmaker/supported-currencies';
import {isDevelopment} from '../../../util-common';
import {alwaysEnabledCurrencies} from '../../../constants';
import {translate} from '../../translate';

const t = translate('settings');

class CurrencySetting extends React.Component {
	handleSelectChange = options => {
		const enabledCurrencies = appContainer.state.enabledCoins;
		const newCurrencies = options.map(x => x.value);

		// We have to do our own diffing as `react-select` just returns the new `value` array
		const [added] = _.difference(newCurrencies, enabledCurrencies);
		if (added) {
			appContainer.enableCurrency(added);
		} else {
			const [removed] = _.difference(enabledCurrencies, newCurrencies);
			appContainer.disableCoin(removed);
		}
	};

	render() {
		const excludedCurrencies = isDevelopment ? [] : ['PIZZA', 'BEER'];
		const currencySymbols = _.without(getCurrencySymbols(), ...excludedCurrencies);

		const selectData = currencySymbols.map(symbol => ({
			label: `${getCurrencyName(symbol)} (${symbol})`,
			value: symbol,
			clearableValue: !alwaysEnabledCurrencies.includes(symbol),
		}));

		return (
			<div className="form-group">
				<label>
					{t('enabledCurrencies')}
				</label>
				<Select
					className="enabled-currencies"
					multi
					searchable
					value={appContainer.state.enabledCoins}
					options={selectData}
					onChange={this.handleSelectChange}
					valueRenderer={CurrencySelectOption}
					optionRenderer={CurrencySelectOption}
				/>
			</div>
		);
	}
}

export default CurrencySetting;
