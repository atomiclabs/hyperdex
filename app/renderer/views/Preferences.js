import electron from 'electron';
import React from 'react';
import _ from 'lodash';
import coinlist from 'coinlist';
import {Subscribe} from 'unstated';
import appContainer from 'containers/App';
import Input from 'components/Input';
import CurrencySelectOption from 'components/CurrencySelectOption';
import Select from 'components/Select';
import {supportedCurrencies} from '../../marketmaker/supported-currencies';
import TabView from './TabView';
import './Preferences.scss';

const config = electron.remote.require('./config');

class CurrencySelection extends React.Component {
	handleSelectChange = options => {
		const enabledCurrencies = appContainer.state.enabledCoins;
		const newCurrencies = options.map(x => x.value);

		// We have to do our own diffing as `react-select` just returns the new `value` array
		const [added] = _.difference(newCurrencies, enabledCurrencies);
		if (added) {
			appContainer.enableCoin(added);
		} else {
			const [removed] = _.difference(enabledCurrencies, newCurrencies);
			appContainer.disableCoin(removed);
		}
	};

	render() {
		const selectData = _.orderBy(supportedCurrencies, ['coin']).map(currency => ({
			label: `${coinlist.get(currency.coin, 'name') || currency.coin} (${currency.coin})`,
			value: currency.coin,
			clearableValue: !['KMD', 'CHIPS'].includes(currency.coin),
		}));

		return (
			<div className="form-group">
				<label>
					Enabled Currencies:
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

class Form extends React.Component {
	state = {
		marketmakerUrl: config.get('marketmakerUrl') || '',
	};

	persistState = _.debounce((name, value) => {
		config.set(name, value);
	}, 500);

	handleChange = (value, event) => {
		const {name} = event.target;
		this.setState({[name]: value});
		this.persistState(name, value);
	};

	render() {
		return (
			<React.Fragment>
				<div className="form-group">
					<label htmlFor="marketmakerUrl">
						Custom Marketmaker URL: <small>(Requires app restart)</small>
					</label>
					<Input
						name="marketmakerUrl"
						value={this.state.marketmakerUrl}
						onChange={this.handleChange}
						placeholder="Example: http://localhost:7783"
					/>
				</div>
				<CurrencySelection/>
			</React.Fragment>
		);
	}
}

const Preferences = () => (
	<Subscribe to={[appContainer]}>
		{() => (
			<TabView title="Preferences" className="Preferences">
				<header>
					<h2>Preferences</h2>
				</header>
				<main>
					<Form/>
				</main>
			</TabView>
		)}
	</Subscribe>
);

export default Preferences;
