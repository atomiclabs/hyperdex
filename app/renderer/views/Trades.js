import React from 'react';
import PropTypes from 'prop-types';
import {Subscribe} from 'unstated';
import {withState} from 'containers/SuperContainer';
import appContainer from 'containers/App';
import tradesContainer from 'containers/Trades';
import View from 'components/View';
import SwapList from 'components/SwapList';
import SwapFilters from 'components/SwapFilters';
import TabButton from 'components/TabButton';
import {formatCurrency} from '../util';
import {translate} from '../translate';
import AppTabView from './TabView';
import './Exchange/Swaps.scss';
import './Trades.scss';

const t = translate('trades');

const TabView = ({component}) => (
	<View component={component} activeView={tradesContainer.state.activeView}/>
);

TabView.propTypes = {
	component: PropTypes.func.isRequired,
};

const OpenOrders = () => {
	const {state} = appContainer;
	const filteredData = state.swapHistory.filter(swap => swap.isActive);
	return <SwapList swaps={filteredData} showCancel showHeader/>;
};

const TradeHistory = () => {
	const {state} = appContainer;
	const filteredData = state.swapHistory.filter(swap => !swap.isActive);

	return (
		<SwapFilters swaps={filteredData}>
			{swaps => <SwapList swaps={swaps} showCancel showHeader/>}
		</SwapFilters>
	);
};

const Trades = props => (
	<Subscribe to={[tradesContainer]}>
		{() => {
			const {state} = props;
			const {stats} = state;

			return (
				<AppTabView title="Trades" className="Trades">
					<header>
						<nav>
							<TabButton
								isActive={tradesContainer.state.activeView === OpenOrders.name}
								onClick={() => tradesContainer.setActiveView(OpenOrders.name)}
							>
								{t('openOrders')}
							</TabButton>
							<TabButton
								isActive={tradesContainer.state.activeView === TradeHistory.name}
								onClick={() => tradesContainer.setActiveView(TradeHistory.name)}
							>
								{t('tradeHistory')}
							</TabButton>
						</nav>
						<div className="stats">
							{stats &&
								<p>
									{t('stats', {
										count: stats.successfulSwapCount,
										currencyCount: stats.currencyCount,
										totalSwapsWorthInUsd: formatCurrency(stats.totalSwapsWorthInUsd),
									})}
								</p>
							}
						</div>
					</header>
					<main>
						<TabView component={OpenOrders}/>
						<TabView component={TradeHistory}/>
					</main>
				</AppTabView>
			);
		}}
	</Subscribe>
);

Trades.propTypes = {
	state: PropTypes.object.isRequired,
};

export default withState(Trades, {}, {
	async componentDidMount() {
		this.setState({
			stats: await appContainer.swapDB.statsSinceLastMonth(),
		});
	},
});
