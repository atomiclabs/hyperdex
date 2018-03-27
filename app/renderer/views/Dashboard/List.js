import React from 'react';
import coins from 'coinlist';
import roundTo from 'round-to';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import CurrencyIcon from 'components/CurrencyIcon';
import Avatar from 'components/Avatar';
import {formatCurrency} from '../../util';
import './List.scss';

const List = () => {
	const {state: appState} = appContainer;
	const {state} = dashboardContainer;
	const {currencies} = appState;

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
						<p>{dashboardContainer.assetCount} ≈ {dashboardContainer.totalAssetValue}</p>
					</div>
				</div>
			</div>
			<div className="center">
				{(() => (
					currencies.map(currency => {
						let balance = `${roundTo(currency.balance, 8)} ≈ ${formatCurrency(currency.cmcBalanceUsd)}`;

						if (currency.balance === 0) {
							balance = 'Empty wallet';
						}

						return (
							<div
								key={currency.coin}
								className={`coin-button ${state.activeView === currency.coin ? 'active' : ''}`}
								onClick={() => dashboardContainer.setActiveView(currency.coin)}
							>
								<div className="left">
									<CurrencyIcon symbol={currency.coin}/>
								</div>
								<div className="right">
									<h2>{coins.get(currency.coin, 'name')} ({currency.coin})</h2>
									<p>{balance}</p>
								</div>
							</div>
						);
					})
				))()}
			</div>
			<div className="bottom"/>
		</div>
	);
};

export default List;
