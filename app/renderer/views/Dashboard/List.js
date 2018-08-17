import {remote} from 'electron';
import React from 'react';
import roundTo from 'round-to';
import _ from 'lodash';
import appContainer from 'containers/App';
import settingsContainer from 'containers/Settings';
import dashboardContainer from 'containers/Dashboard';
import CurrencyIcon from 'components/CurrencyIcon';
import Avatar from 'components/Avatar';
import Input from 'components/Input';
import Progress from 'components/Progress';
import PlusIcon from 'icons/Plus';
import {formatCurrency} from '../../util';
import {translate} from '../../translate';
import './List.scss';

const config = remote.require('./config');
const t = translate('dashboard');

const handleCurrencies = currencies => {
	const {state} = dashboardContainer;

	if (state.listSearchQuery) {
		currencies = currencies.filter(currency => {
			return `${currency.name} ${currency.symbol}`
				.toLowerCase()
				.includes(state.listSearchQuery.toLowerCase());
		});
	}

	return _.orderBy(currencies, ['cmcBalanceUsd', 'balance'], ['desc', 'desc']);
};

const List = () => {
	const {state: appState} = appContainer;
	const {state} = dashboardContainer;
	const {currencies} = appState;
	const filteredCurrencies = handleCurrencies(currencies);
	const showAddCurrency = !config.get('hasChangedCurrencies');

	return (
		<div className="Dashboard--List">
			<div className="top">
				<div
					className={`coin-button ${state.activeView === 'Portfolio' ? 'active' : ''}`}
					onClick={() => dashboardContainer.setActiveView('Portfolio')}
				>
					<div className="left">
						<div className="avatar-wrapper">
							<Avatar/>
						</div>
					</div>
					<div className="right">
						<h3>{appState.portfolio.name}</h3>
						<p>{dashboardContainer.assetCount} ≈ {dashboardContainer.totalAssetValueFormatted}</p>
					</div>
				</div>
				{showAddCurrency && (
					<div className="add-currencies">
						<div className="button" onClick={() => {
							settingsContainer.setIsUpdatingCurrencies(true);
							appContainer.setActiveView('Settings');
						}}
						>
							<h2>{t('list.addCurrency')} <PlusIcon size="8px"/></h2>
							<p>{t('list.addCurrencyDescription')}</p>
						</div>
					</div>
				)}
			</div>
			<div className="center">
				{(() => (
					filteredCurrencies.map(currency => {
						let balance = `${roundTo(currency.balance, 8)} ≈ ${formatCurrency(currency.cmcBalanceUsd)}`;

						if (currency.balance === 0) {
							balance = t('list.emptyWallet');
						}

						let percentageOfTotalBalance = currency.cmcBalanceUsd / dashboardContainer.totalAssetValue;
						if (Number.isNaN(percentageOfTotalBalance)) {
							percentageOfTotalBalance = 0;
						}

						return (
							<div
								key={currency.symbol}
								className={`coin-button ${state.activeView === currency.symbol ? 'active' : ''}`}
								onClick={() => dashboardContainer.setActiveView(currency.symbol)}
							>
								<div className="left">
									<CurrencyIcon symbol={currency.symbol} size="38"/>
								</div>
								<div className="right">
									<h2>{currency.name} ({currency.symbol})</h2>
									<p>{balance}</p>
									<Progress value={percentageOfTotalBalance} showLabel hideWhenZero/>
								</div>
							</div>
						);
					})
				))()}
			</div>
			{currencies.length > 5 &&
				<div className="bottom">
					<Input
						placeholder={t('list.search')}
						value={state.listSearchQuery}
						onChange={dashboardContainer.setListSearchQuery}
						onBlur={() => {
							if (filteredCurrencies.length === 0) {
								dashboardContainer.setListSearchQuery('');
							}
						}}
						onKeyDown={event => {
							if (event.key === 'Escape') {
								dashboardContainer.setListSearchQuery('');
							}
						}}
						view={() => (
							<img src="/assets/search-icon.svg" width="12" height="12"/>
						)}
					/>
				</div>
			}
		</div>
	);
};

export default List;
