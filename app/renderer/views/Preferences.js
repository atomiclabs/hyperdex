import electron from 'electron';
import React from 'react';
import _ from 'lodash';
import coinlist from 'coinlist';
import Input from 'components/Input';
import CurrencyIcon from 'components/CurrencyIcon';
import supportedCurrencies from '../../marketmaker/supported-currencies';
import TabView from './TabView';
import './Preferences.scss';

const config = electron.remote.require('./config');

class Form extends React.Component {
	state = {
		marketmakerUrl: config.get('marketmakerUrl') || '',
		enabledCoins: config.get('enabledCoins') || [],
	};

	persistState = _.debounce((name, value) => {
		config.set(name, value);
	}, 500);

	handleChange = (value, event) => {
		const {name} = event.target;
		this.setState({[name]: value});
		this.persistState(name, value);
	};

	toggleCurrency = (value, event) => {
		const {checked} = event.target;

		this.setState(prevState => {
			const enabledCoins = checked ?
				[...prevState.enabledCoins, value] :
				prevState.enabledCoins.filter(coin => coin !== value);

			this.persistState('enabledCoins', enabledCoins);

			return {enabledCoins};
		});
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
				<div className="form-group">
					<label>
						Enabled Currencies:
					</label>
					{supportedCurrencies
						.filter(currency => currency.coin !== 'KMD')
						.map(currency => (
							<label key={currency.coin} style={{display: 'block'}}>
								<CurrencyIcon symbol={currency.coin}/>
								{(coinlist.get(currency.coin, 'name') || currency.coin)} ({currency.coin})
								<Input
									type="checkbox"
									value={currency.coin}
									checked={this.state.enabledCoins.includes(currency.coin)}
									onChange={this.toggleCurrency}
								/>
							</label>
						))
					}
				</div>
			</React.Fragment>
		);
	}
}

const Preferences = () => (
	<TabView title="Preferences" className="Preferences">
		<header>
			<h2>Preferences</h2>
		</header>
		<main>
			<Form/>
		</main>
	</TabView>
);

export default Preferences;
