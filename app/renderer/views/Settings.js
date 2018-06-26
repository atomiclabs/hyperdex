import electron from 'electron';
import React from 'react';
import _ from 'lodash';
import {Subscribe} from 'unstated';
import {Trans} from 'react-i18next';
import appContainer from 'containers/App';
import CurrencySelectOption from 'components/CurrencySelectOption';
import Select from 'components/Select';
import Link from 'components/Link';
import {getCurrencySymbols, getCurrencyName} from '../../marketmaker/supported-currencies';
import {isDevelopment} from '../../util-common';
import {alwaysEnabledCurrencies} from '../../constants';
import {instance, translate} from '../translate';
import TabView from './TabView';
import './Settings.scss';

const config = electron.remote.require('./config');
const t = translate('settings');

class CurrencySelection extends React.Component {
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

class Settings extends React.Component {
	state = {};

	persistState = _.debounce((name, value) => {
		config.set(name, value);
	}, 500);

	handleChange = (value, event) => {
		const {name} = event.target;
		this.setState({[name]: value});
		this.persistState(name, value);
	};

	handleLogOutLinkClick = () => {
		appContainer.logOut({
			activeView: 'AppSettings',
		});
	};

	render() {
		return (
			<Subscribe to={[appContainer]}>
				{() => (
					<TabView title="Settings" className="Settings">
						<header>
							<h2>{t('title')}</h2>
						</header>
						<main>
							<div className="section">
								<h3>{t('portfolio')}</h3>
								<CurrencySelection/>
							</div>
							<div className="section">
								<h3>{t('app')}</h3>
								<Trans i18n={instance} i18nKey="logOutAppSettings" t={t}>
									<p><Link onClick={this.handleLogOutLinkClick}>Log out</Link> to see app settings.</p>
								</Trans>
							</div>
						</main>
					</TabView>
				)}
			</Subscribe>
		);
	}
}

export default Settings;
