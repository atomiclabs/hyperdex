import React from 'react';
import {classNames} from 'react-extras';
import {Subscribe} from 'unstated';
import {withState} from 'containers/SuperContainer';
import appContainer from 'containers/App';
import exchangeContainer from 'containers/Exchange'; // TODO(sindresorhus): Find a better place to have the SwapDB data, since both the Exchange and Trades view uses it
import tradesContainer from 'containers/Trades';
import View from 'components/View';
import SwapList from 'components/SwapList';
import {formatCurrency} from '../util';
import AppTabView from './TabView';
import './Exchange/Swaps.scss';
import './Trades.scss';

const TabButton = props => (
	<span
		className={
			classNames(
				'button',
				{
					active: tradesContainer.state.activeView === props.component.name,
				}
			)
		}
		onClick={() => {
			tradesContainer.setActiveView(props.component.name);
		}}
	>
		{props.title}
	</span>
);

const TabView = ({component}) => (
	<View component={component} activeView={tradesContainer.state.activeView}/>
);

const OpenOrders = () => {
	const {state} = exchangeContainer;
	const filteredData = state.swapHistory.filter(x => !['completed', 'failed'].includes(x.status));
	return <SwapList swaps={filteredData} showCancel/>;
};

const SwapHistory = () => {
	const {state} = exchangeContainer;
	const filteredData = state.swapHistory.filter(x => ['completed', 'failed'].includes(x.status));
	return <SwapList swaps={filteredData} showCancel/>;
};

const Trades = props => (
	<Subscribe to={[tradesContainer, /* Temp => */exchangeContainer]}>
		{() => {
			const {state} = props;
			const {stats} = state;

			return (
				<AppTabView title="Trades" className="Trades">
					<header>
						<nav>
							<TabButton
								title="Open Orders"
								component={OpenOrders}
							/>
							<TabButton
								title="Swap History"
								component={SwapHistory}
							/>
						</nav>
						<div className="stats">
							{stats &&
								<p>In the last month you did {stats.successfulSwapCount} successful {stats.successfulSwapCount === 1 ? 'trade' : 'trades'} in {stats.currencyCount} {stats.currencyCount === 1 ? 'currency' : 'currencies'} worth {formatCurrency(stats.totalSwapsWorthInUsd)} in total</p>
							}
						</div>
					</header>
					<main>
						<TabView component={OpenOrders}/>
						<TabView component={SwapHistory}/>
					</main>
				</AppTabView>
			);
		}}
	</Subscribe>
);

export default withState(Trades, {}, {
	async componentDidMount() {
		/// TODO: This is only here temporarily until we move the swap stuff to the App container
		exchangeContainer.setSwapHistory();

		this.setState({
			stats: await appContainer.swapDB.statsSinceLastMonth(),
		});
	},
});
